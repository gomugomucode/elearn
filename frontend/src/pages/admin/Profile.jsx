import { useEffect, useState } from "react";
import { getAdminProfile, updateAdminProfile } from "../../services/api";

const AdminProfile = () => {
  const adminId =
    localStorage.getItem("userId") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.id ||
    101;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // load profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getAdminProfile(adminId);
      const p = data?.user || data;

      setProfile(p);
      setForm({ name: p.name, email: p.email });
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // save update
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateAdminProfile(adminId, form);

      await fetchProfile(); // reload updated data
      setEditing(false);
      alert("Profile updated!");
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed";
      alert(msg);
    }
  };

  if (loading) return <div className="ml-64 p-6 pt-24">Loading...</div>;
  if (!profile) return <div className="ml-64 p-6 pt-24">Profile not found</div>;

  return (
    <div className="ml-64 p-6 pt-24">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {editing ? (
        <form
          onSubmit={handleSave}
          className="bg-white p-4 rounded shadow max-w-md space-y-4"
        >
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white p-4 rounded shadow max-w-md space-y-3">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>

          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
