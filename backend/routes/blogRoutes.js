const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/blogController');

// GET /api/posts
router.get('/', getAllPosts);

// GET /api/posts/:id
router.get('/:id', getPostById);

// POST /api/posts
router.post('/', createPost);

// PUT /api/posts/:id
router.put('/:id', updatePost);

// DELETE /api/posts/:id
router.delete('/:id', deletePost);

module.exports = router;