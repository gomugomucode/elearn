const db = require("../../config/db");

exports.getDashboard = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [courses] = await db.query(
      `SELECT c.id AS courseId, c.title, u.name AS instructor, e.enrolled_at
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       JOIN users u ON c.teacher_id = u.id
       WHERE e.student_id=?`,
      [studentId]
    );

    const [assignments] = await db.query(`
      SELECT a.*, s.status AS submitted, s.id AS submission_id
      FROM assignments a
      LEFT JOIN submissions s
      ON s.assignment_id = a.id AND s.student_id = ${studentId};
    `);

    const [quizzes] = await db.query(`
      SELECT q.*, qa.id AS attempted
      FROM quizzes q
      LEFT JOIN quiz_attempts qa 
      ON qa.quiz_id = q.id AND qa.student_id = ${studentId};
    `);

    const formatted = courses.map(c => ({
      ...c,
      progress: 0,
      assignments: assignments.filter(a => a.course_id === c.courseId),
      quizzes: quizzes.filter(q => q.course_id === c.courseId)
    }));

    res.json({ recentCourses: formatted });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Dashboard loading failed" });
  }
};
