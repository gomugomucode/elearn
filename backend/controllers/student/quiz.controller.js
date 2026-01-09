const db = require("../../config/db");

/* =========================
   LIST QUIZZES
========================= */
exports.listQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.id, q.title, c.title AS courseName,
      (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) AS totalQuestions
      FROM quizzes q
      LEFT JOIN courses c ON c.id = q.course_id
      WHERE q.is_active = 1
    `);

    res.json({ quizzes: rows });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   START QUIZ (NEW ATTEMPT)
========================= */
exports.startQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  const studentId = req.user.id;

  try {
    const [[quiz]] = await db.query(
      "SELECT id, title, time_limit FROM quizzes WHERE id = ?",
      [quizId]
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Always create NEW attempt
    const [result] = await db.query(
      `INSERT INTO quiz_attempts (quiz_id, student_id, score, start_time, answers)
       VALUES (?, ?, 0, NOW(), '{}')`,
      [quizId, studentId]
    );

    const [questions] = await db.query(
      "SELECT id, question_text, options FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        time_limit: quiz.time_limit,
        questions: questions.map(q => ({
          id: q.id,
          question: q.question_text,
          options: JSON.parse(q.options)
        }))
      },
      attemptId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   SUBMIT QUIZ (FINAL)
========================= */
exports.submitQuiz = async (req, res) => {
  const quizId = req.params.quizId;
  const studentId = req.user.id;
  const { answers, attemptId } = req.body;

  try {
    const [[quiz]] = await db.query(
      "SELECT time_limit FROM quizzes WHERE id = ?",
      [quizId]
    );

    const [[attempt]] = await db.query(
      "SELECT * FROM quiz_attempts WHERE id = ? AND student_id = ?",
      [attemptId, studentId]
    );

    if (!attempt) {
      return res.status(400).json({ message: "Invalid attempt" });
    }

    // ⏱ Time check
    const timeLimitMs = quiz.time_limit * 60 * 1000;
    const isLate = Date.now() - new Date(attempt.start_time).getTime() > timeLimitMs;

    const [questions] = await db.query(
      "SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    let correct = 0;

    questions.forEach(q => {
      if (
        answers.hasOwnProperty(q.id) &&
        String(answers[q.id]) === String(q.correct_answer)
      ) {
        correct++;
      }
    });

    const total = questions.length;
    const score = Number(((correct / total) * 100).toFixed(2));

    await db.query(
      `UPDATE quiz_attempts
       SET answers = ?, score = ?, attempt_time = NOW()
       WHERE id = ?`,
      [JSON.stringify(answers), score, attemptId]
    );

    res.json({
      message: isLate
        ? "Time over. Quiz auto-submitted."
        : "Quiz submitted successfully.",
      score,
      correct,
      total
    });

  } catch (err) {
    console.error("submitQuiz error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   RESULT (TRUST DB)
========================= */
// exports.getQuizResult = async (req, res) => {
//   const quizId = req.params.quizId;
//   const studentId = req.user.id;

//   try {
//     const [[row]] = await db.query(`
//       SELECT q.title, qa.score,
//       (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) AS total
//       FROM quiz_attempts qa
//       JOIN quizzes q ON q.id = qa.quiz_id
//       WHERE qa.quiz_id = ? AND qa.student_id = ?
//       ORDER BY qa.attempt_time DESC
//       LIMIT 1
//     `, [quizId, studentId]);

//     if (!row) {
//       return res.status(404).json({ message: "Result not found" });
//     }

//     res.json({ result: row });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getQuizResult = async (req, res) => {
  const quizId = req.params.quizId;
  const studentId = req.user.id;

  try {
    // Get latest attempt
    const [[attempt]] = await db.query(`
      SELECT qa.id, qa.score, qa.answers, q.title
      FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.quiz_id = ? AND qa.student_id = ?
      ORDER BY qa.attempt_time DESC
      LIMIT 1
    `, [quizId, studentId]);

    if (!attempt) {
      return res.status(404).json({ message: "Result not found" });
    }

    // Get total questions
    const [questions] = await db.query(
      "SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    let correct = 0;
    const answers = JSON.parse(attempt.answers || '{}');

    questions.forEach(q => {
      if (answers.hasOwnProperty(q.id) &&
          String(answers[q.id]) === String(q.correct_answer)) {
        correct++;
      }
    });

    const total = questions.length;

    res.json({
      result: {
        title: attempt.title,
        correct,
        total,
        score: Number(((correct / total) * 100).toFixed(2)) // percentage
      }
    });

  } catch (err) {
    console.error("getQuizResult error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

