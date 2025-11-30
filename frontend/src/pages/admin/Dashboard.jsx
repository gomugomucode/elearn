// ✅ CORRECTED DASHBOARD.JSX
import { useState, useEffect } from 'react';
import { getAdminDashboard } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => { // ← Remove `{ user }` prop
  const { user, isLoggedIn, loading: authLoading } = useAuth(); // ← Rename `loading` to avoid conflict
  const [greeting, setGreeting] = useState('');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true); // ← This is data loading, separate from auth

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (!user || !isLoggedIn) return; // ← Safety check

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await getAdminDashboard(token);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, isLoggedIn]); // ← Add dependencies

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) return null; // ← Extra safety

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-16">
      <main className="p-4 lg:ml-64">
        {/* Greeting */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-1">{greeting}, {user.name}!</h1>
          <p className="text-gray-600 text-sm md:text-base">Let’s manage your eLearning platform efficiently.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-10">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: UsersIcon, color: 'text-blue-500' },
            { label: 'Total Teachers', value: stats.totalTeachers, icon: GraduationCapIcon, color: 'text-green-500' },
            { label: 'Active Courses', value: stats.totalCourses, icon: BookOpenIcon, color: 'text-purple-500' },
            { label: 'Enrollments', value: stats.totalEnrollments, icon: ChartBarIcon, color: 'text-orange-500' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{item.value.toLocaleString()}</p>
                </div>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">System Activity</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <p className="text-gray-500">Recent activity logs will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Icons (unchanged)
const UsersIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const GraduationCapIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const BookOpenIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const ChartBarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default Dashboard;