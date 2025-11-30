const db = require('../../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id=?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const params = [name, email];
  let query = 'UPDATE users SET name=?, email=?';

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    query += ', password=?';
    params.push(hashed);
  }

  query += ' WHERE id=?';
  params.push(req.user.id);

  try {
    await db.query(query, params);
    const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id=?', [req.user.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
