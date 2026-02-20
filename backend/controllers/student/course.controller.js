
// src/controllers/student/courseController.js

const db = require("../../config/db");

const BASE_URL = "http://localhost:5000";



exports.searchCourses = async (req, res) => {
  const { q } = req.query; // The search term from frontend

  try {
    if (!q || q.trim() === "") {
      return res.json([]);
    }

    // 1. Search for Courses
    const [courses] = await db.query(
      `SELECT id, title, 'course' as type 
       FROM courses 
       WHERE title LIKE ? OR description LIKE ? 
       LIMIT 5`,
      [`%${q}%`, `%${q}%`]
    );

    // 2. Search for unique categories (using the description or a dedicated column if you add one later)
    // For now, let's assume categories are just a static list or a distinct selection from courses
    const [categories] = await db.query(
      `SELECT DISTINCT title, 'category' as type 
       FROM courses 
       WHERE title LIKE ? 
       LIMIT 3`,
      [`%${q}%`]
    );

    // Combine results
    const results = [...categories, ...courses];
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
};

// ✅ GET MY COURSES
// exports.getMyCourses = async (req, res) => {
//   const studentId = req.user.id;

//   try {
//     const [rows] = await db.query(
//     `SELECT
//         e.course_id AS courseId,
//         c.title,
//         c.description,
//         c.thumbnail,   -- Use course table images, NOT enrollment table
//         c.course_image
//      FROM enrollments e
//      JOIN courses c ON c.id = e.course_id
//      WHERE e.student_id = ?`,
//     [studentId]
// );

// // Then prepend BASE_URL
// for (const course of rows) {
//   if (course.thumbnail) course.thumbnail = `${BASE_URL}/uploads/${course.thumbnail}`;
//   if (course.course_image) course.course_image = `${BASE_URL}/uploads/${course.course_image}`;
// }




//     // Calculate progress (unchanged)
//     for (const course of rows) {
//       const [[assignTotal]] = await db.query(
//         "SELECT COUNT(*) AS total FROM assignments WHERE course_id = ?",
//         [course.courseId]
//       );

//       const [[assignDone]] = await db.query(
//         `SELECT COUNT(*) AS done
//          FROM submissions
//          WHERE student_id = ?
//          AND assignment_id IN (
//            SELECT id FROM assignments WHERE course_id = ?
//          )`,
//         [studentId, course.courseId]
//       );

//       const [[quizTotal]] = await db.query(
//         "SELECT COUNT(*) AS total FROM quizzes WHERE course_id = ?",
//         [course.courseId]
//       );

//       const [[quizDone]] = await db.query(
//         `SELECT COUNT(*) AS done
//          FROM quiz_attempts
//          WHERE student_id = ?
//          AND quiz_id IN (
//            SELECT id FROM quizzes WHERE course_id = ?
//          )`,
//         [studentId, course.courseId]
//       );

//       const total = assignTotal.total + quizTotal.total;
//       const completed = assignDone.done + quizDone.done;

//       course.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
//     }

//     res.json({ courses: rows });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Could not load courses" });
//   }
// };

exports.getMyCourses = async (req, res) => {
  const studentId = req.user.id;

  try {
    const [rows] = await db.query(
      `
      SELECT
        e.course_id AS courseId,
        c.title,
        c.description,
        c.thumbnail,
        c.course_image,

        COALESCE(a.total_assignments, 0) AS totalAssignments,
        COALESCE(sa.done_assignments, 0) AS doneAssignments,

        COALESCE(q.total_quizzes, 0) AS totalQuizzes,
        COALESCE(sq.done_quizzes, 0) AS doneQuizzes

      FROM enrollments e
      JOIN courses c ON c.id = e.course_id

      LEFT JOIN (
        SELECT course_id, COUNT(*) AS total_assignments
        FROM assignments
        GROUP BY course_id
      ) a ON a.course_id = c.id

      LEFT JOIN (
        SELECT a.course_id, s.student_id, COUNT(DISTINCT s.assignment_id) AS done_assignments
        FROM submissions s
        JOIN assignments a ON a.id = s.assignment_id
        GROUP BY a.course_id, s.student_id
      ) sa ON sa.course_id = c.id AND sa.student_id = e.student_id

      LEFT JOIN (
        SELECT course_id, COUNT(*) AS total_quizzes
        FROM quizzes
        GROUP BY course_id
      ) q ON q.course_id = c.id

      LEFT JOIN (
        SELECT q.course_id, qa.student_id, COUNT(DISTINCT qa.quiz_id) AS done_quizzes
        FROM quiz_attempts qa
        JOIN quizzes q ON q.id = qa.quiz_id
        WHERE qa.is_submitted = 1
        GROUP BY q.course_id, qa.student_id
      ) sq ON sq.course_id = c.id AND sq.student_id = e.student_id

      WHERE e.student_id = ?
      ORDER BY e.enrolled_at DESC
      `,
      [studentId]
    );

    for (const course of rows) {

      // ---------- assignments ----------
      const [[assignments]] = await db.query(
        `SELECT 
        COUNT(a.id) AS total,
        COUNT(DISTINCT s.assignment_id) AS done
     FROM assignments a
     LEFT JOIN submissions s
       ON s.assignment_id = a.id AND s.student_id = ?
     WHERE a.course_id = ?`,
        [studentId, course.courseId]
      );

      // ---------- quizzes ----------
      const [[quizzes]] = await db.query(
        `SELECT
        COUNT(q.id) AS total,
        COUNT(DISTINCT qa.quiz_id) AS done
     FROM quizzes q
     LEFT JOIN quiz_attempts qa
       ON qa.quiz_id = q.id
       AND qa.student_id = ?
       AND qa.is_submitted = 1
     WHERE q.course_id = ?`,
        [studentId, course.courseId]
      );

      const [[progressRow]] = await db.query(
  `
  SELECT
    -- total assignments and done assignments
    (SELECT COUNT(*) FROM assignments WHERE course_id = ?) AS totalAssignments,
    (SELECT COUNT(DISTINCT s.assignment_id)
       FROM submissions s
       JOIN assignments a ON a.id = s.assignment_id
      WHERE s.student_id = ? AND a.course_id = ?) AS doneAssignments,

    -- total quizzes and done quizzes (submitted only)
    (SELECT COUNT(*) FROM quizzes WHERE course_id = ?) AS totalQuizzes,
    (SELECT COUNT(DISTINCT qa.quiz_id)
       FROM quiz_attempts qa
       JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.student_id = ? AND qa.is_submitted = 1 AND q.course_id = ?) AS doneQuizzes
  `,
  [
    course.courseId,
    studentId, course.courseId,
    course.courseId,
    studentId, course.courseId
  ]
);

const total = progressRow.totalAssignments + progressRow.totalQuizzes;
const done = progressRow.doneAssignments + progressRow.doneQuizzes;
course.progress = total === 0 ? 0 : Math.round((done / total) * 100);

console.log("PROGRESS DEBUG:", { studentId, courseId: course.courseId, ...progressRow, progress: course.progress });
      // const total = assignments.total + quizzes.total;
      const completed = assignments.done + quizzes.done;

      course.progress = total === 0 ? 0 : Math.round((completed / total) * 100);
      console.log("studentId:", studentId, "courseId:", course.courseId);
console.log("assign:", assignments);
console.log("quiz:", quizzes);
    }
    return res.json({ courses: rows });
  } catch (error) {
    console.error("getMyCourses error:", error);
    return res.status(500).json({ error: "Could not load courses" });
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
      `SELECT a.*,
          CASE WHEN s.id IS NULL THEN 0 ELSE 1 END AS submitted
   FROM assignments a
   LEFT JOIN submissions s
     ON s.assignment_id = a.id AND s.student_id = ?
   WHERE a.course_id = ?
   GROUP BY a.id`,
      [studentId, courseId]
    );

    const [quizzes] = await db.query(
      `SELECT q.*,
          MAX(CASE WHEN qa.is_submitted = 1 THEN 1 ELSE 0 END) AS attempted,
          MAX(CASE WHEN qa.is_submitted = 1 THEN qa.score_percent ELSE NULL END) AS best_score
   FROM quizzes q
   LEFT JOIN quiz_attempts qa
     ON qa.quiz_id = q.id AND qa.student_id = ?
   WHERE q.course_id = ?
   GROUP BY q.id`,
      [studentId, courseId]
    );
    const totalItems = assignments.length + quizzes.length;
    const completedItems =
      assignments.filter(a => a.submitted === 1).length +
      quizzes.filter(q => Number(q.attempted) === 1).length;

    const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

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
