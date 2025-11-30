const express = require("express");
const auth = require("../../middleware/authMiddleware");
const quizController = require("../../controllers/student/quiz.controller");


const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.id,
        q.title,
        (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.quiz_id = q.id) AS totalQuestions
      FROM quizzes q
    `);

    res.json({ quizzes: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Add the new route here
router.get("/quizzes", auth, quizController.listQuizzes);

// Start a quiz
router.get("/start/:quizId", auth, quizController.getQuiz);

// Submit a quiz
router.post("/submit/:quizId", auth, quizController.submitQuiz);




module.exports = router;
