const fs = require('fs').promises;
const path = require('path');

const postsFile = path.join(__dirname, '..', 'data', 'posts.json');

async function readPosts() {
  try {
    const raw = await fs.readFile(postsFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    // if file doesn't exist or is empty, return empty array
    return [];
  }
}

async function writePosts(posts) {
  await fs.mkdir(path.dirname(postsFile), { recursive: true });
  await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), 'utf8');
}

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await readPosts();
    res.json({ posts });
  } catch (err) {
    console.error('getAllPosts error', err);
    res.status(500).json({ message: 'Failed to read posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const posts = await readPosts();
    const id = req.params.id;
    const post = posts.find(p => String(p.id) === String(id));
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    console.error('getPostById error', err);
    res.status(500).json({ message: 'Failed to read post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const posts = await readPosts();
    const now = new Date().toISOString();
    const id = posts.length ? Math.max(...posts.map(p => Number(p.id))) + 1 : 1;
    const { title, content, excerpt, author, tags, image } = req.body;
    const newPost = {
      id,
      title: title || `Untitled post ${id}`,
      excerpt: excerpt || (content ? String(content).slice(0, 140) : ''),
      content: content || '',
      author: author || 'Admin',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      image: image || null,
      createdAt: now,
      updatedAt: now,
    };
    posts.unshift(newPost); // newest first
    await writePosts(posts);
    res.status(201).json({ post: newPost });
  } catch (err) {
    console.error('createPost error', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const posts = await readPosts();
    const id = req.params.id;
    const idx = posts.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Post not found' });
    const existing = posts[idx];
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };
    posts[idx] = updated;
    await writePosts(posts);
    res.json({ post: updated });
  } catch (err) {
    console.error('updatePost error', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const posts = await readPosts();
    const id = req.params.id;
    const idx = posts.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Post not found' });
    const [removed] = posts.splice(idx, 1);
    await writePosts(posts);
    res.json({ post: removed });
  } catch (err) {
    console.error('deletePost error', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};