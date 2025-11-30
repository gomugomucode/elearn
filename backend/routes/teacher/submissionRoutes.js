const express = require('express');
const router = express.Router();

// Controllers
const {
  getTeacherSubmissions,
  gradeTeacherSubmission,
  deleteTeacherSubmission // import the new function
} = require('../../controllers/teacher/submissionController');

// Middleware
const authenticateToken = require('../../middleware/authMiddleware');

// Get all submissions
router.get('/', authenticateToken, getTeacherSubmissions);

// Grade a submission
router.put('/:submissionId/grade', authenticateToken, gradeTeacherSubmission);

// Delete a submission
router.delete('/:submissionId', authenticateToken, deleteTeacherSubmission);

module.exports = router;
