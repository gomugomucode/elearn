const express = require("express");
const router = express.Router();
const gradebookController = require("../../controllers/teacher/gradebook.controller");
const authenticateToken = require("../../middleware/authMiddleware");
const verifyRole = require("../../middleware/roleMiddleware");

// This should be "/" because the "/api/teacher/gradebook" part 
// is already handled in server.js
router.get("/", authenticateToken, verifyRole("teacher"), gradebookController.getGradebookData);

module.exports = router;