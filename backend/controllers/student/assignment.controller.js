const db = require("../../config/db");

exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.user.id;
    console.log("Fetching assignments for student:", studentId);

    const [assignments] = await db.query(
      `
      SELECT a.id, a.title, a.description, a.due_date, c.title as course_title
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
    res
      .status(500)
      .json({ message: "Failed to load assignments", error: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = req.file.filename;

    await db.query(
      `INSERT INTO submissions (assignment_id, student_id, file_url, status, submitted_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [assignmentId, studentId, fileUrl, "pending"]
    );

    res.json({
      success: true,
      message: "Assignment submitted successfully!",
      file: fileUrl,
    });
  } catch (err) {
    console.error("Submit assignment error:", err);
    res
      .status(500)
      .json({ message: "Failed to submit assignment", error: err.message });
  }
};
