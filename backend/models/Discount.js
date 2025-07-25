const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Discount', discountSchema);