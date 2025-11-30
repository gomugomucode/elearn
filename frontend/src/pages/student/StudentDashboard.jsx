


import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/student/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box title="Enrolled Courses" count={stats.courses} />
        <Box title="Pending Assignments" count={stats.pendingAssignments} />
        <Box title="Available Quizzes" count={stats.quizzes} />
      </div>
    </div>
  );
}

function Box({ title, count }) {
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl mt-2 font-bold">{count}</p>
    </div>
  );
}



