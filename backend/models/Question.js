const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  mainHeading: { type: String, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);