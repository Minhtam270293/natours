const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Promotion must have a name'],
      trim: true
    },
    code: String,
    description: {
      type: String,
      trim: true
    },
    discountPercent: {
      type: Number,
      required: [true, 'Promotion must have a discount percentage'],
      validate: {
        validator: function (val) {
          return val >= 0 && val <= 100;
        },
        message: `Discount percentage must be between 0 and 100.`
      }
    },
    slotLimit: {
      type: Number,
      required: [true, 'Promotion must define a slot limit']
    },
    usageCount: {
  type: Number,
  default: 0
},
    tours: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Promotion must belong to at least one tour']
    }],
    startDate: {
      type: Date,
      required: [true, 'Promotion must have a start date']
    },
    endDate: {
      type: Date,
      required: [true, 'Promotion must have an end date'],
      validate: {
        validator: function (val) {
          return val > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;
