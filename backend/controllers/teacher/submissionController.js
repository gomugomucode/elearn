const db = require('../../config/db');

exports.getTeacherSubmissions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.*, a.title AS assignment_title
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE a.teacher_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.gradeTeacherSubmission = async (req, res) => {
  const { grade, feedback } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?',
      [grade, feedback, req.params.submissionId]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Submission not found' });

    res.json({ message: 'Submission graded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
