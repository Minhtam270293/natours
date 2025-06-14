'use strict';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel')


let controller = {};

controller.add = async (req, res, next) => {
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

controller.remove = (req, res) => {
  req.session.cart.remove(req.body.id);
  return res.redirect('/cart');
};

controller.clear = (req, res) => {
  req.session.cart.clear();
  return res.redirect('/cart');
};

controller.createBookingFromCart = async (user, cart) => {

  if (!cart || Object.keys(cart.items).length === 0) {
    throw new Error('Cart is empty');
  }

  const cartItems = Object.values(cart.items);
  const tours = [];
  let totalPrice = 0;

  for (const item of cartItems) {
    const tour = await Tour.findById(item.tour._id);
    if (!tour) throw new Error('One or more tours in your cart are no longer available.');
    tours.push({
      tour: tour._id,
      groupSize: item.groupSize,
      price: item.totalPrice // or item.price if per-person
    });
    totalPrice += item.totalPrice;
  } 

  const booking = await Booking.create({
    user: user._id,
    tours,
    totalPrice,
    // coupon: cart.coupon, // if you have coupon logic
    // status: 'pending' // default
  });

  return booking;
};

const createStripeSession = async (req, res) => {
  try {
    const booking = await createBookingFromCart(req.user, req.session.cart);

    // Fetch all tour details for the tours in the booking
    const tourIds = booking.tours.map(t => t.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    // Build a map for quick lookup
    const tourMap = {};
    tours.forEach(tour => {
      tourMap[tour._id.toString()] = tour;
    });

    // Build line items for Stripe
    const lineItems = booking.tours.map(tourItem => {
      const tour = tourMap[tourItem.tour.toString()];
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: tour.name,
            images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
          },
          unit_amount: Math.round(tourItem.pricePerPerson * 100),
        },
        quantity: tourItem.groupSize,
      };
    });

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

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    res.status(500).send('Checkout failed');
  }
};

controller.updateGroupSize = (req, res, next) => {
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

  return res.status(200).json({
    updatedItemTotal: updatedItem.totalPrice,
    subtotal: req.session.cart.subtotal,
    discount: req.session.cart.discount,
    total: req.session.cart.total
  });
};

controller.restoreSlotsForBooking = async (bookingId) => {
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

controller.updateBookingStatus = async (bookingId, status) => {
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

controller.webhookCheckout = async (req, res) => {
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
      await updateBookingStatus(bookingId, 'paid');

    } catch (err) {

      return res.status(500).json({ status: 'error', message: 'Failed to create bookings from Stripe session' });
    }
  }

  res.status(200).json({ received: true });
};

module.exports = controller;