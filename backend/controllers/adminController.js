// server/controllers/adminController.js


const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");


exports.getDashboardStats = async (req, res) => {
  try {
    const [studentsRow] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "student"');
    const [teachersRow] = await db.query('SELECT COUNT(*) as total FROM users WHERE role = "teacher"');
    const [coursesRow] = await db.query('SELECT COUNT(*) as total FROM courses');
    const [enrollmentsRow] = await db.query('SELECT COUNT(*) as total FROM enrollments');

    res.json({
      totalStudents: studentsRow[0].total,
      totalTeachers: teachersRow[0].total,
      totalCourses: coursesRow[0].total,
      totalEnrollments: enrollmentsRow[0].total
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, email, role FROM users');
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, description FROM courses');
    res.json({ courses: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT id, name, email, role, profile_pic FROM users WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Name, email, and role are required" });
  }

  try {
    let hashedPassword = undefined;
    if (password) {
      const bcrypt = require("bcrypt");
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.execute(
      `UPDATE users SET name=?, email=?, role=? ${hashedPassword ? ', password=?' : ''} WHERE id=?`,
      hashedPassword ? [name, email, role, hashedPassword, id] : [name, email, role, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.bulkUploadUsers = async (req, res) => {
  try {
    // No file uploaded?
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse Excel/CSV
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const rows = sheet;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "Empty or invalid file" });
    }

    const errors = [];
    const addedUsers = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2;

      // ---------- VALIDATION ----------
      if (!row.name || !row.email || !row.password || !row.role) {
        errors.push({
          row: rowNumber,
          message: "Missing required fields: name, email, password, role",
        });
        continue;
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(row.email)) {
        errors.push({ row: rowNumber, message: "Invalid email format" });
        continue;
      }

      if (row.password.length < 6) {
        errors.push({
          row: rowNumber,
          message: "Password must be at least 6 characters",
        });
        continue;
      }

      if (!["teacher", "student"].includes(row.role.toLowerCase())) {
        errors.push({
          row: rowNumber,
          message: "Role must be 'teacher' or 'student'",
        });
        continue;
      }

      // Check if email exists
      const [existing] = await db.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [row.email]
      );

      if (existing.length > 0) {
        errors.push({ row: rowNumber, message: "Email already exists" });
        continue;
      }

      // ---------- INSERT ----------
      try {
        const hashed = await bcrypt.hash(row.password, 10);

        const [result] = await db.execute(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [row.name, row.email, hashed, row.role.toLowerCase()]
        );

        addedUsers.push({
          id: result.insertId,
          name: row.name,
          email: row.email,
        });
      } catch (err) {
        errors.push({ row: rowNumber, message: "Database insert failed" });
      }
    }

    return res.json({
      added: addedUsers.length,
      failed: errors.length,
      addedUsers,
      errors,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
