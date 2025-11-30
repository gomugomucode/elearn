// server/routes/teacher/submissionRoutes.js
const express = require('express');
const router = express.Router();

// Controllers
const { getTeacherSubmissions, gradeTeacherSubmission } = require('../../controllers/teacher/submissionController');

// Middleware
const authenticateToken = require('../../middleware/authMiddleware');

// Get all submissions for the logged-in teacher
router.get('/', authenticateToken, getTeacherSubmissions);

// Grade a specific submission
router.put('/:submissionId/grade', authenticateToken, gradeTeacherSubmission);

module.exports = router;
