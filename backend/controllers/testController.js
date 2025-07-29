// testController.js
const Test = require("../models/Test");
const Question = require("../models/Question");
const Discount = require("../models/Discount");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.submitTest = async (req, res) => {
  try {
    const { name, email, phone, answers, questionSetId } = req.body; // MODIFIED: Added 'name'

    // Validate input
    if (!name || !email || !phone || !questionSetId || !answers) { // MODIFIED: Added 'name' check
      return res.status(400).json({ error: 'Name, email, phone, question set ID, and answers are required' });
    }

    // Check for existing test submission
    const existing = await Test.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ error: 'You have already submitted the test.' });
    }

    const questionSet = await Question.findById(questionSetId);
    if (!questionSet) {
      return res.status(404).json({ error: 'Question set not found' });
    }

    // --- Score calculation logic remains the same ---
    let score = 0;
    const totalQuestions = questionSet.questions.length;
    questionSet.questions.forEach(q => {
      const qid = q._id.toString();
      const userAnswer = answers[qid]?.trim().toLowerCase();
      const correctAnswer = q.correctAnswer?.trim().toLowerCase();
      if (userAnswer && userAnswer === correctAnswer) {
        score++;
      }
    });
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const scaledScore = percentage;
    // --- End of score calculation ---


    // --- Discount logic remains the same ---
    const courses = await Course.find();
    const responseCourses = await Promise.all(courses.map(async (c) => {
        const discounts = await Discount.find({ courseId: c._id });
        let fixedAmount = c.fee;

        for (const discount of discounts) {
            if (percentage >= discount.minPercentage && percentage <= discount.maxPercentage) {
            fixedAmount = discount.fixedAmount;
            break;
            }
        }

        return {
            course: c.courseName,
            originalFee: c.fee,
            fixedAmount,
            discountApplied: fixedAmount !== c.fee
        };
    }));
    // --- End of discount logic ---


    // Save test result
    const testResult = new Test({ name, email, phone, answers, score: scaledScore, questionSetId }); // MODIFIED: Added 'name'
    await testResult.save();

    res.json({
      name: name, // ADDED
      score: scaledScore.toFixed(2),
      percentage: percentage.toFixed(2),
      courses: responseCourses,
      questionSet: questionSet.mainHeading
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email or phone number already used for a test submission' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getTests = async (req, res) => {
  try {
    // MODIFICATION: Add .populate() to fetch the mainHeading from the Question model
    const tests = await Test.find()
      .populate("questionSetId", "mainHeading") // <-- Add this line
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { email, phone, courseName, amount } = req.body;

    if (!email || !phone || !courseName || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const course = await Course.findOne({ courseName });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const test = await Test.findOne({ $or: [{ email }, { phone }] });
    if (!test) {
      return res
        .status(400)
        .json({ error: "No test submission found for this user" });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
      email,
      phone,
      courseName,
      amount,
      razorpayOrderId: order.id,
    });
    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: "completed",
        }
      );
      res.json({ status: "success" });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "failed" }
      );
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
