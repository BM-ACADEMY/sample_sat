// courseRoutes.js

const express = require('express');
const router = express.Router();
// Update this line to import the new function
const courseController = require('../controllers/courseController');

router.post('/', courseController.createCourse);
router.get('/', courseController.getCourses);

// ---- Add this new route here ----
router.get('/:id', courseController.getCourseById); // Fetches a single course by ID

router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;