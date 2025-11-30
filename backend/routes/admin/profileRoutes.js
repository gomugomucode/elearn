const express = require('express');
const router = express.Router();
const pool = require('../../config/db'); // correct
const authenticateToken = require('../../middleware/authMiddleware'); // fixed
const verifyRole = require('../../middleware/roleMiddleware'); // fixed

// Get admin profile
router.get('/', authenticateToken, verifyRole('admin'), async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, profile_pic, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update admin profile
router.put('/', authenticateToken, verifyRole('admin'), async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const params = [name, email];
    let query = 'UPDATE users SET name = ?, email = ?';

    if (password) {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashed);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    await pool.query(query, params);

    const [rows] = await pool.query(
      'SELECT id, name, email, role, profile_pic, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
