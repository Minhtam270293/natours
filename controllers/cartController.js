'use strict';
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
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
        name: item.tour.name,
        images: [`https://natours.dev/img/tours/${item.tour.imageCover}`],
      },
      unit_amount: Math.round(item.tour.price * 100), // cents
    },
    quantity: item.groupSize,
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
      
      const booking = await Booking.create({
        tour: item.tour._id,
        user: user._id,
        groupSize: item.groupSize, 
        price: parseFloat(item.totalPrice),
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

module.exports = controller;