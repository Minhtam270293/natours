const express = require('express')
const authController = require('../controllers/authController')
const promotionController = require('../controllers/promotionController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', promotionController.createPromotion);

module.exports = router;