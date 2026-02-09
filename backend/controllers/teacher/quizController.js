const db = require("../../config/db");

/**
 * GET /api/teacher/quizzes
 */
exports.listTeacherQuizzes = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT q.id, q.title, q.time_limit, q.course_id, c.title AS course_title, q.created_at
       FROM quizzes q
       JOIN courses c ON c.id = q.course_id
       WHERE q.teacher_id = ?
       ORDER BY q.created_at DESC`,
      [teacherId]
    );
    res.json({ quizzes: rows });
  } catch (err) {
    console.error("listTeacherQuizzes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/teacher/quizzes
 * Body: { course_id, title, time_limit, questions:[{question_text, options[], correct_answer}] }
 */
exports.createTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const { course_id, title, time_limit, questions } = req.body || {};

  if (!course_id || !title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "course_id, title, and questions are required" });
  }

  const conn = await db.getPool().getConnection();
  try {
    await conn.beginTransaction();

    // ensure course belongs to teacher
    const [[course]] = await conn.query(
      "SELECT id FROM courses WHERE id = ? AND teacher_id = ?",
      [course_id, teacherId]
    );
    if (!course) {
      await conn.rollback();
      return res.status(403).json({ message: "You cannot create quiz for this course" });
    }

    const [quizRes] = await conn.query(
      `INSERT INTO quizzes (course_id, title, time_limit, teacher_id, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [course_id, title, Number(time_limit || 10), teacherId]
    );

    const quizId = quizRes.insertId;

    for (const q of questions) {
      const question_text = String(q.question_text || "").trim();
      const options = Array.isArray(q.options) ? q.options.map(String) : [];
      const correct_answer = Number(q.correct_answer);

      if (!question_text || options.length !== 4 || options.some(o => !o.trim())) {
        await conn.rollback();
        return res.status(400).json({ message: "Each question must have text + 4 options" });
      }
      if (![0, 1, 2, 3].includes(correct_answer)) {
        await conn.rollback();
        return res.status(400).json({ message: "correct_answer must be 0..3" });
      }

      await conn.query(
        `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
         VALUES (?, ?, ?, ?)`,
        [quizId, question_text, JSON.stringify(options), correct_answer]
      );
    }

    await conn.commit();
    res.json({ message: "Quiz created", id: quizId });
  } catch (err) {
    await conn.rollback();
    console.error("createTeacherQuiz:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};

/**
 * GET /api/teacher/quizzes/:id
 */
exports.getTeacherQuizById = async (req, res) => {
  const teacherId = req.user.id;
  const quizId = Number(req.params.id);

  try {
    const [[quiz]] = await db.query(
      `SELECT id, course_id, title, time_limit
       FROM quizzes
       WHERE id = ? AND teacher_id = ?`,
      [quizId, teacherId]
    );
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const [questions] = await db.query(
      `SELECT id, question_text, options, correct_answer
       FROM quiz_questions
       WHERE quiz_id = ?
       ORDER BY id ASC`,
      [quizId]
    );

    res.json({
      ...quiz,
      questions: questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: JSON.parse(q.options || "[]"),
        correct_answer: q.correct_answer,
      })),
    });
  } catch (err) {
    console.error("getTeacherQuizById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/teacher/quizzes/:id
 * Replace quiz questions fully (simple + reliable)
 */
exports.updateTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const quizId = Number(req.params.id);
  const { course_id, title, time_limit, questions } = req.body || {};

  if (!course_id || !title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "course_id, title, and questions are required" });
  }

  const conn = await db.getPool().getConnection();
  try {
    await conn.beginTransaction();

    const [[quiz]] = await conn.query(
      "SELECT id FROM quizzes WHERE id = ? AND teacher_id = ?",
      [quizId, teacherId]
    );
    if (!quiz) {
      await conn.rollback();
      return res.status(404).json({ message: "Quiz not found" });
    }

    const [[course]] = await conn.query(
      "SELECT id FROM courses WHERE id = ? AND teacher_id = ?",
      [course_id, teacherId]
    );
    if (!course) {
      await conn.rollback();
      return res.status(403).json({ message: "You cannot move quiz to this course" });
    }

    await conn.query(
      `UPDATE quizzes SET course_id = ?, title = ?, time_limit = ? WHERE id = ?`,
      [course_id, title, Number(time_limit || 10), quizId]
    );

    // Replace questions
    await conn.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quizId]);

    for (const q of questions) {
      const question_text = String(q.question_text || "").trim();
      const options = Array.isArray(q.options) ? q.options.map(String) : [];
      const correct_answer = Number(q.correct_answer);

      if (!question_text || options.length !== 4 || options.some(o => !o.trim())) {
        await conn.rollback();
        return res.status(400).json({ message: "Each question must have text + 4 options" });
      }
      if (![0, 1, 2, 3].includes(correct_answer)) {
        await conn.rollback();
        return res.status(400).json({ message: "correct_answer must be 0..3" });
      }

      await conn.query(
        `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
         VALUES (?, ?, ?, ?)`,
        [quizId, question_text, JSON.stringify(options), correct_answer]
      );
    }

    await conn.commit();
    res.json({ message: "Quiz updated" });
  } catch (err) {
    await conn.rollback();
    console.error("updateTeacherQuiz:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};

/**
 * DELETE /api/teacher/quizzes/:id
 */
exports.deleteTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const quizId = Number(req.params.id);

  try {
    const [r] = await db.query(
      "DELETE FROM quizzes WHERE id = ? AND teacher_id = ?",
      [quizId, teacherId]
    );
    if (r.affectedRows === 0) return res.status(404).json({ message: "Quiz not found" });
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    console.error("deleteTeacherQuiz:", err);
    res.status(500).json({ message: "Server error" });
  }
};
