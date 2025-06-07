const Promotion = require('../models/promotionModel');
const catchAsync = require('../utils/catchAsync');


exports.createPromotion = catchAsync(async (req, res, next) => {
  const promotion = await Promotion.create(req.body);

  res.status(201).json({
    status: 'success',
    data: promotion
  });
});