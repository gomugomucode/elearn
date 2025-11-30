import fs from 'fs';
import path from 'path';

// Base folder for courses
const COURSES_DIR = path.join(process.cwd(), 'courses');

// Utility to create folder if not exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// ✅ Create a new course
export const createCourseFile = (req, res) => {
  const { title, description, teacher } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const folderName = `${title.replace(/\s+/g, '_')}_${Date.now()}`;
  const folderPath = path.join(COURSES_DIR, folderName);

  try {
    ensureDir(folderPath);

    // Create course.json
    const courseData = { title, description, teacher, folder: folderName, createdAt: new Date() };
    fs.writeFileSync(path.join(folderPath, 'course.json'), JSON.stringify(courseData, null, 2));

    // Initialize empty files
    fs.writeFileSync(path.join(folderPath, 'assignments.json'), JSON.stringify([], null, 2));
    fs.writeFileSync(path.join(folderPath, 'quizzes.json'), JSON.stringify([], null, 2));

    res.json({ message: 'Course created', courseData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// ✅ Get course data (with assignments/quizzes)
export const getFullCourseData = (req, res) => {
  const { folder } = req.params;
  const folderPath = path.join(COURSES_DIR, folder);

  if (!fs.existsSync(folderPath)) return res.status(404).json({ error: 'Course not found' });

  try {
    const course = JSON.parse(fs.readFileSync(path.join(folderPath, 'course.json')));
    const assignments = JSON.parse(fs.readFileSync(path.join(folderPath, 'assignments.json')));
    const quizzes = JSON.parse(fs.readFileSync(path.join(folderPath, 'quizzes.json')));
    res.json({ course, assignments, quizzes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read course data' });
  }
};

// ✅ Add assignment to a course
export const addAssignment = (req, res) => {
  const { folder, assignment } = req.body;
  const folderPath = path.join(COURSES_DIR, folder);
  if (!fs.existsSync(folderPath)) return res.status(404).json({ error: 'Course not found' });

  const filePath = path.join(folderPath, 'assignments.json');
  const assignments = JSON.parse(fs.readFileSync(filePath));
  assignments.push({ id: Date.now(), ...assignment });
  fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));
  res.json({ message: 'Assignment added', assignments });
};

// ✅ Add quiz to a course
export const addQuiz = (req, res) => {
  const { folder, quiz } = req.body;
  const folderPath = path.join(COURSES_DIR, folder);
  if (!fs.existsSync(folderPath)) return res.status(404).json({ error: 'Course not found' });

  const filePath = path.join(folderPath, 'quizzes.json');
  const quizzes = JSON.parse(fs.readFileSync(filePath));
  quizzes.push({ id: Date.now(), ...quiz });
  fs.writeFileSync(filePath, JSON.stringify(quizzes, null, 2));
  res.json({ message: 'Quiz added', quizzes });
};
