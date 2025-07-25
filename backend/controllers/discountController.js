const Discount = require('../models/Discount');

exports.createDiscount = async (req, res) => {
  try {
    const { minScore, maxScore, discountPercentage } = req.body;
    if (minScore > maxScore) {
      return res.status(400).json({ error: 'Min score cannot be greater than max score' });
    }
    const newDiscount = new Discount({ minScore, maxScore, discountPercentage });
    await newDiscount.save();
    res.status(201).json(newDiscount);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Discount with these score ranges already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ minScore: 1 });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDiscount = async (req, res) => {
  try {
    const { minScore, maxScore, discountPercentage } = req.body;
    if (minScore > maxScore) {
      return res.status(400).json({ error: 'Min score cannot be greater than max score' });
    }
    const updated = await Discount.findByIdAndUpdate(
      req.params.id,
      { minScore, maxScore, discountPercentage },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Discount not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Discount with these score ranges already exists' });
    }
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