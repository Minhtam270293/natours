const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/me/booking', authController.protect, viewsController.viewBooking);
router.get('/cart', authController.isLoggedIn, viewsController.viewCart)
router.get('/cart/success', authController.isLoggedIn, viewsController.viewCheckoutSuccess)
router.get('/cart/cancel', authController.isLoggedIn, viewsController.viewCheckoutCancel)
router.get('/bookings', authController.protect, authController.restrictTo('admin'), viewsController.viewAllBookings)
router.get('/users', authController.protect, authController.restrictTo('admin'), viewsController.viewAllUsers)
router.get('/users/:id/edit', authController.protect, authController.restrictTo('admin'), viewsController.viewEditUser)


router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
