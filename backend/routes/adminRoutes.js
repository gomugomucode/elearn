// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const authenticateToken = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllCourses,
  getUserProfileById,
  updateUser,
  createUser, // ✅ add this
  updateCourse,
  deleteCourse,
} = require('../controllers/adminController');


router.post(
  '/users',
  authenticateToken,
  verifyRole('admin'),
  createUser
);



router.put(
  '/users/:id',
  authenticateToken,
  verifyRole('admin'),
  updateUser
);


const { deleteUser } = require('../controllers/adminController');

router.delete(
  '/users/:id',
  authenticateToken,
  verifyRole('admin'),
  deleteUser
);



const { bulkUploadUsers } = require('../controllers/adminController');

router.post(
  '/users/bulk-upload',
  authenticateToken,
  verifyRole('admin'),
  upload.single('file'),
  bulkUploadUsers
);


router.get('/dashboard', authenticateToken, verifyRole('admin'), getDashboardStats);
router.get('/users', authenticateToken, verifyRole('admin'), getAllUsers);
router.get('/courses', authenticateToken, verifyRole('admin'), getAllCourses);
router.get('/profile/:id', authenticateToken, verifyRole('admin'), getUserProfileById);
router.put('/courses/:id', authenticateToken, verifyRole('admin'), updateCourse);
router.delete('/courses/:id', authenticateToken, verifyRole('admin'), deleteCourse);



// const profileRoutes = require('./admin/profileRoutes');
// router.use('/profile', authenticateToken, verifyRole('admin'), profileRoutes);


module.exports = router;
