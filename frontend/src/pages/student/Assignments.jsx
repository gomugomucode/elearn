import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import {
  FaFileAlt,
  FaCalendar,
  FaBook,
  FaClock,
  FaStar,
  FaCommentDots,
} from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchAssignments();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) fetchAssignments();
  }, [location.state]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/student/assignments");

      // normalize backend response
      const normalized = data.map((a) => ({
        ...a,
        submitted:
          a.submitted === true ||
          a.submission_id !== null ||
          a.submission !== undefined,

        marks: a.marks ?? a.submission?.marks ?? null,
        totalMarks: a.total_marks ?? a.submission?.total_marks ?? a.total_marks,
        feedback: a.feedback ?? a.submission?.feedback ?? null,
      }));

      setAssignments(normalized);
      setError(null);
    } catch (err) {
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  if (loading) return <p className="p-8 text-center">Loading assignments…</p>;
  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 My Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((a) => {
          const daysLeft = getDaysLeft(a.due_date);

          return (
            <div
              key={a.id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="bg-blue-50 px-4 py-2 border-b">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <FaBook size={14} /> {a.course_title}
                </p>
              </div>

              <div className="p-5">
                <h2 className="font-bold text-lg mb-2">{a.title}</h2>
                <p className="text-sm text-gray-600 mb-4">
                  {a.description || "No description"}
                </p>

                <div className="flex items-center gap-2 text-sm mb-2">
                  <FaCalendar />
                  {new Date(a.due_date).toDateString()}
                </div>

                {/* STATUS */}
                {!a.submitted && (
                  <p className="text-sm text-gray-700">
                    <FaClock className="inline mr-1" />
                    {daysLeft >= 0
                      ? `${daysLeft} days left`
                      : "Overdue"}
                  </p>
                )}

                {/* MARKS */}
                {a.submitted && a.marks !== null && (
                  <div className="mt-3 bg-green-50 p-3 rounded">
                    <p className="flex items-center gap-2 font-semibold text-green-700">
                      <FaStar />
                      Marks: {a.marks}
                      {a.totalMarks ? ` / ${a.totalMarks}` : ""}
                    </p>
                  </div>
                )}

                {/* FEEDBACK */}
                {a.submitted && a.feedback && (
                  <div className="mt-3 bg-gray-50 p-3 rounded">
                    <p className="flex items-start gap-2 text-sm text-gray-700">
                      <FaCommentDots className="mt-1" />
                      {a.feedback}
                    </p>
                  </div>
                )}

                {/* WAITING */}
                {a.submitted && a.marks === null && (
                  <p className="mt-3 text-sm text-orange-600">
                    ⏳ Awaiting evaluation
                  </p>
                )}
              </div>

              <div className="px-5 pb-5">
                {a.submitted ? (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed"
                  >
                    Submitted
                  </button>
                ) : (
                  <Link
                    to={`/student/assignments/${a.id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Submit Assignment
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
