const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const authenticateToken = require('../../middleware/authMiddleware');

// Get teacher profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update teacher profile
router.put('/', authenticateToken, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // If password is provided, hash it first
    let query = 'UPDATE users SET name = ?, email = ?';
    const params = [name, email];

    if (password) {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashed);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    const [result] = await pool.query(query, params);

    // Return updated profile
    const [updatedRows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json(updatedRows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
