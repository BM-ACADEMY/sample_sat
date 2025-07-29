// models/Test.js

const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Add this line
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  answers: Object,
  score: Number,
  questionSetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', testSchema);