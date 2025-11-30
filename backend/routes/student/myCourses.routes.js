const express = require("express");
const router = express.Router();
const pool = require("../../config/db");

// GET /api/student/my-courses
router.get("/", async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
          c.id AS courseId,
          c.title,
          c.description,
          u.name AS instructor,
          0 AS progress
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id
        JOIN users u ON u.id = c.teacher_id
        WHERE e.student_id = ?`,
      [studentId]
    );

    res.json({ courses: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching enrolled courses" });
  }
});

module.exports = router;
