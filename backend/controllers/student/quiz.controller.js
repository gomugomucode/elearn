const db = require("../../config/db");

/**
 * GET /api/student/quiz
 * List active quizzes
 */
exports.listQuizzes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT q.id, q.title, c.title AS courseName,
        (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = q.id) AS totalQuestions
      FROM quizzes q
      LEFT JOIN courses c ON c.id = q.course_id
      WHERE q.is_active = 1
      ORDER BY q.created_at DESC
    `);

    res.json({ quizzes: rows });
  } catch (err) {
    console.error("listQuizzes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/student/quiz/:quizId
 * Start quiz -> create a NEW attempt and return questions + attemptId
 */
exports.startQuiz = async (req, res) => {
  const quizId = Number(req.params.quizId);
  const studentId = req.user.id;

  try {
    const [[quiz]] = await db.query(
      "SELECT id, title, time_limit, is_active FROM quizzes WHERE id = ?",
      [quizId]
    );
    if (!quiz || quiz.is_active !== 1) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const [questions] = await db.query(
      "SELECT id, question_text, options FROM quiz_questions WHERE quiz_id = ? ORDER BY id ASC",
      [quizId]
    );

    if (questions.length === 0) {
      return res.status(400).json({ message: "Quiz has no questions" });
    }

    // Create attempt (summary)
    const [attemptRes] = await db.query(
      `INSERT INTO quiz_attempts
        (quiz_id, student_id, start_time, attempt_time, is_submitted, total_questions, correct_count, score_percent)
       VALUES (?, ?, NOW(), NOW(), 0, ?, 0, 0)`,
      [quizId, studentId, questions.length]
    );

    res.json({
      attemptId: attemptRes.insertId,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        time_limit: quiz.time_limit,
        questions: questions.map(q => ({
          id: q.id,
          question_text: q.question_text,
          options: JSON.parse(q.options || "[]"),
        })),
      },
    });
  } catch (err) {
    console.error("startQuiz:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/student/quiz/:quizId/submit
 * Body: { attemptId, answers }
 * answers = { [questionId]: selectedIndex }
 */
exports.submitQuiz = async (req, res) => {
  const quizId = Number(req.params.quizId);
  const studentId = req.user.id;
  const { attemptId, answers } = req.body || {};

  if (!attemptId || typeof answers !== "object" || answers === null) {
    return res.status(400).json({ message: "attemptId and answers are required" });
  }

  const conn = await db.getPool().getConnection();
  try {
    await conn.beginTransaction();

    const [[attempt]] = await conn.query(
      `SELECT id, quiz_id, student_id, start_time, is_submitted
       FROM quiz_attempts
       WHERE id = ? AND student_id = ?`,
      [attemptId, studentId]
    );

    if (!attempt || attempt.quiz_id !== quizId) {
      await conn.rollback();
      return res.status(400).json({ message: "Invalid attempt" });
    }

    if (attempt.is_submitted === 1) {
      await conn.rollback();
      return res.status(400).json({ message: "Attempt already submitted" });
    }

    const [[quiz]] = await conn.query(
      "SELECT time_limit FROM quizzes WHERE id = ?",
      [quizId]
    );

    const timeLimitMs = Number(quiz?.time_limit || 0) * 60 * 1000;
    const isLate =
      timeLimitMs > 0 &&
      Date.now() - new Date(attempt.start_time).getTime() > timeLimitMs;

    const [questions] = await conn.query(
      "SELECT id, correct_answer FROM quiz_questions WHERE quiz_id = ?",
      [quizId]
    );

    const total = questions.length;
    let correct = 0;

    // Upsert per-question answers
    for (const q of questions) {
      const selected = answers[q.id];

      // allow unanswered: store -1 (or skip storing)
      if (selected === undefined || selected === null || selected === "") continue;

      const selectedIndex = Number(selected);
      const isCorrect = String(selectedIndex) === String(q.correct_answer) ? 1 : 0;
      if (isCorrect) correct++;

      await conn.query(
        `INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE selected_index = VALUES(selected_index), is_correct = VALUES(is_correct)`,
        [attemptId, q.id, selectedIndex, isCorrect]
      );
    }

    const scorePercent = total === 0 ? 0 : Number(((correct / total) * 100).toFixed(2));

    await conn.query(
      `UPDATE quiz_attempts
       SET correct_count = ?, total_questions = ?, score_percent = ?,
           submitted_at = NOW(), attempt_time = NOW(), is_submitted = 1
       WHERE id = ?`,
      [correct, total, scorePercent, attemptId]
    );

    await conn.commit();

    res.json({
      message: isLate ? "Time over. Quiz auto-submitted." : "Quiz submitted successfully.",
      attemptId,
      correct,
      total,
      score: scorePercent,
      isLate,
    });
  } catch (err) {
    await conn.rollback();
    console.error("submitQuiz:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};

/**
 * GET /api/student/quiz/result/:quizId
 * Latest submitted attempt result (trust DB summary)
 */
exports.getQuizResult = async (req, res) => {
  const quizId = Number(req.params.quizId);
  const studentId = req.user.id;

  try {
    const [[row]] = await db.query(
      `SELECT q.title,
              qa.correct_count AS correct,
              qa.total_questions AS total,
              qa.score_percent AS score
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
       WHERE qa.quiz_id = ? AND qa.student_id = ? AND qa.is_submitted = 1
       ORDER BY qa.submitted_at DESC
       LIMIT 1`,
      [quizId, studentId]
    );

    if (!row) return res.status(404).json({ message: "Result not found" });

    res.json({ result: row });
  } catch (err) {
    console.error("getQuizResult:", err);
    res.status(500).json({ message: "Server error" });
  }
};
