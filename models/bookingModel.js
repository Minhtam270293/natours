const mongoose = require('mongoose');

const bookingTourSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: true
  },
  groupSize: {
    type: Number,
    required: true,
    min: 1
  },
  tourTotalPrice : { // pricePerPerson * groupSize
    type: Number,
    required: true,
    min: 0
  },
  name: { type: String, required: true },
  imageCover: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  tours: [bookingTourSchema],
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  coupon: String,
  bookingTotalPrice : { // Sum of all tour totalPrices, minus coupon if any
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;