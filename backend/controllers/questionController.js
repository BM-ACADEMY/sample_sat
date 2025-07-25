const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || options.length === 0 || !correctAnswer) {
      return res.status(400).json({ error: 'Question, options, and correct answer are required' });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'Correct answer must be one of the provided options' });
    }
    const newQuestion = new Question({ question, options, correctAnswer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Question already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || options.length === 0 || !correctAnswer) {
      return res.status(400).json({ error: 'Question, options, and correct answer are required' });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: 'Correct answer must be one of the provided options' });
    }
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Question already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};