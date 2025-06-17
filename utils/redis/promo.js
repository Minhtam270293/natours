const client = require('./client');

exports.getPromo = async function (code) {
  const data = await client.get(`promo:${code}`);
  return data ? JSON.parse(data) : null;
};

exports.setRemaining = async function (code, count, ttl) {
  await client.set(`promo:${code}:remaining`, count, { EX: ttl });
};

exports.setPromo = async function (code, promoObj, ttl, initialUses) {
  await client.set(`promo:${code}`, JSON.stringify(promoObj), { EX: ttl });
  if (typeof initialUses === 'number') {
    await client.set(`promo:${code}:remaining`, initialUses, { EX: ttl });
  }
};

exports.getRemaining = async function (code) {
  return parseInt(await client.get(`promo:${code}:remaining`), 10);
};

exports.decrRemaining = async function (code) {
  return await client.decr(`promo:${code}:remaining`);
};

exports.incrRemaining = async function (code) {
  return await client.incr(`promo:${code}:remaining`);
};

exports.addOrderToReserve = async function (code, orderId) {
  return await client.rPush(`promo:${code}:reserve`, orderId);
};

exports.removeOrderFromReserve = async function (code, orderId) {
  return await client.lRem(`promo:${code}:reserve`, 0, orderId);
};

exports.getReserveList = async function (code) {
  return await client.lRange(`promo:${code}:reserve`, 0, -1);
};