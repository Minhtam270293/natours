const cron = require('node-cron');
const Tour = require('../../../models/tourModel');

cron.schedule('*/5 * * * * *', async () => {
  console.log('Getting low slot tours on schedule: ', new Date());
  const lowSlotTours = await Tour.find({
    remainingSlots: { $lte: 10 },
  }).select('name remainingSlots');

  if (lowSlotTours.length > 0) {
    lowSlotTours.forEach((tour) => {
      console.log(`${tour.name} has only ${tour.remainingSlots} slots`);
    });
  }

  console.log('---Finish getting low slot tours---');
});
