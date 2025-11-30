const express = require('express');
const router = express.Router();

// Auth & Role middlewares
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');

// Controllers
const dashboardController = require('../../controllers/teacher/dashboardController');

// Teacher-related routes
const quizRoutes = require('./quizRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const submissionRoutes = require('./submissionRoutes');
const courseRoutes = require('./courseRoutes');
const materialRoutes = require('./materialRoutes');
const studentRoutes = require('./studentRoutes');
const profileRoutes = require('./profileRoutes');

// Register routes
router.use('/quizzes', quizRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);
router.use('/courses', courseRoutes);
router.use('/materials', materialRoutes);
router.use('/students', studentRoutes);
router.use('/profile', profileRoutes);

// Teacher dashboard route
router.get(
  '/dashboard',
  authenticateToken,
  verifyRole('teacher'),
  dashboardController.getTeacherDashboard
);

module.exports = router;
