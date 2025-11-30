// src/App.jsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Pages
import Login from "./pages/Login";
import Landingpage from "./pages/Landingpage";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Course/Courses";
import PublicCourseDetail from "./pages/Course/CourseDetail";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCourses from "./pages/admin/ManageCourses";
import Profile from "./pages/admin/Profile";

// Teacher
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherCourses from "./pages/teacher/Courses";
import TeacherProfile from "./pages/teacher/Profile";
import TeacherAssignments from "./pages/teacher/Assignments";
import TeacherQuizzes from "./pages/teacher/Quizzes";
import TeacherSubmissions from "./pages/teacher/Submissions";
import EditCourse from "./pages/teacher/EditCourse";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import QuizPage from "./pages/student/QuizPage";
import AssignmentSubmission from "./pages/student/AssignmentSubmission";
import Assignments from "./pages/student/Assignments";
import StudentProfile from "./pages/student/StudentProfile";
import StudentQuiz from "./pages/student/StudentQuiz"

// Layout Components
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-1 pt-24">{children}</main>
  </div>
);

const AuthenticatedLayout = ({ children, user }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />

    <div className="flex flex-1 pt-16">
      {/* Sidebar only if logged in */}
      {user ? <Sidebar userRole={user.role} userName={user.name} /> : null}

      <main
        className={`flex-1 p-4 md:p-6 transition-all duration-300 ${
          user ? "ml-64" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  </div>
);

function StudentRoutesWrapper({ user, isLoggedIn }) {
  // Parent wrapper for all /student/* routes so we don't repeat the layout and auth check.
  if (!isLoggedIn || user?.role !== "student") {
    return <Navigate to="/login" replace />;
  }
  return (
    <AuthenticatedLayout user={user}>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function TeacherRoutesWrapper({ user, isLoggedIn }) {
  if (!isLoggedIn || user?.role !== "teacher") {
    return <Navigate to="/login" replace />;
  }
  return (
    <AuthenticatedLayout user={user}>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function AdminRoutesWrapper({ user, isLoggedIn }) {
  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return (
    <AuthenticatedLayout user={user}>
      <Outlet />
    </AuthenticatedLayout>
  );
}

function AppContent() {
  const { user, isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Landingpage />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route
        path="/blogs"
        element={
          <PublicLayout>
            <Blog />
          </PublicLayout>
        }
      />

      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />

      <Route
        path="/course"
        element={
          isLoggedIn ? (
            <AuthenticatedLayout user={user}>
              <Courses />
            </AuthenticatedLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/course/:id"
        element={
          isLoggedIn ? (
            <AuthenticatedLayout user={user}>
              <PublicCourseDetail />
            </AuthenticatedLayout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Admin Routes (grouped) */}
      <Route
        path="/admin"
        element={<AdminRoutesWrapper user={user} isLoggedIn={isLoggedIn} />}
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Teacher Routes (grouped) */}
      <Route
        path="/teacher"
        element={<TeacherRoutesWrapper user={user} isLoggedIn={isLoggedIn} />}
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCourses />} />

        <Route path="/teacher/courses/:id/edit" element={<EditCourse />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="quizzes" element={<TeacherQuizzes />} />
        <Route path="submissions" element={<TeacherSubmissions />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Student Routes (grouped) */}
      <Route
        path="/student"
        element={<StudentRoutesWrapper user={user} isLoggedIn={isLoggedIn} />}
      >
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="course/:courseId" element={<StudentCourseDetail />} />
        <Route path="assignments" element={<Assignments />} />
        <Route
          path="assignments/:assignmentId"
          element={<AssignmentSubmission />}
        />{" "}
          {/* ➕ ADD THIS */}
  <Route path="quizzes" element={<StudentQuiz />} />
        {/* CHANGED: assignment → assignments */}
        <Route path="quiz/:quizId" element={<QuizPage />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* If you want to handle unknown student/teacher/admin subpaths, add a specific 404 under the respective parent.
          IMPORTANT: Do NOT add broad catch-all redirects like `path="/student/*" element={<Navigate to="/student/dashboard" />}`.
          They will override intended child routes in some situations and cause the redirect loop/incorrect redirects. */}

      {/* Global 404 */}
      <Route
        path="*"
        element={
          <PublicLayout>
            <NotFound />
          </PublicLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
