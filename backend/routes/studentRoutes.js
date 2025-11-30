const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const { getDashboardStats } = require('../controllers/studentController');

// Student dashboard
router.get('/dashboard', authenticateToken, verifyRole('student'), getDashboardStats);

module.exports = router;
