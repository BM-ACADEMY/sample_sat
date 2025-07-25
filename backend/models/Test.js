const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  answers: Object,
  score: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);