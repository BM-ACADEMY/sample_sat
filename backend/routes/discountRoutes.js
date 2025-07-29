// discountRoutes.js

const express = require('express');
const router = express.Router();
// Update this line to import the new function
const discountController = require('../controllers/discountController');

router.post('/', discountController.createDiscount);
router.get('/', discountController.getDiscounts);

// ---- Add this new route here ----
router.get('/:id', discountController.getDiscountById); // Fetches a single discount by ID

router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

module.exports = router;