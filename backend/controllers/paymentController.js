const Razorpay = require('razorpay');
const Payment = require('../models/Payment'); // Reusing the existing Payment model
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createCourseOrder = async (req, res) => {
  try {
    const { email, phone, courseName, amount } = req.body;

    if (!email || !phone || !courseName || !amount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate amount (ensure it matches one of the course offer prices)
    const validAmounts = [749, 999, 1299]; // From courses array: ₹749, ₹999, ₹1,299
    if (!validAmounts.includes(Number(amount))) {
      return res.status(400).json({ error: 'Invalid course amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `course_receipt_${Date.now()}`,
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
    console.error('Error creating course order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.verifyCoursePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          status: 'completed',
        }
      );
      res.json({ status: 'success' });
    } else {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .select('email phone courseName amount status razorpayPaymentId createdAt');
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payment history:', err);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};