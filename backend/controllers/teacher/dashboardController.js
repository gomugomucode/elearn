// controllers/teacher/dashboardController.js
const db = require('../../config/db');

exports.getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // 1️⃣ Total Courses
    const [[{ courseCount }]] = await db.query(
      `SELECT COUNT(*) AS courseCount FROM courses WHERE teacher_id = ?`,
      [teacherId]
    );

    // 2️⃣ Total Students (sum of enrolled students in teacher's courses)
    const [[{ studentCount }]] = await db.query(
      `SELECT COUNT(DISTINCT e.student_id) AS studentCount
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.teacher_id = ?`,
      [teacherId]
    );

    // 3️⃣ Pending Submissions
    const [[{ pendingSubmissions }]] = await db.query(
      `SELECT COUNT(*) AS pendingSubmissions
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.teacher_id = ? AND s.status = 'pending'`,
      [teacherId]
    );

    // 4️⃣ Average Quiz Score
    const [[{ avgQuizScore }]] = await db.query(
      `SELECT IFNULL(ROUND(AVG(qa.score), 2), 0) AS avgQuizScore
       FROM quiz_attempts qa
       JOIN quizzes q ON qa.quiz_id = q.id
       JOIN courses c ON q.course_id = c.id
       WHERE c.teacher_id = ?`,
      [teacherId]
    );

    res.json({
      totalCourses: courseCount,
      totalStudents: studentCount,
      pendingSubmissions,
      avgQuizScore
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
