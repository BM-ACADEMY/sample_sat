const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, unique: true, required: true },
  fee: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);