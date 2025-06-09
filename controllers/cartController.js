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


controller.checkout = async (req, res) => {
  if (!req.session.cart || Object.keys(req.session.cart.items).length === 0) {
    return res.redirect('/cart');
  }

  const cartItems = Object.values(req.session.cart.items);
  const lineItems = [];
  const bookingData = [];

  for (const item of cartItems) {
    // Fetch the latest tour data
    const tour = await Tour.findById(item.tour._id);
    if (!tour) {
      return res.status(400).send('One or more tours in your cart are no longer available.');
    }

    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: tour.name,
          images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
        },
        unit_amount: Math.round(tour.price * 100),
      },
      quantity: item.groupSize,
    });

    bookingData.push({
      tourId: tour._id.toString(),
      groupSize: item.groupSize,
      totalPrice: item.groupSize * tour.price
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/cart/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        bookings: JSON.stringify(bookingData)
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

const createBookingCheckout = async (session) => {
  try {
    const userId = session.metadata.userId;
    const bookingsData = JSON.parse(session.metadata.bookings);
    const bookings = await Promise.all(
      bookingsData.map(item =>
        Booking.create({
          tour: item.tourId,
          user: userId,
          groupSize: item.groupSize,
          price: item.totalPrice,
          paid: true
        })
      )
    );
    return bookings;
  } catch (err) {
    console.error('Error creating bookings from Stripe session:', err);
    throw err;
  }
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
    try {
      await createBookingCheckout(session);
    } catch (err) {
      return res.status(500).json({ status: 'error', message: 'Failed to create bookings from Stripe session' });
    }
  }

  res.status(200).json({ received: true });
};

module.exports = controller;