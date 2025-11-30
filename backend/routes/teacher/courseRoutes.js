const express = require('express');
const router = express.Router();

const auth = require('../../middleware/authMiddleware');
const role = require('../../middleware/roleMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  getAllCourses,
} = require('../../controllers/teacher/courseController');

// Create Course
router.post(
  '/',
  auth,
  role('teacher'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'course_image', maxCount: 1 } // rename to match frontend FormData
  ]),
  createCourse
);

// Get all courses of logged-in teacher
router.get('/teacher', auth, role('teacher'), getTeacherCourses);

// Update a course
router.put(
  '/:id',
  auth,
  role('teacher'),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'course_image', maxCount: 1 }
  ]),
  updateCourse
);

// Delete a course
router.delete('/:id', auth, role('teacher'), deleteCourse);

// Public route for students
router.get('/', getAllCourses);

module.exports = router;
