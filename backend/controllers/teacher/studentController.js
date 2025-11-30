const db = require('../../config/db');

exports.getTeacherStudents = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT u.id, u.name, u.email
      FROM users u
      JOIN enrollments e ON e.student_id = u.id
      JOIN courses c ON c.id = e.course_id
      WHERE c.teacher_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
