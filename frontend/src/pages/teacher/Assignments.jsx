// src/pages/teacher/Assignments.jsx
import { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getTeacherAssignments,
  createTeacherAssignment,
  updateTeacherAssignment,
  deleteTeacherAssignment,
} from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaBook } from "react-icons/fa";

const TeacherAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    course_id: "",
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseData, assignmentData] = await Promise.all([
          getTeacherCourses(),
          getTeacherAssignments(),
        ]);
        setCourses(courseData);
        setAssignments(assignmentData);
      } catch (err) {
        console.error(err);
        alert("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ course_id: "", title: "", description: "", due_date: "" });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const newAssignment = await createTeacherAssignment(formData);
      setAssignments([...assignments, newAssignment]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create assignment.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateTeacherAssignment(editingAssignment.id, formData);
      setAssignments(
        assignments.map((a) => (a.id === editingAssignment.id ? updated : a))
      );
      setShowEditModal(false);
      setEditingAssignment(null);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to update assignment.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteTeacherAssignment(id);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete assignment.");
    }
  };

  const openEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      course_id: assignment.course_id,
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date.split("T")[0], // Format for input[type=date]
    });
    setShowEditModal(true);
  };

  const getCourseTitle = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Assignments</h1>
              <p className="mt-2 text-lg text-gray-600">
                Create and manage assignments across all your courses
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
            >
              <FaPlus />
              New Assignment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 animate-pulse">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow">
            <p className="text-2xl text-gray-500 mb-6">No assignments created yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium"
            >
              Create Your First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Course Tag & Due Date Badge */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full">
                      <FaBook className="text-xs" />
                      {getCourseTitle(assignment.course_id)}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FaCalendarAlt />
                      {new Date(assignment.due_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {assignment.title}
                  </h3>
                  <p className="text-gray-600 text-sm flex-1 line-clamp-4">
                    {assignment.description || "No description provided."}
                  </p>

                  {/* Actions */}
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => openEditModal(assignment)}
                      className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                      title="Edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-2 text-sm font-medium"
                      title="Delete"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {showCreateModal ? "Create New Assignment" : "Edit Assignment"}
            </h2>
            <form onSubmit={showCreateModal ? handleCreate : handleUpdate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.course_id}
                  onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Week 3: React Hooks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Explain what students need to do..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  {showCreateModal ? "Create Assignment" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingAssignment(null);
                    resetForm();
                  }}
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

export default TeacherAssignments;