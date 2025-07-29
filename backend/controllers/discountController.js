const Discount = require('../models/Discount');
const Course = require('../models/Course');

exports.createDiscount = async (req, res) => {
  try {
    const { courseId, minPercentage, maxPercentage, fixedAmount } = req.body;
    if (!courseId || !minPercentage || !maxPercentage || !fixedAmount) {
      return res.status(400).json({ error: 'Course ID, min/max percentage, and fixed amount are required' });
    }
    if (minPercentage > maxPercentage) {
      return res.status(400).json({ error: 'Min percentage cannot be greater than max percentage' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const newDiscount = new Discount({ courseId, minPercentage, maxPercentage, fixedAmount });
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().populate('courseId').sort({ minPercentage: 1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { courseId, minPercentage, maxPercentage, fixedAmount } = req.body;
    if (!courseId || !minPercentage || !maxPercentage || !fixedAmount) {
      return res.status(400).json({ error: 'Course ID, min/max percentage, and fixed amount are required' });
    }
    if (minPercentage > maxPercentage) {
      return res.status(400).json({ error: 'Min percentage cannot be greater than max percentage' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    const updated = await Discount.findByIdAndUpdate(
      req.params.id,
      { courseId, minPercentage, maxPercentage, fixedAmount },
      { new: true }
    ).populate('courseId');
    if (!updated) return res.status(404).json({ error: 'Discount not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Discount not found' });
    res.json({ message: 'Discount deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this function to discountController.js

exports.getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id).populate('courseId');
    if (!discount) return res.status(404).json({ error: 'Discount not found' });
    res.json(discount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};