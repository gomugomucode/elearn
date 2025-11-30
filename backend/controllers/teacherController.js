// const db = require('../config/db');

// // ---- DASHBOARD ----
// exports.getTeacherDashboard = async (req, res) => {
//   try {
//     const [[counts]] = await db.query(`
//       SELECT 
//         (SELECT COUNT(*) FROM courses WHERE teacher_id = ?) AS courseCount,
//         (SELECT COUNT(*) FROM assignments WHERE teacher_id = ?) AS assignmentCount,
//         (SELECT COUNT(*) FROM submissions s 
//          JOIN assignments a ON s.assignment_id = a.id 
//          WHERE a.teacher_id = ?) AS submissionCount,
//         (SELECT COUNT(*) FROM quizzes WHERE teacher_id = ?) AS quizCount
//     `, [req.user.id, req.user.id, req.user.id, req.user.id]);

//     res.json(counts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- COURSES ----
// exports.getTeacherCourses = async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM courses WHERE teacher_id = ?', [req.user.id]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createTeacherCourse = async (req, res) => {
//   const { title, description } = req.body;
//   try {
//     const [result] = await db.query(
//       'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
//       [title, description, req.user.id]
//     );
//     res.json({ message: 'Course created successfully', id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteTeacherCourse = async (req, res) => {
//   try {
//     const [result] = await db.query(
//       'DELETE FROM courses WHERE id = ? AND teacher_id = ?',
//       [req.params.id, req.user.id]
//     );
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: 'Course not found or not authorized' });

//     res.json({ message: 'Course deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- ASSIGNMENTS ----
// exports.getTeacherAssignments = async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM assignments WHERE teacher_id = ?', [req.user.id]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createTeacherAssignment = async (req, res) => {
//   const { title, description, course_id, due_date } = req.body;
//   try {
//     const [result] = await db.query(
//       'INSERT INTO assignments (title, description, course_id, due_date, teacher_id) VALUES (?, ?, ?, ?, ?)',
//       [title, description, course_id, due_date, req.user.id]
//     );
//     res.json({ message: 'Assignment created successfully', id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteTeacherAssignment = async (req, res) => {
//   try {
//     const [result] = await db.query(
//       'DELETE FROM assignments WHERE id = ? AND teacher_id = ?',
//       [req.params.id, req.user.id]
//     );
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: 'Assignment not found or not authorized' });

//     res.json({ message: 'Assignment deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- QUIZZES ----
// exports.getTeacherQuizzes = async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM quizzes WHERE teacher_id = ?', [req.user.id]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.createTeacherQuiz = async (req, res) => {
//   const { title, description, course_id, due_date } = req.body;
//   try {
//     const [result] = await db.query(
//       'INSERT INTO quizzes (title, description, course_id, teacher_id, due_date) VALUES (?, ?, ?, ?, ?)',
//       [title, description, course_id, req.user.id, due_date]
//     );
//     res.json({ message: 'Quiz created successfully', id: result.insertId });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.deleteTeacherQuiz = async (req, res) => {
//   try {
//     const [result] = await db.query(
//       'DELETE FROM quizzes WHERE id = ? AND teacher_id = ?',
//       [req.params.id, req.user.id]
//     );
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: 'Quiz not found or not authorized' });

//     res.json({ message: 'Quiz deleted successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- SUBMISSIONS ----
// exports.getTeacherSubmissions = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT s.*, a.title AS assignment_title
//       FROM submissions s
//       JOIN assignments a ON s.assignment_id = a.id
//       WHERE a.teacher_id = ?
//     `, [req.user.id]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// exports.gradeTeacherSubmission = async (req, res) => {
//   const { grade, feedback } = req.body;
//   try {
//     const [result] = await db.query(
//       'UPDATE submissions SET grade = ?, feedback = ? WHERE id = ?',
//       [grade, feedback, req.params.submissionId]
//     );
//     if (result.affectedRows === 0)
//       return res.status(404).json({ message: 'Submission not found' });

//     res.json({ message: 'Submission graded successfully' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- STUDENTS ----
// exports.getTeacherStudents = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT DISTINCT u.id, u.name, u.email
//       FROM users u
//       JOIN enrollments e ON e.student_id = u.id
//       JOIN courses c ON c.id = e.course_id
//       WHERE c.teacher_id = ?
//     `, [req.user.id]);
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // ---- PROFILE ----
// exports.getTeacherProfile = async (req, res) => {
//   try {
//     const [[user]] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.id]);
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
