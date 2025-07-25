const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Test = require('../models/Test');
const Discount = require('../models/Discount');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { courseId, email } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find the user's test score
    const test = await Test.findOne({ email });
    if (!test) {
      return res.status(404).json({ error: 'Test result not found' });
    }

    // Calculate discount based on test score
    const questions = await Question.find();
    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? (test.score / totalQuestions) * 100 : 0;

    const discounts = await Discount.find().sort({ minScore: 1 });
    let discountPercentage = 0;
    for (const discount of discounts) {
      if (percentage >= discount.minScore && percentage <= discount.maxScore) {
        discountPercentage = discount.discountPercentage;
        break;
      }
    }

    // Calculate discounted fee
    const discountedFee = course.fee * (1 - discountPercentage / 100);

    // Create Razorpay order
    const options = {
      amount: Math.round(discountedFee * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${courseId}_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      courseName: course.courseName,
      discountedFee,
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment verified, you can save payment details to database here
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};