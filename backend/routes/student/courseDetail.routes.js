const express = require("express");
const router = express.Router();
const pool = require("../../config/db");

// GET /api/student/course/:id
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  const studentId = req.user.id;

  try {
    // Check enrollment
    const [enrolled] = await pool.query(
      `SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?`,
      [studentId, courseId]
    );

    if (enrolled.length === 0) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    // Fetch course
    const [courseRows] = await pool.query(
      `SELECT id, title, description FROM courses WHERE id = ?`,
      [courseId]
    );

    if (courseRows.length === 0)
      return res.status(404).json({ message: "Course not found" });

    const course = courseRows[0];

    // Fetch assignments
    const [assignments] = await pool.query(
      `SELECT id, title FROM assignments WHERE course_id = ?`,
      [courseId]
    );

    // Fetch quizzes
    const [quizzes] = await pool.query(
      `SELECT id, title FROM quizzes WHERE course_id = ?`,
      [courseId]
    );

    res.json({
      course: {
        ...course,
        assignments,
        quizzes,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error loading course data" });
  }
});

module.exports = router;
