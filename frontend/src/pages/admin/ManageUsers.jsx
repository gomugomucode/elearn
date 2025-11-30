import { useState, useEffect } from 'react';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../../services/api';

const ManageUsers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Utility to ensure an array is returned
  const safeArray = (data, key) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data[key] && Array.isArray(data[key])) return data[key];
    return [];
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      const users = safeArray(data, 'users');
      const teacherList = users.filter(u => u.role === 'teacher');
      const studentList = users.filter(u => u.role === 'student');
      setTeachers(teacherList);
      setStudents(studentList);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
      setTeachers([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const role = form.role.value;
    const password = form.password.value;

    // Check duplicate emails
    const existingUser = teachers.find(u => u.email === email) || students.find(u => u.email === email);
    if (existingUser) {
      alert("This email is already registered.");
      return;
    }

    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await createAdminUser({ name, email, password, role });
      alert("User created successfully!");
      setShowAddModal(false);
      fetchUsers(); // Refresh
    } catch (error) {
      if (error.response?.data?.error === 'Email already exists') {
        alert("This email is already registered.");
      } else {
        alert("Failed to create user: " + error.message);
      }
    }
  };

  const handleEditUser = async (user) => {
    setEditUser(user);
    alert(`Edit user: ${user.name}`);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteAdminUser(userId);
      alert("User deleted!");
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  if (loading) {
    return <div className="ml-64 p-6 pt-24 min-h-screen bg-gray-50 flex items-center justify-center">Loading users...</div>;
  }

  return (
    <div className="ml-64 p-6 pt-24 min-h-screen bg-gray-50">
      {/* Add User Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <span>Add User</span>
        </button>
      </div>

      {/* Teachers Table */}
      <UserTable
        title="Teachers"
        users={teachers}
        handleEdit={handleEditUser}
        handleDelete={handleDeleteUser}
        extraColumns={['Courses', 'Status']}
        mapExtra={(user) => [user.courses || 0, 'Active']}
      />

      {/* Students Table */}
      <UserTable
        title="Students"
        users={students}
        handleEdit={handleEditUser}
        handleDelete={handleDeleteUser}
        extraColumns={['Enrolled', 'Last Login']}
        mapExtra={(user) => [user.enrolled || 0, user.lastLogin || 'Never']}
      />

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
        />
      )}
    </div>
  );
};

export default ManageUsers;

// ================= Helper Components =================
const UserTable = ({ title, users, handleEdit, handleDelete, extraColumns, mapExtra }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-8">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            {extraColumns.map(col => (
              <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={2 + extraColumns.length + 1} className="px-6 py-4 text-center text-gray-500">No users found.</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                {mapExtra(user).map((val, idx) => (
                  <td key={idx} className="px-6 py-4 whitespace-nowrap">{val}</td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const AddUserModal = ({ onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Add New User</h3>
      <form onSubmit={onSubmit}>
        {['name', 'email', 'password'].map(field => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 text-sm font-bold mb-2">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              name={field}
              type={field === 'password' ? 'password' : 'text'}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
              required
              minLength={field === 'password' ? 6 : undefined}
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <select name="role" className="shadow border rounded w-full py-2 px-3 text-gray-700" required>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Add User</button>
        </div>
      </form>
    </div>
  </div>
);
