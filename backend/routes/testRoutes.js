const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router.post('/submit-test', testController.submitTest);
router.get('/tests', testController.getTests);
router.post('/create-order', testController.createOrder);
router.post('/verify-payment', testController.verifyPayment);

module.exports = router;