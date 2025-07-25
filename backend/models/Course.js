const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, unique: true },
  fee: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);