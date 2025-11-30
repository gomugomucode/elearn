const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const db = require("../config/db"); // your MySQL connection

const COURSES_DIR = path.join(process.cwd(), "courses");
if (!fs.existsSync(COURSES_DIR)) fs.mkdirSync(COURSES_DIR);

// Create course folder
router.post("/create", async (req, res) => {
  try {
    const { courseId, title } = req.body;
    if (!courseId || !title) return res.status(400).json({ message: "courseId and title required" });

    const folderName = `course_${courseId}`;
    const folderPath = path.join(COURSES_DIR, folderName);

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

    res.json({ message: "Folder created", courseData: { courseId, title, folder: folderName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get course folder data
router.get("/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const folderName = `course_${courseId}`;
    const folderPath = path.join(COURSES_DIR, folderName);

    if (!fs.existsSync(folderPath)) return res.status(404).json({ message: "Course folder not found" });

    // Example: list assignments and quizzes from DB
    const [assignments] = await db.query("SELECT * FROM assignments WHERE course_id = ?", [courseId]);
    const [quizzes] = await db.query("SELECT * FROM quizzes WHERE course_id = ?", [courseId]);
    const [materials] = await db.query("SELECT * FROM study_materials WHERE course_id = ?", [courseId]);

    res.json({ folder: folderName, assignments, quizzes, materials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// 
module.exports = router;
