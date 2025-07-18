const promoRedis = require('../utils/redis/promo');

exports.createPromo = async function(req, res, next) {
  const { code, discountPercent, title, totalUses } = req.body;
  if (!code || !discountPercent || !title || !totalUses) {
    return res.status(400).json({ status: 'fail', message: 'All fields are required.' });
  }
  const promo = {
    code,
    discountPercent: Number(discountPercent),
    title,
    totalUses: Number(totalUses)
  };
  await promoRedis.setPromo(promo.code, promo);
  res.status(201).json({ status: 'success', data: { promo } });
};

exports.getAllPromos = async (req, res, next) => {
  
  const promos = await promoRedis.getAllPromos(); 
  res.status(200).json({ status: 'success', data: { promos } });
};

exports.applyPromo = async (req, res, next) => {
  const { promoCode } = req.body;
  if (!req.session.cart) return res.status(400).json({ message: 'Cart not found' });

  const promo = await promoRedis.getPromo(promoCode);
  if (!promo) return res.status(410).json({ message: 'Promo expired or invalid' });

  const remaining = await promoRedis.getRemaining(promoCode);
  if (!remaining || remaining <= 0) {
    return res.status(429).json({ message: 'Promo limit reached' });
  }

  req.session.cart.promoCode = promoCode;
  req.session.cart.discountPercent = promo.discountPercent;

  return res.json({
    subtotal: req.session.cart.subtotal,
    discount: req.session.cart.discount.toFixed(2),
    total: req.session.cart.total
  });
};

exports.removePromo = async (req, res, next) => {
  const { promoCode } = req.body;
 
  if (!req.session.cart) return res.status(400).json({ message: 'Cart not found' });

  if (!req.session.cart.promoCode || req.session.cart.promoCode !== promoCode) {
    return res.status(400).json({ message: 'No promo code applied or code mismatch' });
  }

  req.session.cart.promoCode = '';
  req.session.cart.discountPercent = 0;

  res.json({
    subtotal: req.session.cart.subtotal,
    discount: req.session.cart.discount.toFixed(2),
    total: req.session.cart.total
  });
};

exports.updatePromo = async (req, res, next) => {
  const { promoCode } = req.params;
  const { discountPercent, title, totalUses } = req.body;

  // Optionally: validate input here

  await promoRedis.updatePromo(promoCode, {
    discountPercent: Number(discountPercent),
    title,
    totalUses: Number(totalUses)
  });

  res.status(200).json({ status: 'success' });
};