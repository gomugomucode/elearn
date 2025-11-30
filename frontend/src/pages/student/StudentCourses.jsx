import { useEffect, useState } from "react";
import { fetchMyCourses } from "../../services/api";
import { Link } from "react-router-dom";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyCourses();
        setCourses(data.courses ?? data);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.courseId} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={`/api/courses/${course.courseId}/thumbnail`}
              alt={course.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">by {course.instructor}</p>

              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <Link
                to={`/student/course/${course.courseId}`}
                className="mt-4 block bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700"
              >
                {course.progress === 0 ? "Start Course" : "Continue"}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;


