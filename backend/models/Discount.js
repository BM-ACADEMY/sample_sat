const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  minPercentage: { type: Number, required: true },
  maxPercentage: { type: Number, required: true },
  fixedAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discount', discountSchema);