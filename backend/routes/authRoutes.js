// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

const { login } = require('../controllers/authController');

router.post('/login', login);

module.exports = router;
