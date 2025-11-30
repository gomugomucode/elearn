// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllCourses,
  getUserProfileById
} = require('../controllers/adminController');

router.get('/dashboard', authenticateToken, verifyRole('admin'), getDashboardStats);
router.get('/users', authenticateToken, verifyRole('admin'), getAllUsers);
router.get('/courses', authenticateToken, verifyRole('admin'), getAllCourses);
router.get('/profile/:id', authenticateToken, verifyRole('admin'), getUserProfileById);


// const profileRoutes = require('./admin/profileRoutes');
// router.use('/profile', authenticateToken, verifyRole('admin'), profileRoutes);


module.exports = router;
