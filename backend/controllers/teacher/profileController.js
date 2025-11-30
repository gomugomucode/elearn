const db = require('../../config/db');

exports.getTeacherProfile = async (req, res) => {
  try {
    const [[user]] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
