// src/pages/teacher/Profile.jsx
import { useEffect, useState } from 'react';
import { getTeacherProfile, updateTeacherProfile } from '../../services/api';

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getTeacherProfile();
        setProfile(data);
        setForm({ name: data.name, email: data.email, password: '' });
      } catch (err) {
        console.error(err);
        alert('Failed to load profile. Please log in again.');
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateTeacherProfile(form);
      setProfile(updated);
      setEditing(false);
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  if (!profile) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white p-4 rounded shadow max-w-md space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block mb-1">New Password (optional)</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-4 rounded shadow max-w-md space-y-3">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
          <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default TeacherProfile;
  