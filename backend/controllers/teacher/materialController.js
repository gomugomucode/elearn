// controllers/materialController.js
const pool = require('../../config/db');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'materials');

// POST /api/materials
exports.createMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { course_id, title, content } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ message: 'course_id and title are required' });
    }

    // Verify teacher owns the course (important)
    const [courseRows] = await pool.query('SELECT * FROM courses WHERE id = ? AND teacher_id = ?', [course_id, teacherId]);
    if (courseRows.length === 0) {
      return res.status(403).json({ message: 'You do not own this course or it does not exist' });
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/materials/${req.file.filename}`; // served by express.static
    }

    const [result] = await pool.query(
      'INSERT INTO study_materials (course_id, title, content, file_url) VALUES (?, ?, ?, ?)',
      [course_id, title, content || null, fileUrl]
    );

    res.status(201).json({ message: 'Material created', id: result.insertId });
  } catch (err) {
    console.error('createMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/materials/course/:courseId
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const [rows] = await pool.query(
      'SELECT id, course_id, title, content, file_url, created_at FROM study_materials WHERE course_id = ? ORDER BY created_at DESC',
      [courseId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getMaterialsByCourse error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/materials/:id
exports.getMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM study_materials WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Material not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/materials/:id
exports.updateMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const id = req.params.id;
    const { title, content } = req.body;

    // Ensure material exists and belongs to course owned by teacher
    const [rows] = await pool.query(
      `SELECT sm.* FROM study_materials sm
       JOIN courses c ON sm.course_id = c.id
       WHERE sm.id = ? AND c.teacher_id = ?`,
      [id, teacherId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Material not found or unauthorized' });

    const updateQuery = 'UPDATE study_materials SET title = ?, content = ? WHERE id = ?';
    await pool.query(updateQuery, [title || rows[0].title, content || rows[0].content, id]);

    res.json({ message: 'Material updated' });
  } catch (err) {
    console.error('updateMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const id = req.params.id;

    // Check ownership
    const [rows] = await pool.query(
      `SELECT sm.* FROM study_materials sm
       JOIN courses c ON sm.course_id = c.id
       WHERE sm.id = ? AND c.teacher_id = ?`,
      [id, teacherId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Material not found or unauthorized' });

    const fileUrl = rows[0].file_url;
    if (fileUrl) {// controllers/materialController.js
const pool = require('../../config/db');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'materials');

// POST /api/materials
exports.createMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { course_id, title, content } = req.body;

    if (!course_id || !title) {
      return res.status(400).json({ message: 'course_id and title are required' });
    }

    // Verify teacher owns the course (important)
    const [courseRows] = await pool.query('SELECT * FROM courses WHERE id = ? AND teacher_id = ?', [course_id, teacherId]);
    if (courseRows.length === 0) {
      return res.status(403).json({ message: 'You do not own this course or it does not exist' });
    }

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/materials/${req.file.filename}`; // served by express.static
    }

    const [result] = await pool.query(
      'INSERT INTO study_materials (course_id, title, content, file_url) VALUES (?, ?, ?, ?)',
      [course_id, title, content || null, fileUrl]
    );

    res.status(201).json({ message: 'Material created', id: result.insertId });
  } catch (err) {
    console.error('createMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/materials/course/:courseId
exports.getMaterialsByCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const [rows] = await pool.query(
      'SELECT id, course_id, title, content, file_url, created_at FROM study_materials WHERE course_id = ? ORDER BY created_at DESC',
      [courseId]
    );
    res.json(rows);
  } catch (err) {
    console.error('getMaterialsByCourse error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/materials/:id
exports.getMaterial = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM study_materials WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Material not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/materials/:id
exports.updateMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const id = req.params.id;
    const { title, content } = req.body;

    // Ensure material exists and belongs to course owned by teacher
    const [rows] = await pool.query(
      `SELECT sm.* FROM study_materials sm
       JOIN courses c ON sm.course_id = c.id
       WHERE sm.id = ? AND c.teacher_id = ?`,
      [id, teacherId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Material not found or unauthorized' });

    const updateQuery = 'UPDATE study_materials SET title = ?, content = ? WHERE id = ?';
    await pool.query(updateQuery, [title || rows[0].title, content || rows[0].content, id]);

    res.json({ message: 'Material updated' });
  } catch (err) {
    console.error('updateMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const id = req.params.id;

    // Check ownership
    const [rows] = await pool.query(
      `SELECT sm.* FROM study_materials sm
       JOIN courses c ON sm.course_id = c.id
       WHERE sm.id = ? AND c.teacher_id = ?`,
      [id, teacherId]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'Material not found or unauthorized' });

    const fileUrl = rows[0].file_url;
    if (fileUrl) {
      const filename = path.basename(fileUrl);
      const fullPath = path.join(UPLOAD_DIR, filename);
      fs.unlink(fullPath, (err) => {
        if (err) console.warn('Failed to delete file:', fullPath, err.message);
      });
    }

    await pool.query('DELETE FROM study_materials WHERE id = ?', [id]);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error('deleteMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

      const filename = path.basename(fileUrl);
      const fullPath = path.join(UPLOAD_DIR, filename);
      fs.unlink(fullPath, (err) => {
        if (err) console.warn('Failed to delete file:', fullPath, err.message);
      });
    }

    await pool.query('DELETE FROM study_materials WHERE id = ?', [id]);
    res.json({ message: 'Material deleted' });
  } catch (err) {
    console.error('deleteMaterial error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
