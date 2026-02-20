const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../controllers/contactController');

// Define the POST route
router.post('/', sendContactEmail);

module.exports = router;