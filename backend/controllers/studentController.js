// const db = require("../../config/db"); 

// export const getMyCourses = async (req, res) => {
//   try {
//     const studentId = req.user.id;

//     const [rows] = await db.query(
//       `SELECT
//   c.id AS courseId,
//   c.title,
//   c.thumbnail,
//   c.course_image
// FROM enrollments e
// JOIN courses c ON e.course_id = c.id
// WHERE e.student_id = ?
// `,
//       [studentId]
//     );

//     res.json({ courses: rows });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load student courses" });
//   }
// };
