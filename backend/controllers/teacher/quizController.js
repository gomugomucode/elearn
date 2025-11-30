// controllers/teacher/quizController.js
const db = require('../../config/db');

// Get all quizzes for teacher
const getTeacherQuizzes = async (req, res) => {
  const teacherId = req.user.id; // from authenticateToken
  try {
    const [quizzes] = await db.query(
      `SELECT q.id, q.course_id, q.title, q.time_limit, q.is_active,
              c.title AS course_title
       FROM quizzes q
       LEFT JOIN courses c ON q.course_id = c.id
       WHERE q.teacher_id = ?`,
      [teacherId]
    );

    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



const getTeacherQuizById = async (req, res) => {
  const { id } = req.params;

  try {
    // Get quiz details
    const [quizRows] = await db.query(
      'SELECT * FROM quizzes WHERE id = ?',
      [id]
    );

    if (!quizRows.length) return res.status(404).json({ message: 'Quiz not found' });

    const quiz = quizRows[0];

    // Get quiz questions
    const [questionRows] = await db.query(
      'SELECT * FROM quiz_questions WHERE quiz_id = ?',
      [id]
    );

    // Ensure options is always an array
    const questions = questionRows.map(q => ({
      ...q,
      options: (() => {
        if (!q.options) return ["", "", "", ""];
        try {
          return JSON.parse(q.options);
        } catch {
          return ["", "", "", ""]; // fallback if parsing fails
        }
      })()
    }));

    res.json({ ...quiz, questions });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTeacherQuizById };

// Create new quiz
const createTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const { course_id, title, time_limit, questions } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO quizzes (course_id, title, time_limit, teacher_id)
       VALUES (?, ?, ?, ?)`,
      [course_id, title, time_limit, teacherId]
    );

    const quizId = result.insertId;

    // Insert questions
    if (questions && questions.length) {
      const questionPromises = questions.map(q =>
        db.query(
          `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
           VALUES (?, ?, ?, ?)`,
          [quizId, q.question_text, JSON.stringify(q.options), q.correct_answer]
        )
      );
      await Promise.all(questionPromises);
    }

    res.status(201).json({ id: quizId, course_id, title, time_limit, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update quiz and questions
const updateTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const quizId = req.params.id;
  const { course_id, title, time_limit, questions } = req.body;

  try {
    // Update quiz
    await db.query(
      `UPDATE quizzes SET course_id = ?, title = ?, time_limit = ? 
       WHERE id = ? AND teacher_id = ?`,
      [course_id, title, time_limit, quizId, teacherId]
    );

    // Delete old questions
    await db.query(`DELETE FROM quiz_questions WHERE quiz_id = ?`, [quizId]);

    // Insert new questions
    if (questions && questions.length) {
      const questionPromises = questions.map(q =>
        db.query(
          `INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer)
           VALUES (?, ?, ?, ?)`,
          [quizId, q.question_text, JSON.stringify(q.options), q.correct_answer]
        )
      );
      await Promise.all(questionPromises);
    }

    res.json({ message: "Quiz updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete quiz
const deleteTeacherQuiz = async (req, res) => {
  const teacherId = req.user.id;
  const quizId = req.params.id;

  try {
    await db.query(
      `DELETE FROM quizzes WHERE id = ? AND teacher_id = ?`,
      [quizId, teacherId]
    );
    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getTeacherQuizzes,
  getTeacherQuizById,
  createTeacherQuiz,
  updateTeacherQuiz,
  deleteTeacherQuiz
};
