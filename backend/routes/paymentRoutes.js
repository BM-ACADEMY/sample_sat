const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/payment/create-order', paymentController.createCourseOrder);
router.post('/payment/verify-payment', paymentController.verifyCoursePayment);
router.get('/payment/history', paymentController.getPaymentHistory);

module.exports = router;