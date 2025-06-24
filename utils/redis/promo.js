const client = require('./client');

exports.getPromo = async function (code) {
  const data = await client.get(`promo:${code}`);
  return data ? JSON.parse(data) : null;
};

exports.setPromo = async function (code, promoObj) {
  await client.set(`promo:${code}`, JSON.stringify(promoObj));
};

exports.getReserveList = async function (code) {
  return await client.lRange(`promo:${code}:reserve`, 0, -1);
};

exports.getRemaining = async function (code) {
  const promo = await exports.getPromo(code);
  const reserveList = await exports.getReserveList(code);
  return promo.totalUses - reserveList.length;
};

exports.reservePromoForOrder = async function (code, orderId) {
  const reserveKey = `promo:${code}:reserve`;
  await client.rPush(reserveKey, orderId);
  const remaining = await exports.getRemaining(code);
  if (remaining < 0) {
    await client.lRem(reserveKey, 0, orderId);
    throw new Error('Promo limit reached');
  }
};

exports.rollbackPromoReservation = async function (code, orderId) {
  const reserveKey = `promo:${code}:reserve`;
  await client.lRem(reserveKey, 0, orderId);
};