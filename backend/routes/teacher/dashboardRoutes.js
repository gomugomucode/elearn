const express = require('express');
// const router = express.Router();

// const authenticateToken = require('../../middleware/authMiddleware');
// const verifyRole = require('../../middleware/roleMiddleware');
// const { getTeacherDashboard } = require('../../controllers/teacher/dashboardController');


const { getTeacherDashboard } = require('./dashboardController');
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');

router.get('/dashboard', authenticateToken, verifyRole('teacher'), getTeacherDashboard);

router.use(authenticateToken, verifyRole('teacher'));
router.get('/dashboard', getTeacherDashboard);

module.exports = router;



