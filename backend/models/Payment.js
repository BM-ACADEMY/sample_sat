const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  courseName: { type: String, required: true },
  amount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['created', 'completed', 'failed'], default: 'created' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);