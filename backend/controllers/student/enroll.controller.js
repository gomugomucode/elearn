const db = require("../../config/db");

// ✅ Enroll in a Course
exports.enrollInCourse = async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.body;

  try {
    // Check if already enrolled
    const [existing] = await db.query(
      "SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?",
      [studentId, courseId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Enroll student
    await db.query(
      "INSERT INTO enrollments (student_id, course_id, enrolled_at) VALUES (?, ?, NOW())",
      [studentId, courseId]
    );

    // Fetch course info including images
    const [[course]] = await db.query(
      `SELECT 
         c.id AS courseId,
         c.title,
         c.description,
         c.thumbnail,
         c.course_image,
         u.name AS instructor
       FROM courses c
       JOIN users u ON c.teacher_id = u.id
       WHERE c.id = ?`,
      [courseId]
    );

    res.status(201).json({ message: "Enrolled successfully", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
