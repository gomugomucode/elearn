import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ All courses
        const resCourses = await axios.get("http://localhost:5000/api/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(resCourses.data.courses || []);

        // ✅ My enrolled courses
        const resEnrolled = await axios.get(
          "http://localhost:5000/api/student/my-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEnrolledCourses(resEnrolled.data.courses.map((c) => c.courseId));
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    loadCourses();
  }, []);

  const isEnrolled = (courseId) => enrolledCourses.includes(courseId);

  // ✅ ENROLL HANDLER (THIS IS THE FIX)
  const handleEnroll = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/student/enroll/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // update UI immediately
      setEnrolledCourses((prev) => [...prev, courseId]);

      // go to course detail
      navigate(`/student/course/${courseId}`);
    } catch (err) {
      console.error("Enrollment failed", err);
      alert("Enrollment failed. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>

      {courses.length === 0 && (
        <p className="text-gray-500">No courses available.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={
                course.thumbnail
                  ? `http://localhost:5000/uploads/${course.thumbnail}`
                  : course.course_image
                  ? `http://localhost:5000/uploads/${course.course_image}`
                  : "http://localhost:5173/placeholder-course.png"
              }
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold text-lg">{course.title}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {course.description
                  ? course.description.slice(0, 70) + "..."
                  : "No description provided."}
              </p>

              {isEnrolled(course.id) ? (
                <Link
                  to={`/student/course/${course.id}`}
                  className="mt-4 block bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700"
                >
                  Continue
                </Link>
              ) : (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
