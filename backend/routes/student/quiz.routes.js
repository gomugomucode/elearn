const express = require("express");
const router = express.Router();
const authenticateToken = require("../../middleware/authMiddleware");

const {
  listQuizzes,
  startQuiz,
  submitQuiz,
  getQuizResult
} = require("../../controllers/student/quiz.controller");

router.get("/", authenticateToken, listQuizzes);
router.get("/start/:quizId", authenticateToken, startQuiz);
router.post("/submit/:quizId", authenticateToken, submitQuiz);
router.get("/result/:quizId", authenticateToken, getQuizResult);

module.exports = router;
