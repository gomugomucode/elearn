// server/routes/teacher/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');

// GET all assignments
router.get('/', authenticateToken, verifyRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;
  try {
    const [rows] = await pool.query(
      'SELECT a.*, c.title AS course_title FROM assignments a JOIN courses c ON a.course_id = c.id WHERE c.teacher_id = ?',
      [teacherId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE assignment
router.post('/', authenticateToken, verifyRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;
  const { course_id, title, description, due_date } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO assignments (course_id, title, description, due_date, teacher_id, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [course_id, title, description, due_date, teacherId]
    );

    const [assignment] = await pool.query('SELECT * FROM assignments WHERE id = ?', [result.insertId]);
    res.status(201).json(assignment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE assignment
router.delete('/:id', authenticateToken, verifyRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;
  const assignmentId = req.params.id;

  try {
    const [result] = await pool.query(
      'DELETE FROM assignments WHERE id = ? AND teacher_id = ?',
      [assignmentId, teacherId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Assignment not found or not yours' });

    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE assignment
router.put('/:id', authenticateToken, verifyRole('teacher'), async (req, res) => {
  const teacherId = req.user.id;
  const assignmentId = req.params.id;
  const { course_id, title, description, due_date } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE assignments SET course_id=?, title=?, description=?, due_date=? WHERE id=? AND teacher_id=?',
      [course_id, title, description, due_date, assignmentId, teacherId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Assignment not found or not yours' });

    const [updated] = await pool.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
