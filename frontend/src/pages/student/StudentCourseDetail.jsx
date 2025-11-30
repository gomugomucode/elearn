


import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    api.get(`/student/course/${courseId}`).then((res) => {
      setCourse(res.data.course);
    });
  }, [courseId]);

  if (!course) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-700 mt-2">{course.description}</p>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Assignments</h2>
        {course.assignments.length === 0 && (
          <p className="text-gray-600">No assignments available.</p>
        )}

        {course.assignments.map((a) => (
          <Link
            key={a.id}
            to={`/student/assignment/${a.id}`}
            className="block p-3 bg-white shadow rounded mb-2"
          >
            {a.title}
          </Link>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-bold mb-2">Quizzes</h2>
        {course.quizzes.length === 0 && (
          <p className="text-gray-600">No quizzes available.</p>
        )}

        {course.quizzes.map((q) => (
          <Link
            key={q.id}
            to={`/student/quiz/${q.id}`}
            className="block p-3 bg-white shadow rounded mb-2"
          >
            {q.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
