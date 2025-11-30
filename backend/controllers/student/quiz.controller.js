const db = require("../../config/db");

// List all available quizzes for student
exports.listQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.id, 
        q.title, 
        c.title AS courseName,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) AS totalQuestions
      FROM quizzes q
      LEFT JOIN courses c ON c.id = q.course_id
      WHERE q.is_active = 1
    `);

    res.json({ quizzes: rows });
  } catch (err) {
    console.error("listQuizzes error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Start a quiz
exports.startQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  const userId = req.user.id;

  try {
    // Get quiz info
    const [quizRows] = await db.query(
      "SELECT id, title, course_id, time_limit FROM quizzes WHERE id = ?",
      [quizId]
    );
    if (!quizRows.length) return res.status(404).json({ message: "Quiz not found" });
    const quiz = quizRows[0];

    // Check if attempt exists
    const [attempts] = await db.query(
      "SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?",
      [quizId, userId]
    );

    let attempt;
    if (attempts.length === 0) {
      const [result] = await db.query(
        "INSERT INTO quiz_attempts (quiz_id, student_id, score, start_time, answers) VALUES (?, ?, ?, NOW(), ?)",
        [quizId, userId, 0, '{}']
      );
      attempt = { id: result.insertId, start_time: new Date() };
    } else {
      attempt = attempts[0];
    }

    // Get questions
    const [questionRows] = await db.query(
      "SELECT id, question_text, options, correct_answer FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    const questions = questionRows.map(q => ({
      id: q.id,
      question: q.question_text,
      options: JSON.parse(q.options)
    }));

    res.json({ 
      quiz: { ...quiz, questions }, 
      attemptId: attempt.id,
      startTime: attempt.start_time
    });
  } catch (err) {
    console.error("startQuiz error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Submit quiz
exports.submitQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  const userId = req.user.id;
  const { answers } = req.body;

  try {
    const [[quiz]] = await db.query("SELECT time_limit FROM quizzes WHERE id = ?", [quizId]);
    const [[attempt]] = await db.query(
      "SELECT * FROM quiz_attempts WHERE quiz_id = ? AND student_id = ?",
      [quizId, userId]
    );

    if (!attempt) return res.status(400).json({ message: "Quiz not started yet." });

    // Check time limit
    const startTime = new Date(attempt.start_time);
    const now = new Date();
    const timeLimitMs = quiz.time_limit * 60 * 1000;
    if (now - startTime > timeLimitMs) {
      return res.status(400).json({ message: "Time is up! Please restart the quiz." });
    }

    // Update answers
    await db.query(
      "UPDATE quiz_attempts SET answers = ?, score = ? WHERE id = ?",
      [JSON.stringify(answers), 0, attempt.id]
    );

    res.json({ message: "Quiz submitted successfully" });
  } catch (err) {
    console.error("submitQuiz error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
