// src/pages/teacher/Courses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaBook, FaFileAlt } from "react-icons/fa";
import {
  getTeacherCourses,
  createTeacherCourse,
  deleteTeacherCourse,
} from "../../services/api";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnail: null,
    courseImage: null, // kept as camelCase in state for readability
  });
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getTeacherCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);

      if (newCourse.thumbnail) {
        formData.append("thumbnail", newCourse.thumbnail);
      }
      if (newCourse.courseImage) {
        formData.append("course_image", newCourse.courseImage); // ← FIXED: matches backend
      }

      const response = await createTeacherCourse(formData);

      const newCourseData = {
        id: response.courseId,
        title: newCourse.title,
        description: newCourse.description,
        thumbnail: response.thumbnail || null,
        course_image: response.diagram_url || null, // adjust based on your actual API response
      };

      setCourses([...courses, newCourseData]);
      setShowModal(false);
      setNewCourse({ title: "", description: "", thumbnail: null, courseImage: null });
    } catch (err) {
      console.error(err);
      alert("Failed to create course.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteTeacherCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header - No Gradient */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Courses</h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage and create courses for your students
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
            >
              <FaPlus />
              Create New Course
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 animate-pulse">Loading your courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <p className="text-2xl text-gray-500 mb-6">You haven't created any courses yet.</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium"
            >
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((c) => (
              <div
                key={c.id}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Course Image */}
                {c.thumbnail || c.course_image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`http://localhost:5000/uploads/${c.thumbnail || c.course_image}`}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <FaBook className="text-6xl text-gray-400" />
                  </div>
                )}

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {c.description || "No description provided."}
                  </p>

                  {/* Action Buttons on Hover */}
                  <div className="mt-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => navigate(`/teacher/courses/${c.id}/assignments`)}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FaFileAlt /> Assignments
                    </button>
                    <button
                      onClick={() => navigate(`/teacher/courses/${c.id}/materials`)}
                      className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FaBook /> Materials
                    </button>
                  </div>
                </div>

                {/* Edit & Delete Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/teacher/courses/${c.id}/edit`)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition"
                    title="Edit Course"
                  >
                    <FaEdit className="text-indigo-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-white transition"
                    title="Delete Course"
                  >
                    <FaTrash className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Advanced Web Development"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Brief overview of what students will learn..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, thumbnail: e.target.files[0] })
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, courseImage: e.target.files[0] })
                  }
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium"
                >
                  {creating ? "Creating..." : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;