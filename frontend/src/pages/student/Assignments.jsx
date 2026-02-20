import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/student/assignments");
      setAssignments(data);
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

      {assignments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded">
          <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No assignments yet</p>
        </div>
      )}

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
                  {a.description || "No description provided"}
                </p>

                <div className="flex items-center gap-2 text-sm mb-2">
                  <FaCalendar />
                  {new Date(a.due_date).toDateString()}
                </div>

            {/* NOT SUBMITTED - Use Number() === 0 to be safe */}
{Number(a.submitted) === 0 && (
  <p className="text-sm text-gray-700">
    <FaClock className="inline mr-1" />
    {daysLeft >= 0 ? `${daysLeft} days left` : "Overdue ❌"}
  </p>
)}

                {/* SUBMITTED BUT NOT GRADED */}
                {/* SUBMITTED BUT NOT GRADED */}
{!!a.submitted && a.status !== "graded" && a.grade === null && (
  <p className="mt-3 text-sm text-orange-600">
    ⏳ Awaiting evaluation
  </p>
)}
                {/* GRADED */}
              {/* Change this in your Assignments.jsx */}
{a.grade !== null && (
  <>
    <div className="mt-3 bg-green-50 p-3 rounded">
      <p className="flex items-center gap-2 font-semibold text-green-700">
        <FaStar />
        Marks: {a.grade}/100
      </p>
    </div>

    {a.feedback && (
      <div className="mt-3 bg-gray-50 p-3 rounded">
        <p className="flex items-start gap-2 text-sm text-gray-700">
          <FaCommentDots className="mt-1" />
          {a.feedback}
        </p>
      </div>
    )}
  </>
)}
              </div>

             <div className="px-5 pb-5">
  {/* Check specifically for 1 because the DB sends a number, not a boolean */}
  {Number(a.submitted) === 1 ? (
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
