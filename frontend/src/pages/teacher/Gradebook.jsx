import { useEffect, useState } from "react";
import api from "../../services/api";
import { FaGraduationCap, FaSearch, FaExclamationCircle } from "react-icons/fa";

export default function Gradebook() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGradebook = async () => {
      try {
        const res = await api.get("/teacher/gradebook");
        setData(res.data);
      } catch (err) {
        console.error("Error loading gradebook", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGradebook();
  }, []);

  const filteredData = data.filter(item => 
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Gradebook...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FaGraduationCap className="text-blue-600" /> Student Gradebook
        </h1>
        
        {/* <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text"
            placeholder="Search student or course..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 border-b">Student</th>
              <th className="px-6 py-4 border-b">Course</th>
              <th className="px-6 py-4 border-b">Assignment</th>
              <th className="px-6 py-4 border-b">Status</th>
              <th className="px-6 py-4 border-b">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">{item.student_name}</td>
                <td className="px-6 py-4 text-gray-600">{item.course_title}</td>
                <td className="px-6 py-4 text-gray-600">{item.assignment_title}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.status === 'graded' ? 'bg-green-100 text-green-700' : 
                    item.submitted_at ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.status === 'graded' ? 'Graded' : item.submitted_at ? 'Pending' : 'Not Submitted'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-800">
                  {item.grade !== null ? `${item.grade}/100` : (
                    <span className="text-gray-400 flex items-center gap-1 font-normal">
                      <FaExclamationCircle size={12}/> No Grade
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-gray-500">No records found.</div>
        )}
      </div>
    </div>
  );
}