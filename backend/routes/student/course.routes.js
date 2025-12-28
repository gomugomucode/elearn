
const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authMiddleware");
const { getMyCourses, getCourseDetail } = require("../../controllers/student/course.controller");
const db = require("../../config/db");




// Student must be logged in
function isStudent(req, res, next) {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Only students allowed" });
  }
  next();
}
// Student dashboard: list of courses
router.get("/my-courses", verifyToken, getMyCourses);

// Course detail page
router.get("/course/:courseId", verifyToken, getCourseDetail);

// Optional: you can also expose a base route to return all enrolled courses
router.get("/", verifyToken, getMyCourses);


// ----------------------------------------------------
// GET COURSE DETAIL (FOR STUDENT COURSE DETAIL PAGE)
// URL: /api/student/course/:courseId
// ----------------------------------------------------
router.get("/:courseId", isStudent, async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  try {
    // 1️⃣ Check enrollment
    const [enrolled] = await db.query(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [studentId, courseId]
    );

    if (enrolled.length === 0) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // 2️⃣ Fetch course
    const [[course]] = await db.query(
      `SELECT id, title, description, thumbnail, course_image
       FROM courses WHERE id=?`,
      [courseId]
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 3️⃣ Fetch assignments
    const [assignments] = await db.query(
      "SELECT id, title, due_date FROM assignments WHERE course_id=?",
      [courseId]
    );

    // 4️⃣ Fetch quizzes
    const [quizzes] = await db.query(
      "SELECT id, title FROM quizzes WHERE course_id=? AND is_active=1",
      [courseId]
    );

    // 5️⃣ Final response (frontend expects this)
    res.json({
      course: {
        ...course,
        assignments,
        quizzes,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
