const router = require("express").Router();
const quiz = require("../../controllers/teacher/quizController");
// const auth = require("../middleware/authMiddleware");
const auth = require("../../middleware/authMiddleware")


router.get("/quizzes", auth, quiz.listTeacherQuizzes);
router.post("/quizzes", auth, quiz.createTeacherQuiz);
router.get("/quizzes/:id", auth, quiz.getTeacherQuizById);
router.put("/quizzes/:id", auth, quiz.updateTeacherQuiz);
router.delete("/quizzes/:id", auth, quiz.deleteTeacherQuiz);

module.exports = router;
