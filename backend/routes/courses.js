const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });


// Get ALL courses (public)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json({ courses: rows });   // <-- FIXED
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single course details
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Course not found" });

    res.json({ course: rows[0] });   // <-- FIXED
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.post(
//   "/create",
//   upload.fields([
//     { name: "thumbnail", maxCount: 1 },
//     { name: "diagram", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const { title, description } = req.body;
//       const thumbnail = req.files["thumbnail"] ? req.files["thumbnail"][0].filename : null;
//       const diagram_url = req.files["diagram"] ? req.files["diagram"][0].filename : null;

//       await db.query(
//         `INSERT INTO courses (title, description, teacher_id, thumbnail, diagram_url)
//          VALUES (?, ?, ?, ?, ?)`,
//         [title, description, req.user.id, thumbnail, diagram_url]
//       );

//       res.json({ message: "Course created successfully" });
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   }
// );



module.exports = router;
