// server/server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'elearning_db',
    waitForConnections: true,
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});


// const app = express.app();
// const db = require('../config/db'); // Your MySQL connection



// node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"   to generate the jwt token

const JWT_SECRET = 'f310747d327a47f3f8a9de292b15a41fb98f5e0fb1f9537fac95ee069e7c88a581e25519f2242b8e93fa3fda7ee653bcf3a28482e3ddf7ad1958c9e9cc428d39';

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT id, name, email, password, role FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Admin Dashboard Stats
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const studentsSql = 'SELECT COUNT(*) as total FROM users WHERE role = "student"';
  const teachersSql = 'SELECT COUNT(*) as total FROM users WHERE role = "teacher"';
  const coursesSql = 'SELECT COUNT(*) as total FROM courses';
  const enrollmentsSql = 'SELECT COUNT(*) as total FROM enrollments';

  Promise.all([
    new Promise((resolve, reject) => {
      db.query(studentsSql, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(teachersSql, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(coursesSql, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    }),
    new Promise((resolve, reject) => {
      db.query(enrollmentsSql, (err, results) => {
        if (err) reject(err);
        else resolve(results[0].total);
      });
    })
  ])
    .then(([totalStudents, totalTeachers, totalCourses, totalEnrollments]) => {
      res.json({
        totalStudents,
        totalTeachers,
        totalCourses,
        totalEnrollments
      });
    })
    .catch(err => res.status(500).json({ error: err.message }));
});



app.get('/api/admin/profile/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const userId = req.params.id;
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  const sql = 'SELECT id, name, email, role, created_at FROM users WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(results[0]);
  });
});

// Admin Users (CRUD)


// Update this route:
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  
  const { name, email, password, role } = req.body;

  // Validate password
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User created', userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to hash password' });
  }
});

// ✅ GET all users (for ManageUsers.jsx table)
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const sql = `
    SELECT 
      u.id, 
      u.name, 
      u.email, 
      u.role,
      (SELECT COUNT(*) FROM courses c WHERE c.teacher_id = u.id) as courses,
      (SELECT MAX(e.enrolled_at) FROM enrollments e JOIN courses c ON e.course_id = c.id WHERE c.teacher_id = u.id) as lastLogin
    FROM users u
    WHERE u.role IN ('teacher', 'student')
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const { name, email, role } = req.body;
  const sql = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
  db.query(sql, [name, email, role, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

// Admin Logs
app.get('/api/admin/logs', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const sql = `
    SELECT sl.timestamp, u.name as user_name, sl.action, sl.details
    FROM system_logs sl
    JOIN users u ON sl.user_id = u.id
    ORDER BY sl.timestamp DESC
    LIMIT 20
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET all courses for admin
app.get('/api/admin/courses', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.status,
      u.name as teacher_name,
      (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrollments
    FROM courses c
    LEFT JOIN users u ON c.teacher_id = u.id
    ORDER BY c.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err); // 👈 ADD THIS FOR DEBUGGING
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// DELETE course
app.delete('/api/admin/courses/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const courseId = req.params.id;

  // Optional: Check if course exists
  const checkSql = 'SELECT id FROM courses WHERE id = ?';
  db.query(checkSql, [courseId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Course not found' });

    // Delete course
    const deleteSql = 'DELETE FROM courses WHERE id = ?';
    db.query(deleteSql, [courseId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Course deleted' });
    });
  });
});


// ======================
// TEACHER ROUTES
// ======================
// routes/teacherRoutes.js

// Middleware to verify teacher role
const verifyTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ error: 'Access denied. Teacher role required.' });
  }
  next();
};


