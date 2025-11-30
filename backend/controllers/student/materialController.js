import db from "../../config/db.js";

export const getMaterials = async (req, res) => {
  const { courseId } = req.params;

  const [rows] = await db.query(`
    SELECT * FROM study_materials WHERE course_id = ?
  `, [courseId]);

  res.json({ success: true, materials: rows });
};
