const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authMiddleware");

const {
  getMyCourses,
  getCourseDetail,
} = require("../../controllers/student/course.controller");

// PROTECT ROUTES
router.get("/", verifyToken, getMyCourses);
router.get("/:courseId", verifyToken, getCourseDetail);

module.exports = router;
