const Tour = require('../../../models/tourModel');
const catchAsync = require('../../catchAsync');

/**
 * Task to monitor tours with low remaining slots
 * Runs every 5 minutes in production, can be adjusted as needed
 */
const checkLowSlotTours = catchAsync(async () => {
  try {
    const lowSlotTours = await Tour.find({
      remainingSlots: { $lte: 10 },
    }).select('name remainingSlots');

    if (lowSlotTours.length > 0) {
      console.log('--- Low Slot Tours Report ---');
      console.log('Time:', new Date().toISOString());
      lowSlotTours.forEach((tour) => {
        console.log(
          `[Warning] Tour: ${tour.name} - Only ${tour.remainingSlots} slots remaining`,
        );
      });
      console.log('---------------------------');
    }
  } catch (error) {
    console.error('[Cron Job Error] Failed to check low slot tours:', error);
  }
});

// Export job configuration
module.exports = {
  name: 'check low-slot tours',
  // Run every 5 seconds - adjust as needed
  schedule: '*/5 * * * * *',
  task: checkLowSlotTours,
};
