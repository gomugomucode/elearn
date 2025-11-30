// routes/student/enroll.routes.js
const express = require("express");
const router = express.Router();
const db = require("../../config/db");

// Middleware: student must be logged in
function isStudent(req, res, next) {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ message: "Only students can perform this action" });
  }
  next();
}

// -----------------------------------------------
// CHECK IF STUDENT IS ENROLLED
// -----------------------------------------------
router.get("/check/:courseId", isStudent, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const [rows] = await db.query(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [studentId, courseId]
    );

    if (rows.length > 0) {
      return res.json({ enrolled: true });
    }

    res.json({ enrolled: false });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------------------------
// ENROLL STUDENT INTO COURSE
// -----------------------------------------------
router.post("/:courseId", isStudent, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check existing
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE student_id=? AND course_id=?",
      [studentId, courseId]
    );

    if (existing.length > 0) {
      return res.json({
        enrolled: true,
        message: "Already enrolled"
      });
    }

    // Insert new enrollment
    await db.query(
      "INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)",
      [studentId, courseId]
    );

    res.json({
      enrolled: true,
      message: "Enrollment successful"
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
