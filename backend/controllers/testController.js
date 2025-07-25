const Test = require('../models/Test');
const Question = require('../models/Question');
const Discount = require('../models/Discount');
const Course = require('../models/Course');

exports.submitTest = async (req, res) => {
  try {
    const { email, phone, answers } = req.body;

    const existing = await Test.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted the test.' });
    }

    const questions = await Question.find();
    let score = 0;

    questions.forEach(q => {
      const qid = q._id.toString();
      const userAnswer = answers[qid]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer?.trim().toLowerCase();
      if (userAnswer && userAnswer === correctAnswer) {
        score++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const discounts = await Discount.find().sort({ minScore: 1 });
    let discountPercentage = 0;
    for (const discount of discounts) {
      if (percentage >= discount.minScore && percentage <= discount.maxScore) {
        discountPercentage = discount.discountPercentage;
        break;
      }
    }

    const testResult = new Test({ email, phone, answers, score });
    await testResult.save();

    const courses = await Course.find();
    const responseCourses = courses.map(c => ({
      course: c.courseName,
      originalFee: c.fee,
      discount: `${discountPercentage}%`,
      discountedFee: c.fee * (1 - discountPercentage / 100)
    }));

    res.json({ score, percentage: percentage.toFixed(2), courses: responseCourses });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or phone number already used for a test submission' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};