const db = require("../../config/db");

// GET /api/student/quiz/start/:quizId
exports.getQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const [quizRows] = await db.query(
      "SELECT id, title, course_id FROM quizzes WHERE id = ?", 
      [quizId]
    );

    if (!quizRows.length) 
      return res.status(404).json({ message: "Quiz not found" });

    const [questionRows] = await db.query(
      "SELECT id, question_text, options, correct_answer FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    const questions = questionRows.map(q => ({
      id: q.id,
      question: q.question_text,
      options: JSON.parse(q.options)
    }));

    res.json({ quiz: { ...quizRows[0], questions } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/student/quiz/submit/:quizId
exports.submitQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  const userId = req.user.id;
  const { answers } = req.body;

  try {
    for (const questionId in answers) {
      const answer = answers[questionId];
      await db.query(
        "INSERT INTO quiz_answers (user_id, quiz_id, question_id, answer) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE answer=?",
        [userId, quizId, questionId, answer, answer]
      );
    }

    res.json({ message: "Quiz submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.listQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.id, q.title, q.course_id,
      (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) AS totalQuestions
      FROM quizzes q
    `);

    res.json({ quizzes: rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
