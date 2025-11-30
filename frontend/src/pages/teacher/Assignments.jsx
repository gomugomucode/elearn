// src/pages/teacher/Assignments.jsx
import { useEffect, useState } from 'react';
import {
  getTeacherCourses,
  getTeacherAssignments,
  createTeacherAssignment,
  deleteTeacherAssignment,
  updateTeacherAssignment, // Make sure to add this in api.js
} from '../../services/api';

import { FaTrash, FaEdit } from 'react-icons/fa';

const TeacherAssignments = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    course_id: '',
    title: '',
    description: '',
    due_date: '',
  });

  // Editing states must be inside the component
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    due_date: '',
    course_id: '',
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseData = await getTeacherCourses();
        setCourses(courseData);

        const assignmentData = await getTeacherAssignments();
        setAssignments(assignmentData);
      } catch (err) {
        console.error(err);
        alert('Failed to load assignments or courses.');
      }
    };
    fetchData();
  }, []);

  // Create new assignment
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const assignment = await createTeacherAssignment(newAssignment);
      setAssignments([...assignments, assignment]);
      setNewAssignment({ course_id: '', title: '', description: '', due_date: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to create assignment.');
    }
  };

  // Start editing
  const handleEditStart = (assignment) => {
    setEditingId(assignment.id);
    setEditData({
      title: assignment.title,
      description: assignment.description,
      due_date: assignment.due_date.split('T')[0],
      course_id: assignment.course_id,
    });
  };

  // Save edited assignment
  const handleEditSave = async (id) => {
    try {
      const updated = await updateTeacherAssignment(id, editData);
      setAssignments(assignments.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update assignment.');
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Delete this assignment?')) return;
    try {
      await deleteTeacherAssignment(id);
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assignments</h1>

      {/* Create new assignment form */}
      <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Create New Assignment</h2>
        <select
          value={newAssignment.course_id}
          onChange={(e) => setNewAssignment({ ...newAssignment, course_id: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Select Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Title"
          value={newAssignment.title}
          onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <textarea
          placeholder="Description"
          value={newAssignment.description}
          onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />
        <input
          type="date"
          value={newAssignment.due_date}
          onChange={(e) => setNewAssignment({ ...newAssignment, due_date: e.target.value })}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Post Assignment
        </button>
      </form>

      {/* Assignment list */}
      <div className="space-y-4">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white p-4 rounded shadow">
            {editingId === a.id ? (
              <>
                <input
                  className="w-full p-2 border rounded mb-2"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                />
                <textarea
                  className="w-full p-2 border rounded mb-2"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  rows={3}
                />
                <input
                  type="date"
                  className="w-full p-2 border rounded mb-2"
                  value={editData.due_date}
                  onChange={(e) => setEditData({ ...editData, due_date: e.target.value })}
                />
                <button
                  onClick={() => handleEditSave(a.id)}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-gray-600">{a.description}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(a.due_date).toLocaleDateString()}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEditStart(a)}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherAssignments;
