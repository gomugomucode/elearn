const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs"); // if needed
// const initDB = require('./config/db');


const db = require("./config/db");


// Load env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.options("*", cors());


const auth = require("./middleware/authMiddleware");

const enrollRoutes =  require("./routes/student/enroll.routes")

app.use("/api/student/enroll", auth, enrollRoutes);


const myCoursesRoutes = require("./routes/student/myCourses.routes");

app.use("/api/student/my-courses", auth, myCoursesRoutes);


const studentCourseDetail = require("./routes/student/courseDetail.routes");

app.use("/api/student/course", auth, studentCourseDetail);


// Teacher Quiz routes
const teacherQuizRoutes = require('./routes/teacher/quizRoutes'); // updated routes
app.use('/api/teacher/quizzes', teacherQuizRoutes);



// course file routes
const courseFileRoutes = require("./routes/courseFileRoutes"); // use require
const COURSES_DIR = path.join(process.cwd(), 'courses');
if (!fs.existsSync(COURSES_DIR)) fs.mkdirSync(COURSES_DIR);
app.use("/api/courseFile", courseFileRoutes);



// -----------------------------
//       ROUTE IMPORTS
// -----------------------------

// Auth
const authRoutes = require("./routes/authRoutes");

// Admin
const adminRoutes = require("./routes/adminRoutes");



// Teacher
const teacherRoutes = require("./routes/teacher/index");
const courseRoutesTeacher = require("./routes/teacher/courseRoutes");
const materialRoutesTeacher = require("./routes/teacher/materialRoutes");

// Student
const studentDashboardRoutes = require("./routes/student/dashboard.routes");
const studentCourseRoutes = require("./routes/student/course.routes");
const studentQuizRoutes = require("./routes/student/quiz.routes");
const studentAssignmentRoutes = require("./routes/student/assignment.routes");
const studentStatsRoutes = require("./routes/student/stats.routes");

// const router = express.Router();

// Blog / Posts
const blogRoutes = require("./routes/blogRoutes");

// NEW — Your “get all courses” + “course details” routes
const courseRoutes = require("./routes/courses"); // <<< COMMON JS VERSION
// const studentRoutes = require("./routes/student"); // <<< COMMON JS VERSION

// -----------------------------
//       ROUTES SETUP
// -----------------------------

// Student Routes
app.use("/api/student/dashboard", studentDashboardRoutes);
app.use("/api/student/courses", studentCourseRoutes);
app.use("/api/student/quiz", studentQuizRoutes);
app.use("/api/student/assignments", studentAssignmentRoutes);
app.use("/api/student/stats", studentStatsRoutes);

// Global Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/teacher/courses", courseRoutesTeacher);
app.use("/api/teacher/materials", materialRoutesTeacher);

app.use("/api/courses", courseRoutes);
// app.use("/api/student", studentRoutes);

// Blog
app.use("/api/posts", blogRoutes);

// -----------------------------
//       404 HANDLER
// -----------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

// -----------------------------
//       START SERVER
// // -----------------------------
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


(async () => {
  global.db = db; 


  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();