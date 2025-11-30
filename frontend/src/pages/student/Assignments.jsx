import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import { FaFileAlt, FaCalendar, FaBook, FaClock } from "react-icons/fa";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Refresh list if redirected from submission
  useEffect(() => {
    if (location.state?.refresh) fetchAssignments();
  }, [location.state]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/student/assignments");
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.response?.data?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (daysLeft, submitted) => {
    if (submitted) return "text-green-800 bg-green-100";
    if (daysLeft < 0) return "text-red-600 bg-red-50";
    if (daysLeft < 3) return "text-orange-600 bg-orange-50";
    return "text-gray-700 bg-gray-100";
  };

  const getStatusText = (daysLeft, submitted) => {
    if (submitted) return "Submitted ✅";
    if (daysLeft < 0) return `Overdue by ${Math.abs(daysLeft)} days`;
    if (daysLeft === 0) return "Due today!";
    return `${daysLeft} days left`;
  };

  if (loading) return <p className="p-8 text-center">Loading assignments...</p>;
  if (error)
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-semibold">{error}</p>
        <button onClick={fetchAssignments} className="mt-3 px-4 py-2 bg-red-600 text-white rounded">
          Retry
        </button>
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">📝 My Assignments</h1>
        <p className="text-gray-600 mt-1">{assignments.length} total assignments</p>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No assignments yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((a) => {
            const daysLeft = getDaysLeft(a.due_date);
            const statusColor = getStatusColor(daysLeft, a.submitted);
            const statusText = getStatusText(daysLeft, a.submitted);

            return (
              <div key={a.id} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                  <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
                    <FaBook size={14} /> {a.course_title}
                  </p>
                </div>

                <div className="p-5">
                  <h2 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{a.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{a.description || "No description provided"}</p>

                  <div className="flex items-center gap-2 text-gray-700 mb-3 text-sm">
                    <FaCalendar className="text-red-500" />
                    <span>{new Date(a.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>

                  <div className={`${statusColor} px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-2 mb-4`}>
                    <FaClock size={14} />
                    {statusText}
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <Link
                    to={`/student/assignments/${a.id}`}
                    className={`w-full block text-center px-4 py-2 font-semibold rounded-lg transition-colors ${
                      a.submitted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {a.submitted ? "Submitted" : "Submit Assignment"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
