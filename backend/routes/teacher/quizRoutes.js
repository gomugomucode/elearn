const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');

const {
  getTeacherQuizzes,
  getTeacherQuizById,
  createTeacherQuiz,
  updateTeacherQuiz,
  deleteTeacherQuiz
} = require('../../controllers/teacher/quizController');

// Only teachers can access these routes
router.use(authenticateToken, verifyRole('teacher'));

// Routes
router.get('/', getTeacherQuizzes);             // Get all quizzes
router.get('/:id', getTeacherQuizById);        // Get single quiz with questions
router.post('/', createTeacherQuiz);           // Create new quiz
router.put('/:id', updateTeacherQuiz);         // Update quiz & questions
router.delete('/:id', deleteTeacherQuiz);      // Delete quiz

module.exports = router;
