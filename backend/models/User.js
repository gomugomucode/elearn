// backend/models/User.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async ({ name, email, password, role }) => {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );
    return result;
  },

  findAll: async () => {
    const [rows] = await db.execute('SELECT id, name, email, role FROM users');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    return result;
  },

  bulkInsert: async (users) => {
    const values = users.map(u => [u.name, u.email, bcrypt.hashSync(u.password, 10), u.role]);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES ?',
      [values]
    );
    return result;
  }
};

module.exports = User;
