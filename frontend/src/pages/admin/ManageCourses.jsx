import { useState, useEffect } from 'react';
import { getAdminCourses, deleteAdminCourse } from '../../services/api';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeArray = (data, key) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data[key] && Array.isArray(data[key])) return data[key];
    return [];
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getAdminCourses();
      setCourses(safeArray(data, 'courses'));
    } catch (error) {
      console.error("Failed to fetch courses:", error.response?.data || error.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteAdminCourse(courseId);
      alert("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      alert("Failed to delete course: " + error.message);
    }
  };

  const handleEdit = (course) => {
    alert(`Edit course: ${course.title}`);
  };

  if (loading) return <div className="ml-64 p-6 pt-24 min-h-screen bg-gray-50 flex items-center justify-center">Loading courses...</div>;

  return (
    <div className="ml-64 p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Courses</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No courses found.</td>
              </tr>
            ) : (
              courses.map(course => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{course.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.teacher_name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{course.enrollments || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      course.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>{course.status || 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCourses;
