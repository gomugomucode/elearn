// src/pages/teacher/Courses.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit } from "react-icons/fa"; // icons
import {
  getTeacherCourses,
  createTeacherCourse,
  deleteTeacherCourse,
} from "../../services/api";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getTeacherCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  const formData = new FormData();
  formData.append("title", newCourse.title);
  formData.append("description", newCourse.description);
  if (newCourse.thumbnail) formData.append("thumbnail", newCourse.thumbnail);
  if (newCourse.courseImage)
    formData.append("courseImage", newCourse.courseImage);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", newCourse.title);
      formData.append("description", newCourse.description);
      if (newCourse.thumbnail)
        formData.append("thumbnail", newCourse.thumbnail);
      if (newCourse.courseImage)
        formData.append("courseImage", newCourse.courseImage);

      const response = await createTeacherCourse(formData);
      console.log("Created course:", response);

      // Create complete course object with API response
      const newCourseData = {
        id: response.courseId,
        title: newCourse.title,
        description: newCourse.description,
        thumbnail: response.thumbnail,
        course_image: response.diagram_url,
      };

      setCourses([...courses, newCourseData]);
      setNewCourse({ title: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create course.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteTeacherCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      <form
        onSubmit={handleCreateCourse}
        className="mb-6 bg-white p-4 rounded shadow"
      >
        <h2 className="font-semibold mb-2">Create New Course</h2>
        <input
          type="text"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) =>
            setNewCourse({ ...newCourse, title: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) =>
            setNewCourse({ ...newCourse, description: e.target.value })
          }
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewCourse({ ...newCourse, thumbnail: e.target.files[0] })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewCourse({ ...newCourse, courseImage: e.target.files[0] })
          }
          className="w-full p-2 border rounded mb-2"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 && (
          <p className="text-gray-500 col-span-full">No courses yet.</p>
        )}
        {courses.map((c) => (
          <div
            key={`${c.id || c.title}-${Date.now()}`}
            className="bg-white p-4 rounded shadow relative"
          >
            {/* Edit icon */}
            <button
              onClick={() => navigate(`/teacher/courses/${c.id}/edit`)}
              className="absolute top-2 right-10 text-blue-600 hover:text-blue-800"
              title="Edit Course"
            >
              <FaEdit />
            </button>

            {/* Delete icon */}
            <button
              onClick={() => handleDelete(c.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              title="Delete Course"
            >
              <FaTrash />
            </button>

            <h3 className="font-bold text-lg">{c.title}</h3>
            <p className="text-gray-600 mt-1">
              {c.description || "No description"}
            </p>

            {c.thumbnail && (
              <img
                src={`http://localhost:5000/uploads/${c.thumbnail}`}
                alt="Thumbnail"
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}

            {c.course_image && (
              <img
                src={`http://localhost:5000/uploads/${c.course_image}`}
                alt="Course"
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => navigate(`/teacher/courses/${c.id}/assignments`)}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                Assignments
              </button>
              <button
                onClick={() => navigate(`/teacher/courses/${c.id}/materials`)}
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
              >
                Materials
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherCourses;
