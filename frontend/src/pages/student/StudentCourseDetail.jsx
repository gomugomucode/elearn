import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { BookOpenIcon, ClipboardDocumentListIcon, AcademicCapIcon } from "@heroicons/react/24/outline"; // Fixed imports

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("assignments"); // "assignments" or "quizzes"

  useEffect(() => {
    api
      .get(`/student/course/${courseId}`)
      .then((res) => {
        setCourse(res.data.course);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load course details. Please try again.");
        setLoading(false);
      });
  }, [courseId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 animate-pulse">Loading course...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
   {/* Hero Header - Clean version without background */}
<div className="max-w-7xl mx-auto px-6 py-10">
  <button
    onClick={() => navigate(-1)}
    className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition"
  >
    ← Back to Courses
  </button>
  <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">{course.title}</h1>
  <p className="text-lg text-gray-700 max-w-3xl">{course.description}</p>
</div>




      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Tabs + Lists */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-300 mb-8">
              <button
                onClick={() => setActiveTab("assignments")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "assignments"
                    ? "text-blue-600 border-b-4 border-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Assignments ({course.assignments.length})
              </button>
              <button
                onClick={() => setActiveTab("quizzes")}
                className={`px-6 py-3 font-medium transition ${
                  activeTab === "quizzes"
                    ? "text-green-600 border-b-4 border-green-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Quizzes ({course.quizzes.length})
              </button>
            </div>

            {/* Content based on tab */}
            {activeTab === "assignments" && (
              <div className="grid gap-4">
                {course.assignments.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-12">No assignments available yet.</p>
                ) : (
                  course.assignments.map((a) => (
                    <Link
                      key={a.id}
                      to={`/student/assignments/${a.id}`}
                      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ClipboardDocumentListIcon className="h-10 w-10 text-blue-600" /> {/* Fixed Icon */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{a.title}</h3>
                            <p className="text-sm text-gray-500">Assignment • Due soon</p>
                          </div>
                        </div>
                        <span className="text-blue-600">View →</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}

            {activeTab === "quizzes" && (
              <div className="grid gap-4">
                {course.quizzes.length === 0 ? (
                  <p className="text-gray-500 italic text-center py-12">No quizzes available yet.</p>
                ) : (
                  course.quizzes.map((q) => (
                    <Link
                      key={q.id}
                      to={`/student/quiz/${q.id}`}
                      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <AcademicCapIcon className="h-10 w-10 text-green-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{q.title}</h3>
                            <p className="text-sm text-gray-500">Quiz • 20 questions</p>
                          </div>
                        </div>
                        <span className="text-green-600">Start →</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar: Course Info */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <BookOpenIcon className="h-8 w-8 text-indigo-600" />
                Course Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Course ID</p>
                  <p className="font-medium">{courseId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                  <p className="font-medium">{course.assignments.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                  <p className="font-medium">{course.quizzes.length}</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-indigo-600 h-3 rounded-full w-45"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">45% Complete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
