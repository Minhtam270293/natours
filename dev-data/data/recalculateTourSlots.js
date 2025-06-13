const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Booking = require('../../models/bookingModel');

dotenv.config({ path: '../../config.env' });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB connection successful');
    return recalculateSlots();
  })
  .then(() => {
    console.log('All tours updated!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function recalculateSlots() {
  const tours = await Tour.find();
  for (const tour of tours) {
    const bookings = await Booking.find({ tour: tour._id, paid: true });
    let bookedSlots = 0;
    for (const booking of bookings) {
      bookedSlots += booking.groupSize;
    }
    tour.remainingSlots = Math.max(0, tour.maxGroupSize - bookedSlots);
    await tour.save();
    console.log(`Tour "${tour.name}" has ${tour.remainingSlots} remaining slots`);
  }
}