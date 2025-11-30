const express = require("express");
const auth = require("../../middleware/authMiddleware");
const { getStudentStats, getCourseProgress } = require("../../controllers/student/stats.controller");

const router = express.Router();

// Overall student stats
router.get("/", auth, getStudentStats);

// Progress for a specific course
router.get("/:courseId/progress", auth, getCourseProgress);

module.exports = router;
