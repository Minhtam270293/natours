const express = require('express')
const authController = require('../controllers/authController')
const cartController = require('../controllers/cartController');
const promoController = require('../controllers/promoController')


const router = express.Router();

router.post('/add', cartController.add);
router.post('/remove', cartController.remove);
router.post('/clear', cartController.clear);
router.post('/update', cartController.updateGroupSize);
router.post('/apply-promo', promoController.applyPromo);
router.post('/remove-promo', promoController.removePromo);



module.exports = router;