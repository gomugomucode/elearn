// src/pages/Course/CourseDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    // Fetch course details
    api.get(`/courses/${id}`).then((res) => {
      setCourse(res.data.course);
    });

    // Check if student is enrolled
    api
      .get(`/student/enroll/check/${id}`)
      .then((res) => {
        setIsEnrolled(res.data.enrolled); // true or false
      })
      .catch(() => setIsEnrolled(false));
  }, [id]);

  if (!course) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-gray-700 mt-3">{course.description}</p>

      <img
        src={`/api/courses/${id}/thumbnail`}
        className="w-full rounded-lg mt-5"
        alt="Thumbnail"
      />

      {/* Course Content */}
      <div className="mt-8">
        <h2 className="font-bold text-xl mb-3">Course Content</h2>

        {course.sections?.length === 0 && (
          <p className="text-gray-600">No sections available.</p>
        )}

        {course.sections?.map((section) => (
          <div key={section.id} className="mb-4 p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{section.title}</h3>

            <ul className="ml-4 list-disc text-gray-700">
              {section.lessons.map((lesson) => (
                <li key={lesson.id}>{lesson.title}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Enroll or Continue Button */}
      {!isEnrolled ? (
        <button
          onClick={() => {
            api.post(`/student/enroll/${id}`).then(() => {
              setIsEnrolled(true);
            });
          }}
          className="mt-6 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Enroll Now
        </button>
      ) : (
        <Link
          to={`/student/course/${id}`}
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Continue Learning
        </Link>
      )}

    </div>
  );
}
