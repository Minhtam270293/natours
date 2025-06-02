'use strict';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel')


let controller = {};

controller.add = async (req, res, next) => {
    const id = req.body.id;
    const quantity = isNaN(req.body.quantity) ? 0 : parseInt(req.body.quantity);

    try {
        const tour = await Tour.findById(id); // Now this works for ObjectId strings
        if (tour) {
            req.session.cart.add(tour, quantity);
            return res.json({ quantity: req.session.cart.quantity });
        } else {
            return res.status(404).json({ message: 'Tour not found' });
        }
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

  const cart = req.session.cart.getCart();

  const lineItems = cart.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: [`${req.protocol}://${req.get('host')}/img/tours/${item.product.imageCover}`],
      },
      unit_amount: Math.round(item.product.price * 100), // cents
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/cart/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      customer_email: req.user.email, // if you have auth
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error('❌ Stripe error:', err);
    res.status(500).send('Checkout failed');
  }
};

controller.createBookingsFromCart = async (req, res, next) => {
  const cart = req.session.cart.getCart();
  const user = req.user;

  if (!cart || !cart.items || Object.keys(cart.items).length === 0) {
    return res.status(400).json({ status: 'fail', message: 'Cart is empty' });
  }

  try {
    const bookings = [];

    for (const id in cart.items) {
      const item = cart.items[id];

    console.log(typeof user._id);
      
      const booking = await Booking.create({
        tour: item.product._id,
        user: user._id,
        price: parseFloat(item.total),
        paid: true
      });

      bookings.push(booking);
    }

    // Clear cart from session
    req.session.cart.clear();

    res.status(201).json({
      status: 'success',
      message: 'Bookings created successfully',
      data: { bookings }
    });
  } catch (err) {
    console.error('Error creating bookings:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create bookings' });
  }
};


module.exports = controller;