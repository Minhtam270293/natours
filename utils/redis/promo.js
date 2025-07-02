const client = require('./client');

exports.getAllPromos = async function() {
  const keys = await client.keys('promo:*:generalInfo');
  return await Promise.all(
    keys.map(async key => {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    })
  );
};

exports.getPromo = async function (code) {
  const data = await client.get(`promo:${code}:generalInfo`);
  return data ? JSON.parse(data) : null;
};

exports.setPromo = async function (code, promoObj) {
  await client.set(`promo:${code}:generalInfo`, JSON.stringify(promoObj));
};

exports.getReserveList = async function (code) {
  return await client.lRange(`promo:${code}:reserve`, 0, -1);
};

exports.getRemaining = async function (code) {
  const promo = await exports.getPromo(code);
  if (!promo) return 0;
  const reserveList = await exports.getReserveList(code);
  return promo.totalUses - reserveList.length;
};

exports.reservePromoForOrder = async function (code, orderId) {
  const reserveKey = `promo:${code}:reserve`;
  let success = false;
  let attempts = 0;
  const promo = await exports.getPromo(code);


  while (!success && attempts < 5) {
    attempts++;
    await client.watch(reserveKey);

    const reserveList = await client.lRange(reserveKey, 0, -1);
    if (!promo) {
      await client.unwatch();
      throw new Error('Promo not found');
    }
    const remaining = promo.totalUses - reserveList.length;

    if (remaining <= 0) {
      await client.unwatch();
      throw new Error('Promo limit reached');
    }

    const multi = client.multi();
    multi.rPush(reserveKey, orderId);

    const execResult = await multi.exec();
    if (execResult) {
      // Transaction succeeded
      success = true;
    }
    // else: Transaction failed due to concurrent modification, retry
  }

  if (!success) {
    throw new Error('Could not reserve promo due to high contention. Please try again.');
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