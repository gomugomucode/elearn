// src/pages/Course/Courses.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };

    load();
  }, []);

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
              src={`/api/courses/${course.id}/thumbnail`}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h2 className="font-bold text-lg">{course.title}</h2>
              <p className="text-gray-600 text-sm mt-1">
                {course.description?.slice(0, 70)}...
              </p>

              <Link
                to={`/course/${course.id}`}
                className="mt-4 block bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700"
              >
                View Course
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
