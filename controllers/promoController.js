const promoRedis = require('../utils/redis/promo');

exports.createSamplePromo = async function() {
  const promo = {
    code: 'SUMMER50',
    promoDetails: {
      code: 'SUMMER50',
      discountPercent: 50,
      title: '🔥 50% off all tours!',
    },
    initialUses: 10
  };

  await promoRedis.setPromo(
    promo.code,
    promo.promoDetails,
    promo.initialUses
  );
  console.log('Sample promo created!');
};

exports.getActivePromo = async (req, res, next) => {
  // Optionally, fetch the active promo code from config or Redis
  const promo = await promoRedis.getPromo('SUMMER50'); // Replace with dynamic code if needed
  if (!promo) return res.status(204).send();
  res.json(promo);
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
  req.session.cart.discount = 0;

  res.json({
    subtotal: req.session.cart.subtotal,
    discount: req.session.cart.discount.toFixed(2),
    total: req.session.cart.total
  });
};