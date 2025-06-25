'use strict';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const mongoose = require('mongoose');
const promoRedis = require('../utils/redis/promo');

// Add a tour to the cart
exports.add = async (req, res, next) => {
  const id = req.body.id;
  const orderSize = isNaN(req.body.orderSize) ? 1 : parseInt(req.body.orderSize);

    try {
        const tour = await Tour.findById(id);
        if (tour) {

          if(req.session.cart.items[tour._id]) {
            return res.status(400).json({ message: 'Tour already in cart'})
          }

            req.session.cart.addTour(tour, orderSize);
            return res.json({ quantity: req.session.cart.quantity });
        } 
        
        return res.status(404).json({ message: 'Tour not found' });
        
    } catch (err) {
        console.error('❌ Error in controller.add:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.remove = (req, res) => {
  req.session.cart.remove(req.body.id);
  return res.redirect('/cart');
};

exports.clear = (req, res) => {
  req.session.cart.clear();
  return res.redirect('/cart');
};

const updateTourSlots = async function(tourId, groupSize) {
  // Ensure tourId is a valid ObjectId
  let id = tourId;
  if (typeof tourId === 'string' && mongoose.Types.ObjectId.isValid(tourId)) {
    id = mongoose.Types.ObjectId(tourId);
  }
  // Debug: log what we're updating
  console.log('[updateTourSlots] tourId:', id, 'groupSize:', groupSize);
  const result = await Tour.findByIdAndUpdate(
    id,
    { $inc: { remainingSlots: -groupSize } },
    { new: true }
  );
  // Debug: log the result
  console.log('[updateTourSlots] update result:', result);
}

const createBookingFromCart = async (user, cart) => {

  if (!cart || Object.keys(cart.items).length === 0) {
    throw new Error('Cart is empty');
  }

  const cartItems = Object.values(cart.items);
  const tours = [];
  let bookingTotalPrice = 0;

  for (const item of cartItems) {
    const tour = await Tour.findById(item.tour._id);
    if (!tour) throw new Error('One or more tours in your cart are no longer available.');
    const groupSize = Number(item.groupSize);
    const tourTotalPrice = Number(item.totalPrice);
    tours.push({
      tour: tour._id,
      groupSize,
      tourTotalPrice,
      name: tour.name,
      imageCover: tour.imageCover
    });
  } 
  bookingTotalPrice = Number(cart.total);

  const booking = await Booking.create({
    user: user._id,
    tours,
    bookingTotalPrice,
    coupon: cart.promoCode || undefined // store the promo code if used
  });

  // Reserve promo usage if a promo code was used
  if (cart.promoCode) {
    await promoRedis.reservePromoForOrder(cart.promoCode, booking._id.toString());
  }

  for (const item of booking.tours) {
    await updateTourSlots(item.tour, item.groupSize);
  }

  return booking;
};

exports.createStripeSession = async (req, res) => {
  try {
    // 1. Create the booking from the cart
    const booking = await createBookingFromCart(req.user, req.session.cart);

    // Store booking ID in session for cancel handling
    req.session.booking = { id: booking._id.toString() };

    // 2. Build Stripe line items directly from booking.tours
    const lineItems = booking.tours.map(tourItem => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: tourItem.name,
          images: [`${req.protocol}://${req.get('host')}/img/tours/${tourItem.imageCover}`],
        },
        unit_amount: Math.round((tourItem.tourTotalPrice / tourItem.groupSize) * 100),
      },
      quantity: tourItem.groupSize,
    }));

    // 3. Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/cart/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart/cancel`,
      metadata: {
        bookingId: booking._id.toString(),
      }
    });

    // 4. Respond with the session ID
    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    res.status(500).send('Checkout failed');
  }
};

exports.updateGroupSize = (req, res, next) => {
  const { id, orderSize } = req.body;

  if (!id || !orderSize || orderSize < 1) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Validate existence of item
  const item = req.session.cart.items[id];
  if (!item) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  // Update group size
  const updatedItem = req.session.cart.updateTourSize(id, parseInt(orderSize));
  
  res.status(200).json({
    updatedItemTotal: updatedItem.totalPrice,
    subtotal: req.session.cart.subtotal,
    discount: req.session.cart.discount.toFixed(2),
    total: req.session.cart.total
  });
};



const restoreSlotsForBooking = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) return;

  // Restore slots for each tour in the booking
  for (const tourItem of booking.tours) {
    await Tour.findByIdAndUpdate(
      tourItem.tour,
      { $inc: { remainingSlots: tourItem.groupSize } }
    );
  }
};

exports.updateBookingStatus = async (bookingId, status) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status },
    { new: true }
  );
  // If cancelled, restore slots
  if (status === 'cancelled' && booking) {
    await restoreSlotsForBooking(bookingId);
  }
  return booking;
};

exports.webhookCheckout = async (req, res) => {
  // Stripe webhook received
  console.log('Stripe webhook received');
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    try {
      await exports.updateBookingStatus(bookingId, 'paid');
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to update booking status from Stripe session' });
    }
  }

  // Handle payment cancelled event
  if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    try {
      // 1. Set booking status to cancelled
      await exports.updateBookingStatus(bookingId, 'cancelled');
      // 2. Rollback promo reservation if promo was used
      const booking = await Booking.findById(bookingId);
      if (booking && booking.coupon) {
        await promoRedis.rollbackPromoReservation(booking.coupon, bookingId);
      }
      // 3. Restore tour slots
      await exports.restoreSlotsForBooking(bookingId);
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to rollback after payment cancel/expire' });
    }
  }

  res.status(200).json({ received: true });
};

exports.handleCheckoutCancel = async (req, res, next) => {
  const bookingId = req.session.booking && req.session.booking.id;  
  if (bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) return next();

      // Only cancel if still pending
      if (booking.status === 'pending') {
        // 1. Update booking status which also restores tour slots
        await exports.updateBookingStatus(bookingId, 'cancelled');
        
        // 2. Rollback promo reservation if used
        if (booking.coupon) {
          await promoRedis.rollbackPromoReservation(booking.coupon, bookingId);
        }

        // 3. Clear cart
        req.session.cart.clear();
        // 4. Clear booking from session
        delete req.session.booking;
      }
    } catch (err) {
      // Log error but continue to render page
      // Webhook will handle cleanup if this fails
      console.error('Error in handleCheckoutCancel:', err);
    }
  }
  next();
};
