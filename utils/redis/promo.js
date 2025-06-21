const client = require('./client');

exports.getPromo = async function (code) {
  const data = await client.get(`promo:${code}`);
  return data ? JSON.parse(data) : null;
};

exports.setPromo = async function (code, promoObj, initialUses) {
  await client.set(`promo:${code}`, JSON.stringify(promoObj));
  if (typeof initialUses === 'number') {
    await client.set(`promo:${code}:remaining`, initialUses);
  }
};

exports.getRemaining = async function (code) {
  return parseInt(await client.get(`promo:${code}:remaining`), 10);
};

exports.getReserveList = async function (code) {
  return await client.lRange(`promo:${code}:reserve`, 0, -1);
};

exports.reservePromoForOrder = async function (code, orderId) {
  const remainingKey = `promo:${code}:remaining`;
  const reserveKey = `promo:${code}:reserve`;

  // Use MULTI for atomicity
  const tx = client.multi();
  tx.decr(remainingKey);
  tx.rPush(reserveKey, orderId);
  const [remaining] = await tx.exec();

  if (remaining[1] < 0) {
    await client.incr(remainingKey);
    await client.lRem(reserveKey, 0, orderId);
    throw new Error('Promo limit reached');
  }
  return remaining[1];
};

exports.rollbackPromoReservation = async function (code, orderId) {
  const remainingKey = `promo:${code}:remaining`;
  const reserveKey = `promo:${code}:reserve`;

  const tx = client.multi();
  tx.incr(remainingKey);
  tx.lRem(reserveKey, 0, orderId);
  await tx.exec();
};