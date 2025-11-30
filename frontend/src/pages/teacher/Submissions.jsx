// src/pages/teacher/Submissions.jsx
import { useEffect, useState } from 'react';
import { getTeacherSubmissions, gradeTeacherSubmission } from '../../services/api';

const TeacherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getTeacherSubmissions();
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load submissions.');
      }
    };
    fetchSubmissions();
  }, []);

  const handleEvaluate = async () => {
    try {
      const updated = await gradeTeacherSubmission(selected.id, { grade, feedback });
      setSubmissions(submissions.map(s => s.id === selected.id ? updated : s));
      setSelected(null);
      setGrade('');
      setFeedback('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit grade.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Submissions</h1>

     <div className="space-y-3">
  {submissions.map((s, index) => {
    // fallback key if s.id is missing
    const key = s.id ?? `submission-${index}`;

    return (
      <div key={key} className="bg-white p-4 rounded shadow">
        <h3 className="font-bold">{s.assignment_title}</h3>
        <p className="text-gray-600 text-sm">Student: {s.student_name}</p>
        <p className="text-xs text-gray-500">
          Submitted: {new Date(s.submitted_at).toLocaleString()}
        </p>
        <p
          className={`mt-1 text-sm font-medium ${
            s.status === 'graded' ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          Status: {s.status}
        </p>
        {s.grade && <p className="text-sm mt-1">Grade: {s.grade}/100</p>}
        {s.feedback && <p className="text-sm mt-1">Feedback: {s.feedback}</p>}
        <button
          onClick={() => {
            setSelected(s);
            setGrade(s.grade || '');
            setFeedback(s.feedback || '');
          }}
          className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm"
        >
          {s.status === 'graded' ? 'Re-evaluate' : 'Evaluate'}
        </button>
      </div>
    );
  })}
</div>

su      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Evaluate Submission</h2>
            <p><strong>Student:</strong> {selected.student_name}</p>
            <p><strong>Assignment:</strong> {selected.assignment_title}</p>

            <div className="mt-4">
              <label className="block mb-1">Grade (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Feedback</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEvaluate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSubmissions;
