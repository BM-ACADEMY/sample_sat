const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { mainHeading, questions } = req.body;
    if (!mainHeading || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Main heading and at least one question are required' });
    }

    for (const q of questions) {
      if (!q.questionText || !q.options || !Array.isArray(q.options) || q.options.length === 0 || !q.correctAnswer) {
        return res.status(400).json({ error: 'Each question must have text, options, and correct answer' });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ error: 'Correct answer must be one of the provided options' });
      }
    }

    const newQuestion = new Question({ mainHeading, questions });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
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
    if (!question) return res.status(404).json({ error: 'Question set not found' });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { mainHeading, questions } = req.body;
    if (!mainHeading || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Main heading and at least one question are required' });
    }

    for (const q of questions) {
      if (!q.questionText || !q.options || !Array.isArray(q.options) || q.options.length === 0 || !q.correctAnswer) {
        return res.status(400).json({ error: 'Each question must have text, options, and correct answer' });
      }
      if (!q.options.includes(q.correctAnswer)) {
        return res.status(400).json({ error: 'Correct answer must be one of the provided options' });
      }
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { mainHeading, questions },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Question set not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Question set not found' });
    res.json({ message: 'Question set deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};