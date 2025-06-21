const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const promoRedis = require('../utils/redis/promo');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.viewCart = async (req, res) => {
  const promo = await promoRedis.getPromo('SUMMER50');
  const promoCodeRemaining = await promoRedis.getRemaining('SUMMER50');
  res.locals.cart = req.session.cart.getCart();

  res.status(200).render('cart', {
    title: 'Cart details',
    promo,
    promoCodeRemaining
  });
};

exports.viewCheckoutSuccess = (req, res) => {
  res.status(200).render('checkoutSuccess', {
    title: 'Cheking out successfully'
  })
}

exports.viewCheckoutCancel = (req, res) => {
  res.status(200).render('checkoutCancel', {
    title: 'Cheking out failed'
  })
}

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create an account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});

exports.viewBooking = async (req, res) => {

  const bookings = await Booking.find({ user: req.user.id }).populate('tours.tour');

  res.status(200).render('booking', {
    title: 'My bookings',
    bookings
  });
};

exports.viewAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate('user').populate('tours.tour');
  res.status(200).render('allBookings', {
    title: 'Manage All Bookings',
    bookings
  });
};

exports.viewAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).render('allUsers', {
    title: 'Manage All Users',
    users
  });
};

exports.viewEditUser = async (req, res) => {
  const userToEdit = await User.findById(req.params.id);
  res.status(200).render('editUser', {
    title: 'Edit user',
    userToEdit
  });
};
