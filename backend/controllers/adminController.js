// server/controllers/adminController.js


const fs = require('fs');
const csv = require('csv-parser');
const db = require('../config/db');

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



const bcrypt = require("bcrypt");

exports.bulkUploadUsers = async (req, res) => {
  const rows = req.body.rows;

  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  const errors = [];
  const addedUsers = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const rowNumber = i + 2; // Because row 1 is header in Excel/CSV

    // -------- VALIDATION --------
    if (!row.name || !row.email || !row.password || !row.role) {
      errors.push({
        row: rowNumber,
        message: "Missing required fields (name, email, password, role)",
      });
      continue;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(row.email)) {
      errors.push({
        row: rowNumber,
        message: "Invalid email format",
      });
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
        message: "Role must be either teacher or student",
      });
      continue;
    }

    // -------- CHECK IF EMAIL EXISTS --------
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [row.email]
    );

    if (existing.length > 0) {
      errors.push({
        row: rowNumber,
        message: "Email already exists",
      });
      continue;
    }

    // -------- INSERT USER --------
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
        role: row.role.toLowerCase(),
      });
    } catch (err) {
      errors.push({
        row: rowNumber,
        message: "Database insert failed",
      });
    }
  }

  return res.json({
    added: addedUsers.length,
    failed: errors.length,
    addedUsers,
    errors,
  });
};

