// import { useOutletContext } from 'react-router-dom';
// import { useState } from 'react';

// const StudentProfile = () => {
//   const { studentData } = useOutletContext();
//   const [formData, setFormData] = useState({
//     name: studentData?.name || '',
//     email: studentData?.email || '',
//     phone: studentData?.phone || '',
//   });

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await fetch('/api/student/profile', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       alert('Profile updated successfully!');
//     } catch (error) {
//       alert('Error updating profile. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Full Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone</label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//             />
//           </div>
//           <button
//             type="submit"
//             className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StudentProfile;

export default function StudentProfile() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              defaultValue="Student User"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              defaultValue="student@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <input
              type="text"
              defaultValue="Student"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}