// GET: Teacher Dashboard Stats
app.get('/api/teacher/dashboard', verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Total courses
    const [courses] = await db.execute(
      'SELECT COUNT(*) as count FROM courses WHERE teacher_id = ?',
      [teacherId]
    );

    // Total students enrolled in teacher's courses
    const [students] = await db.execute(`
      SELECT COUNT(DISTINCT e.student_id) as count 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE c.teacher_id = ?
    `, [teacherId]);

    // Pending submissions (not graded)
    const [pending] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM submissions s 
      JOIN assignments a ON s.assignment_id = a.id 
      WHERE a.course_id IN (SELECT id FROM courses WHERE teacher_id = ?) AND s.status != 'graded'
    `, [teacherId]);

    // Average quiz score
    const [avgScore] = await db.execute(`
      SELECT AVG(score) as avg_score 
      FROM quiz_attempts qa 
      JOIN quizzes q ON qa.quiz_id = q.id 
      WHERE q.course_id IN (SELECT id FROM courses WHERE teacher_id = ?)
    `, [teacherId]);

    res.json({
      totalCourses: courses[0].count,
      totalStudents: students[0].count,
      pendingSubmissions: pending[0].count,
      avgQuizScore: avgScore[0].avg_score ? Math.round(avgScore[0].avg_score) : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Teacher's Courses
app.get('/api/teacher/courses', verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [courses] = await db.execute(
      'SELECT id, title, description, status, created_at FROM courses WHERE teacher_id = ? ORDER BY created_at DESC',
      [teacherId]
    );
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



// POST: Create Course
app.post('/api/teacher/courses', verifyTeacher, async (req, res) => {
  try {
    const { title, description } = req.body;
    const teacherId = req.user.id;

    const [result] = await db.execute(
      'INSERT INTO courses (title, description, teacher_id, created_at, status) VALUES (?, ?, ?, NOW(), ?)',
      [title, description, teacherId, 'active']
    );

    const [newCourse] = await db.execute(
      'SELECT id, title, description, status, created_at FROM courses WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newCourse[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete Course
app.delete('/api/teacher/courses/:id', verifyTeacher, async (req, res) => {
  try {
    const courseId = req.params.id;
    const teacherId = req.user.id;

    // Verify course belongs to teacher
    const [course] = await db.execute(
      'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
      [courseId, teacherId]
    );

    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found or access denied' });
    }

    await db.execute('DELETE FROM courses WHERE id = ?', [courseId]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Teacher's Assignments
app.get('/api/teacher/assignments', verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [assignments] = await db.execute(`
      SELECT a.id, a.title, a.description, a.due_date, a.created_at, c.title as course_title
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE c.teacher_id = ?
      ORDER BY a.created_at DESC
    `, [teacherId]);
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Create Assignment
app.post('/api/teacher/assignments', verifyTeacher, async (req, res) => {
  try {
    const { course_id, title, description, due_date } = req.body;
    const teacherId = req.user.id;

    // Verify course belongs to teacher
    const [course] = await db.execute(
      'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
      [course_id, teacherId]
    );

    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found or access denied' });
    }

    const [result] = await db.execute(
      'INSERT INTO assignments (course_id, title, description, due_date, created_at) VALUES (?, ?, ?, ?, NOW())',
      [course_id, title, description, due_date]
    );

    const [newAssignment] = await db.execute(`
      SELECT a.id, a.title, a.description, a.due_date, a.created_at, c.title as course_title
      FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = ?
    `, [result.insertId]);

    res.status(201).json(newAssignment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete Assignment
app.delete('/api/teacher/assignments/:id', verifyTeacher, async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const teacherId = req.user.id;

    // Verify assignment belongs to teacher
    const [assignment] = await db.execute(`
      SELECT a.id FROM assignments a
      JOIN courses c ON a.course_id = c.id
      WHERE a.id = ? AND c.teacher_id = ?
    `, [assignmentId, teacherId]);

    if (assignment.length === 0) {
      return res.status(404).json({ error: 'Assignment not found or access denied' });
    }

    await db.execute('DELETE FROM assignments WHERE id = ?', [assignmentId]);
    res.json({ message: 'Assignment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Teacher's Quizzes
app.get('/api/teacher/quizzes', verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [quizzes] = await db.execute(`
      SELECT q.id, q.title, q.time_limit, q.created_at, c.title as course_title
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE c.teacher_id = ?
      ORDER BY q.created_at DESC
    `, [teacherId]);
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Create Quiz with Questions
app.post('/api/teacher/quizzes', verifyTeacher, async (req, res) => {
  try {
    const { course_id, title, time_limit, questions } = req.body;
    const teacherId = req.user.id;

    // Verify course belongs to teacher
    const [course] = await db.execute(
      'SELECT id FROM courses WHERE id = ? AND teacher_id = ?',
      [course_id, teacherId]
    );

    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found or access denied' });
    }

    // Start transaction
    await db.beginTransaction();

    // Insert quiz
    const [quizResult] = await db.execute(
      'INSERT INTO quizzes (course_id, title, time_limit, created_at) VALUES (?, ?, ?, NOW())',
      [course_id, title, time_limit]
    );

    const quizId = quizResult.insertId;

    // Insert questions
    for (const q of questions) {
      const { question_text, options, correct_answer } = q;
      await db.execute(
        'INSERT INTO quiz_questions (quiz_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)',
        [quizId, question_text, JSON.stringify(options), correct_answer]
      );
    }

    await db.commit();

    // Return full quiz data
    const [newQuiz] = await db.execute(`
      SELECT q.id, q.title, q.time_limit, q.created_at, c.title as course_title
      FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = ?
    `, [quizId]);

    res.status(201).json(newQuiz[0]);
  } catch (err) {
    await db.rollback();
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete Quiz
app.delete('/api/teacher/quizzes/:id', verifyTeacher, async (req, res) => {
  try {
    const quizId = req.params.id;
    const teacherId = req.user.id;

    // Verify quiz belongs to teacher
    const [quiz] = await db.execute(`
      SELECT q.id FROM quizzes q
      JOIN courses c ON q.course_id = c.id
      WHERE q.id = ? AND c.teacher_id = ?
    `, [quizId, teacherId]);

    if (quiz.length === 0) {
      return res.status(404).json({ error: 'Quiz not found or access denied' });
    }

    await db.execute('DELETE FROM quizzes WHERE id = ?', [quizId]);
    res.json({ message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Teacher's Submissions (to evaluate)
app.get('/api/teacher/submissions', verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [submissions] = await db.execute(`
      SELECT 
        s.id, s.assignment_id, s.student_id, s.file_url, s.status, s.grade, s.feedback, s.submitted_at,
        a.title as assignment_title,
        u.name as student_name
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      JOIN users u ON s.student_id = u.id
      WHERE c.teacher_id = ?
      ORDER BY s.submitted_at DESC
    `, [teacherId]);
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Evaluate Submission
app.put('/api/teacher/submissions/:id', verifyTeacher, async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { grade, feedback } = req.body;
    const teacherId = req.user.id;

    // Verify submission belongs to teacher's course
    const [submission] = await db.execute(`
      SELECT s.id FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      WHERE s.id = ? AND c.teacher_id = ?
    `, [submissionId, teacherId]);

    if (submission.length === 0) {
      return res.status(404).json({ error: 'Submission not found or access denied' });
    }

    await db.execute(
      'UPDATE submissions SET grade = ?, feedback = ?, status = "graded" WHERE id = ?',
      [grade, feedback, submissionId]
    );

    const [updated] = await db.execute(`
      SELECT 
        s.id, s.assignment_id, s.student_id, s.file_url, s.status, s.grade, s.feedback, s.submitted_at,
        a.title as assignment_title,
        u.name as student_name
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN courses c ON a.course_id = c.id
      JOIN users u ON s.student_id = u.id
      WHERE s.id = ?
    `, [submissionId]);

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
// GET teacher profile
// app.get('/api/teacher/profile', authenticateToken, verifyTeacher, async (req, res) => {
//   try {
//     const [user] = await db.execute(
//       'SELECT id, name, email, created_at FROM users WHERE id = ?',
//       [req.user.id]
//     );
//     if (user.length === 0) return res.status(404).json({ error: 'Teacher not found' });
//     res.json(user[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // PUT update profile
// app.put('/api/teacher/profile', authenticateToken, verifyTeacher, async (req, res) => {
//   const { name, email, password } = req.body;
//   // ... (update logic with bcrypt if password provided)
// });

// GET: Teacher Profile
app.get('/api/teacher/profile', authenticateToken, verifyTeacher, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const [user] = await db.execute(
      'SELECT id, name, email FROM users WHERE id = ?',
      [teacherId]
    );
    res.json(user[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Update Teacher Profile
app.get('/api/teacher/profile', authenticateToken, verifyTeacher, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const teacherId = req.user.id;

    let sql = 'UPDATE users SET name = ?, email = ?';
    let params = [name, email];

    if (password) {
      // Hash password before saving (you should have bcrypt setup)
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += ', password = ?';
      params.push(hashedPassword);
    }

    sql += ' WHERE id = ?';
    params.push(teacherId);

    await db.execute(sql, params);

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// module.exports = app;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});