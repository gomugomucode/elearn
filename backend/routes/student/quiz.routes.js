const router = require("express").Router();
const quiz = require("../../controllers/student/quiz.controller");
const auth = require("../../middleware/authMiddleware");

router.get("/", auth, quiz.listQuizzes);                 // GET /api/student/quiz
router.get("/:quizId", auth, quiz.startQuiz);            // GET /api/student/quiz/:quizId
router.post("/:quizId/submit", auth, quiz.submitQuiz);   // POST /api/student/quiz/:quizId/submit
router.get("/result/:quizId", auth, quiz.getQuizResult); // GET /api/student/quiz/result/:quizId

module.exports = router;
