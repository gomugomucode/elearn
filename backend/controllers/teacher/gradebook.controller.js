const db = require("../../config/db");

// Make sure this name is EXACTLY getGradebookData
exports.getGradebookData = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [rows] = await db.query(`
      SELECT 
        u.name AS student_name,
        c.title AS course_title,
        a.title AS assignment_title,
        s.grade,
        s.status
      FROM users u
      JOIN enrollments e ON u.id = e.student_id
      JOIN courses c ON e.course_id = c.id
      JOIN assignments a ON c.id = a.course_id
      LEFT JOIN submissions s ON (s.assignment_id = a.id AND s.student_id = u.id)
      WHERE c.teacher_id = ?
    `, [teacherId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};