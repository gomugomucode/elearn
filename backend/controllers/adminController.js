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
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,

        -- how many courses this teacher owns
        COALESCE(tc.total_courses, 0) AS courses,

        -- how many courses this student is enrolled in
        COALESCE(se.total_enrolled, 0) AS enrolled

      FROM users u

      LEFT JOIN (
        SELECT teacher_id, COUNT(*) AS total_courses
        FROM courses
        GROUP BY teacher_id
      ) tc ON tc.teacher_id = u.id

      LEFT JOIN (
        SELECT student_id, COUNT(*) AS total_enrolled
        FROM enrollments
        GROUP BY student_id
      ) se ON se.student_id = u.id

      ORDER BY u.id DESC
    `);

    res.json({ users: rows });
  } catch (err) {
    console.error("Get users error:", err.code, err.sqlMessage || err.message);
    res.status(500).json({ message: err.sqlMessage || "Server error" });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.title,
        c.description,
        c.status,
        c.teacher_id,
        u.name AS teacher_name,
        COUNT(e.id) AS enrollments
      FROM courses c
      LEFT JOIN users u 
        ON u.id = c.teacher_id AND u.role = 'teacher'
      LEFT JOIN enrollments e 
        ON e.course_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json({ courses: rows });
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, teacher_id, status } = req.body;

  if (!title) return res.status(400).json({ message: "title is required" });

  try {
    // if teacher_id given, validate teacher exists
    if (teacher_id) {
      const [t] = await db.execute(
        "SELECT id FROM users WHERE id=? AND role='teacher' LIMIT 1",
        [teacher_id]
      );
      if (t.length === 0) return res.status(400).json({ message: "Invalid teacher_id" });
    }

    const [result] = await db.execute(
      `UPDATE courses 
       SET title=?, description=?, teacher_id=?, status=?
       WHERE id=?`,
      [
        title,
        description ?? null,
        teacher_id ?? null,
        status ?? "Active",
        id
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error("Update course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM courses WHERE id=?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("Delete course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getUserProfileById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role, created_at FROM users WHERE id=?",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json({ user: rows[0] });
  } catch (err) {
    console.error("Get profile error:", err.code, err.sqlMessage || err.message);
    res.status(500).json({ message: err.sqlMessage || "Server error" });
  }
};


exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "name, email, password, role are required" });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  const normalizedRole = String(role).toLowerCase();
  if (!["teacher", "student"].includes(normalizedRole)) {
    return res.status(400).json({ message: "Role must be 'teacher' or 'student'" });
  }

  try {
    // check existing email
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, normalizedRole]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: { id: result.insertId, name, email, role: normalizedRole }
    });
  } catch (err) {
    console.error("Create user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



exports.updateUser = async (req, res) => {
  const { id } = req.params;

  // Admin can update: name, email, role, password (password optional)
  const { name, email, role, password } = req.body;

  // Basic required fields for an update
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    // 1) Check user exists and get current role
    const [rows] = await db.execute(
      "SELECT id, role FROM users WHERE id=? LIMIT 1",
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    const currentRole = rows[0].role;

    // 2) Email uniqueness check (exclude same user)
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email=? AND id<>? LIMIT 1",
      [email, id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 3) Role rules
    // If role not sent, keep existing.
    const newRole = role ? String(role).toLowerCase() : currentRole;

    // Only allow these roles (your schema supports admin too)
    const allowedRoles = ["admin", "teacher", "student"];
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ message: "Role must be admin, teacher, or student" });
    }

    // Optional safety: do not allow changing an admin into student/teacher accidentally
    // (comment out if you want to allow it)
    if (currentRole === "admin" && newRole !== "admin") {
      return res.status(403).json({ message: "Cannot change admin role" });
    }

    // 4) Optional password update
    let hashedPassword = null;
    if (password && String(password).trim().length > 0) {
      if (String(password).length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // 5) Update query (dynamic password)
    let sql = "UPDATE users SET name=?, email=?, role=?";
    const params = [name, email, newRole];

    if (hashedPassword) {
      sql += ", password=?";
      params.push(hashedPassword);
    }

    sql += " WHERE id=?";
    params.push(id);

    const [result] = await db.execute(sql, params);

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update user error:", err.code, err.sqlMessage || err.message);
    return res.status(500).json({ message: err.sqlMessage || "Server error" });
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
