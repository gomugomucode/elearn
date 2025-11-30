// backend/controllers/student/assignment.controller.js
const db = require("../../config/db");

// ----------------------------
// Get Assignments
// ----------------------------
exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Fetching assignments for student:", studentId);

    const [assignments] = await db.query(
      `
      SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.due_date, 
        c.title AS course_title
      FROM assignments a
      JOIN enrollments e ON e.course_id = a.course_id
      JOIN courses c ON c.id = a.course_id
      WHERE e.student_id = ?
      ORDER BY a.due_date DESC
      `,
      [studentId]
    );

    res.json(assignments);
  } catch (err) {
    console.error("Assignment fetch error:", err);
    res.status(500).json({
      message: "Failed to load assignments",
      error: err.message,
    });
  }
};

// ----------------------------
// Submit Assignment
// ----------------------------
exports.submitAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.user.id;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  try {
    // Check if already submitted
    const [existing] = await db.query(
      "SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?",
      [assignmentId, studentId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Assignment already submitted" });
    }

    // Find teacher_id
    const [[assignment]] = await db.query(
      "SELECT teacher_id FROM assignments WHERE id = ?",
      [assignmentId]
    );

    // Insert new submission
    await db.query(
      `
      INSERT INTO submissions 
      (assignment_id, student_id, file_url, submitted_at, teacher_id)
      VALUES (?, ?, ?, NOW(), ?)
      `,
      [assignmentId, studentId, file.filename, assignment.teacher_id]
    );

    res.json({ message: "Assignment submitted successfully" });
  } catch (err) {
    console.error("submitAssignment error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ----------------------------
// List Assignments With Status
// ----------------------------
exports.listAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT 
        a.id,
        a.title,
        a.description,
        a.due_date,
        c.title AS course_title,
        CASE 
          WHEN EXISTS (
            SELECT 1 
            FROM submissions s
            WHERE s.assignment_id = a.id 
            AND s.student_id = ?
          ) THEN 1 ELSE 0
        END AS submitted
      FROM assignments a
      LEFT JOIN courses c ON c.id = a.course_id
      ORDER BY a.due_date ASC
      `,
      [studentId]
    );

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};
