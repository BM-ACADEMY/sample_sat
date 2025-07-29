const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { courseName, fee } = req.body;
    if (!courseName || !fee) {
      return res.status(400).json({ error: 'Course name and fee are required' });
    }
    const newCourse = new Course({ courseName, fee });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Course name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseName, fee } = req.body;
    if (!courseName || !fee) {
      return res.status(400).json({ error: 'Course name and fee are required' });
    }
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { courseName, fee },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Course name already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Add this function to courseController.js

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};