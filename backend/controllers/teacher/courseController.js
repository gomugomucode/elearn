const pool = require('../../config/db');

// ✅ Create Course
exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  const teacherId = req.user.id;
  const thumbnail = req.files?.thumbnail?.[0]?.filename || null;
  const diagram_url = req.files?.course_image?.[0]?.filename || null; // rename to match DB

  try {
    const [result] = await pool.query(
      'INSERT INTO courses (title, description, teacher_id, thumbnail, diagram_url) VALUES (?, ?, ?, ?, ?)',
      [title, description, teacherId, thumbnail, diagram_url]
    );

    res.status(201).json({ 
      message: 'Course created successfully', 
      courseId: result.insertId,
      thumbnail,
      diagram_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get Teacher Courses
exports.getTeacherCourses = async (req, res) => {
  const teacherId = req.user.id;

  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE teacher_id = ?', [teacherId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Update Course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const teacherId = req.user.id;

  const thumbnail = req.files?.thumbnail?.[0]?.filename || null;
  const diagram_url = req.files?.course_image?.[0]?.filename || null;

  try {
    const [result] = await pool.query(
      `UPDATE courses 
       SET title = ?, description = ?, status = COALESCE(?, status),
           thumbnail = COALESCE(?, thumbnail),
           diagram_url = COALESCE(?, diagram_url)
       WHERE id = ? AND teacher_id = ?`,
      [title, description, status, thumbnail, diagram_url, id, teacherId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete Course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  const teacherId = req.user.id;

  try {
    // Delete related assignments first OR use ON DELETE CASCADE in DB
    await pool.query('DELETE FROM assignments WHERE course_id = ?', [id]);

    const [result] = await pool.query(
      'DELETE FROM courses WHERE id = ? AND teacher_id = ?',
      [id, teacherId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Course not found or unauthorized' });
    }

    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get All Active Courses (For students)
exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.name as teacher_name 
       FROM courses c 
       JOIN users u ON c.teacher_id = u.id 
       WHERE c.status = "Active"`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
