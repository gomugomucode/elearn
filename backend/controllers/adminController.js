// server/controllers/adminController.js
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


