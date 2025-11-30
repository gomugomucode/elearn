const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");

const { submitAssignment, getAssignments } = require("../../controllers/student/assignment.controller");
const auth = require("../../middleware/authMiddleware");

// ----------------------
//     STUDENT ROUTES
// ----------------------

// Get all assignments for logged-in student
router.get("/", auth, getAssignments);

// Submit assignment with file upload
router.post(
  "/submit/:assignmentId",
  auth,
  upload.single("file"),
  submitAssignment
);

module.exports = router;
