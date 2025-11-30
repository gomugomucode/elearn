const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../../controllers/student/profileController');
const authenticateToken = require('../../middleware/authMiddleware');
const verifyRole = require('../../middleware/roleMiddleware');

router.get('/', authenticateToken, verifyRole('student'), getProfile);
router.put('/', authenticateToken, verifyRole('student'), updateProfile);

module.exports = router;
