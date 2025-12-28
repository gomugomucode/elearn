const db = require("../../config/db");

const BASE_URL = "http://localhost:5000";

// ✅ GET MY COURSES
exports.getMyCourses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [rows] = await db.query(
    `SELECT
        e.course_id AS courseId,
        c.title,
        c.description,
        c.thumbnail,   -- Use course table images, NOT enrollment table
        c.course_image
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.student_id = ?`,
    [studentId]
);

// Then prepend BASE_URL
for (const course of rows) {
  if (course.thumbnail) course.thumbnail = `${BASE_URL}/uploads/${course.thumbnail}`;
  if (course.course_image) course.course_image = `${BASE_URL}/uploads/${course.course_image}`;
}


   

    // Calculate progress (unchanged)
    for (const course of rows) {
      const [[assignTotal]] = await db.query(
        "SELECT COUNT(*) AS total FROM assignments WHERE course_id = ?",
        [course.courseId]
      );

      const [[assignDone]] = await db.query(
        `SELECT COUNT(*) AS done
         FROM submissions
         WHERE student_id = ?
         AND assignment_id IN (
           SELECT id FROM assignments WHERE course_id = ?
         )`,
        [studentId, course.courseId]
      );

      const [[quizTotal]] = await db.query(
        "SELECT COUNT(*) AS total FROM quizzes WHERE course_id = ?",
        [course.courseId]
      );

      const [[quizDone]] = await db.query(
        `SELECT COUNT(*) AS done
         FROM quiz_attempts
         WHERE student_id = ?
         AND quiz_id IN (
           SELECT id FROM quizzes WHERE course_id = ?
         )`,
        [studentId, course.courseId]
      );

      const total = assignTotal.total + quizTotal.total;
      const completed = assignDone.done + quizDone.done;

      course.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    }

    res.json({ courses: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not load courses" });
  }
};

// ✅ COURSE DETAIL
exports.getCourseDetail = async (req, res) => {
  const courseId = req.params.courseId;
  const studentId = req.user.id;

  try {
    const [chk] = await db.query(
      `SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    if (chk.length === 0)
      return res.status(403).json({ error: "Not enrolled" });

    const [[course]] = await db.query(
      `SELECT 
         id,
         title,
         description,
         thumbnail,
         course_image
       FROM courses
       WHERE id = ?`,
      [courseId]
    );

    // 🔥 FIX: convert image filename → full URL
    if (course.thumbnail) {
      course.thumbnail = `${BASE_URL}/uploads/${course.thumbnail}`;
    }

    if (course.course_image) {
      course.course_image = `${BASE_URL}/uploads/${course.course_image}`;
    }

    const [materials] = await db.query(
      `SELECT * FROM study_materials WHERE course_id = ?`,
      [courseId]
    );

    const [assignments] = await db.query(
      `SELECT a.*, s.id AS submitted
       FROM assignments a
       LEFT JOIN submissions s
         ON s.assignment_id = a.id AND s.student_id = ?
       WHERE a.course_id = ?`,
      [studentId, courseId]
    );

    const [quizzes] = await db.query(
      `SELECT q.*, qa.id AS attempted
       FROM quizzes q
       LEFT JOIN quiz_attempts qa
         ON qa.quiz_id = q.id AND qa.student_id = ?
       WHERE q.course_id = ?`,
      [studentId, courseId]
    );

    res.json({
      course: {
        ...course,
        materials,
        assignments,
        quizzes
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to load course detail" });
  }
};
