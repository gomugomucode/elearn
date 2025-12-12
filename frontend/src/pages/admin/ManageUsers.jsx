import { useState, useEffect } from 'react';
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  bulkUploadUsers
} from '../../services/api';

const ManageUsers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bulk upload states
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState(null);

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
      setTeachers(users.filter(u => u.role === 'teacher'));
      setStudents(users.filter(u => u.role === 'student'));
    } catch (error) {
      console.error("Failed to fetch:", error);
      setTeachers([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- Download sample CSV ----------------
  const downloadSampleCSV = () => {
    const csvContent = `name,email,password,role
John Doe,john@example.com,pass123,student
Jane Smith,jane@example.com,pass123,teacher`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_users.csv";
    a.click();
  };

  // ---------------- Bulk Upload Handler ----------------
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(10);

    try {
      const result = await bulkUploadUsers(file, setUploadProgress);

      if (result.errors && result.errors.length > 0) {
        setUploadErrors(result.errors);
      } else {
        alert("Bulk upload successful!");
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Upload failed!");
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  // ---------------- Add User ----------------
  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      await createAdminUser({
        name: form.name.value,
        email: form.email.value,
        password: form.password.value,
        role: form.role.value
      });

      alert("User created!");
      setShowAddModal(false);
      fetchUsers();
    } catch {
      alert("Error creating user");
    }
  };

  // ---------------- Edit User ----------------
  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      await updateAdminUser(editUser.id, {
        name: form.name.value,
        email: form.email.value,
        password: form.password.value || undefined,
        role: form.role.value,
      });

      alert("User updated!");
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // ---------------- Delete User ----------------
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await deleteAdminUser(id);
      alert("User deleted!");
      fetchUsers();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="ml-64 p-6 pt-24">Loading users...</div>;

  return (
    <div className="ml-64 p-6 pt-24">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Users</h2>

        <div className="space-x-3">
          <button
            onClick={downloadSampleCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Download Sample CSV
          </button>

          <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer">
            Bulk Upload
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={handleBulkUpload}
            />
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Error Modal */}
      {uploadErrors && (
        <ErrorReportModal
          errors={uploadErrors}
          onClose={() => setUploadErrors(null)}
        />
      )}

      {/* Users Tables */}
      <UserTable
        title="Teachers"
        users={teachers}
        handleEdit={handleEditUser}
        handleDelete={handleDeleteUser}
        extraColumns={['Courses', 'Status']}
        mapExtra={(user) => [user.courses || 0, 'Active']}
      />

      <UserTable
        title="Students"
        users={students}
        handleEdit={handleEditUser}
        handleDelete={handleDeleteUser}
        extraColumns={['Enrolled', 'Last Login']}
        mapExtra={(user) => [user.enrolled || 0, user.lastLogin || 'Never']}
      />

      {showAddModal && (
        <AddUserModal onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
};

export default ManageUsers;

// ---------------- TABLE ----------------
const UserTable = ({ title, users, handleEdit, handleDelete, extraColumns = [], mapExtra = () => [] }) => (
  <div className="bg-white p-6 rounded-lg shadow mb-8">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>

    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3">Name</th>
          <th className="px-6 py-3">Email</th>
          <th className="px-6 py-3">Role</th>
          {extraColumns.map(col => <th key={col} className="px-6 py-3">{col}</th>)}
          <th className="px-6 py-3">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {users.length === 0 ? (
          <tr>
            <td colSpan={4 + extraColumns.length} className="text-center py-4 text-gray-500">
              No users found.
            </td>
          </tr>
        ) : (
          users.map((u) => (
            <tr key={u.id}>
              <td className="px-6 py-4">{u.name}</td>
              <td className="px-6 py-4">{u.email}</td>
              <td className="px-6 py-4">{u.role}</td>
              {mapExtra(u).map((val, idx) => <td key={idx} className="px-6 py-4">{val}</td>)}
              <td className="px-6 py-4 space-x-2">
                <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-900">Edit</button>
                <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// ---------------- ADD USER MODAL ----------------
const AddUserModal = ({ onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Add User</h3>

      <form onSubmit={onSubmit}>
        <input className="border w-full p-2 mb-3" name="name" placeholder="Name" required />
        <input className="border w-full p-2 mb-3" name="email" placeholder="Email" required />
        <input className="border w-full p-2 mb-3" name="password" type="password" placeholder="Password" required />
        <select className="border w-full p-2 mb-3" name="role" required>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
        </div>
      </form>
    </div>
  </div>
);

// ---------------- EDIT USER MODAL ----------------
const EditUserModal = ({ user, onClose, onSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">Edit User</h3>

      <form onSubmit={onSubmit}>
        <input className="border w-full p-2 mb-3" name="name" defaultValue={user.name} placeholder="Name" required />
        <input className="border w-full p-2 mb-3" name="email" defaultValue={user.email} placeholder="Email" required />
        <input className="border w-full p-2 mb-3" name="password" type="password" placeholder="New Password (leave blank to keep)" />
        <select className="border w-full p-2 mb-3" name="role" defaultValue={user.role} required>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <div className="flex justify-end space-x-3">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Update</button>
        </div>
      </form>
    </div>
  </div>
);

// ---------------- ERROR REPORT MODAL ----------------
const ErrorReportModal = ({ errors, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg w-full max-w-xl">
      <h3 className="text-lg font-bold mb-4">Upload Errors</h3>

      <div className="max-h-72 overflow-y-auto border p-3">
        {errors.map((err, idx) => (
          <div key={idx} className="text-red-600 mb-2">
            Row {err.row}: {err.message}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="bg-blue-600 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  </div>
);
