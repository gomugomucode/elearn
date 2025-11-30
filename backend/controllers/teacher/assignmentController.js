const db = require('../../config/db');

exports.getTeacherAssignments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM assignments WHERE teacher_id = ?', [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTeacherAssignment = async (req, res) => {
  const { title, description, course_id, due_date } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO assignments (title, description, course_id, due_date, teacher_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, course_id, due_date, req.user.id]
    );
    res.json({ message: 'Assignment created successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTeacherAssignment = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM assignments WHERE id = ? AND teacher_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Assignment not found or not authorized' });

    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
