const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');
const { getTeacherStudents } = require('../../controllers/teacher/studentController');

router.use(authenticateToken, verifyRole('teacher'));
router.get('/students', getTeacherStudents);

module.exports = router;
