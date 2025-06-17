const promoRedis = require('../utils/redis/promo');

exports.createSamplePromo = async function() {
  const promo = {
    code: 'SUMMER50',
    promoDetails: {
      code: 'SUMMER50',
      discountPercent: 50,
      title: '🔥 50% off all tours!',
      expiresAt: Date.now() + 10 * 60 * 1000
    },
    ttl: 10 * 60,
    initialUses: 1000
  };

  await promoRedis.setPromo(
    promo.code,
    promo.promoDetails,
    promo.ttl,
    promo.initialUses
  );
  console.log('Sample promo created!');
};

exports.getActivePromo = async (req, res) => {
  // Optionally, fetch the active promo code from config or Redis
  const promo = await promoRedis.getPromo('SUMMER50'); // Replace with dynamic code if needed
  if (!promo) return res.status(204).send();
  res.json(promo);
};

exports.applyPromo = async (req, res) => {
  const { promoCode } = req.body;
  const promo = await promoRedis.getPromo(promoCode);
  if (!promo) return res.status(410).json({ message: 'Promo expired' });

  const remaining = await promoRedis.decrRemaining(promoCode);
  if (remaining < 0) {
    await promoRedis.incrRemaining(promoCode);
    return res.status(429).json({ message: 'Promo limit reached' });
  }

  if (!req.session.cart) req.session.cart = {};
  req.session.cart.promo = promoCode;
  res.json({ success: true, discount: promo.discountPercent });
};

exports.removePromo = async (req, res) => {
  const { promoCode } = req.body;
  await promoRedis.incrRemaining(promoCode);
  if (req.session.cart) delete req.session.cart.promo;
  res.json({ success: true });
};