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
  const { submissionId } = req.params;

  try {
    // 1. Update the record (Adding status = 'graded' as we discussed earlier)
    const [result] = await db.query(
      'UPDATE submissions SET grade = ?, feedback = ?, status = "graded" WHERE id = ?',
      [grade, feedback, submissionId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Submission not found' });

    // 2. Fetch the FULL updated submission to return to the frontend
    const [rows] = await db.query(`
      SELECT s.*, a.title AS assignment_title
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE s.id = ?
    `, [submissionId]);

    // 3. Return the full object so React can update the state correctly
    res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTeacherSubmission = async (req, res) => {
  const { submissionId } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM submissions WHERE id = ?',
      [submissionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.json({ message: 'Submission deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
