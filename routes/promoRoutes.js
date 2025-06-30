const express = require('express')
const promoController = require('../controllers/promoController')
const authController = require('../controllers/authController')


const router = express.Router();

router.route('/').post(authController.protect,authController.restrictTo('admin'),promoController.createPromo);

router.route('/:promoCode')
.patch(authController.protect,
    authController.restrictTo('admin'),
    promoController.updatePromo);

module.exports = router;
