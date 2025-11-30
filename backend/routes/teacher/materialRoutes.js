const express = require('express');
const router = express.Router();
const auth = require('../../middleware/authMiddleware');
const role = require('../../middleware/roleMiddleware');
const upload = require('../../middleware/uploadMiddleware');

const {
  createMaterial,
  getMaterialsByCourse,
  getMaterial,
  updateMaterial,
  deleteMaterial,
} = require('../../controllers/teacher/materialController');

// Teacher creates material (with optional file)
router.post('/', auth, role('teacher'), upload.single('file'), createMaterial);

// Teacher updates metadata (title/content)
router.put('/:id', auth, role('teacher'), updateMaterial);

// Teacher deletes material
router.delete('/:id', auth, role('teacher'), deleteMaterial);

// Students / Public: list materials for a course
router.get('/course/:courseId', auth, getMaterialsByCourse); // optional auth for public access

// Get single material details
router.get('/:id', auth, getMaterial);

module.exports = router;
