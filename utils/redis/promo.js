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

  const multi = client.multi();
  multi.rPush(reserveKey, orderId);
  multi.lRange(reserveKey, 0, -1);

  const [, reserveList] = await multi.exec();
  const promo = await exports.getPromo(code);

  const remaining = promo.totalUses - reserveList.length;

  if (remaining < 0) {
    // Remove the orderId if over limit
    await client.lRem(reserveKey, 0, orderId);
    throw new Error('Promo limit reached');
  }
};

exports.rollbackPromoReservation = async function (code, orderId) {
  const reserveKey = `promo:${code}:reserve`;
  await client.lRem(reserveKey, 0, orderId);
};

exports.updatePromo = async function (code, updatedFields) {
  // Get the current promo
  const promo = await exports.getPromo(code);
  if (!promo) throw new Error('Promo not found');
  // Update fields
  Object.assign(promo, updatedFields);
  // Save back to Redis
  await exports.setPromo(code, promo);
  return promo;
};