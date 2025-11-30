import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTeacherCourses, updateTeacherCourse } from '../../services/api';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState({ title: '', description: '', thumbnail: null, course_image: null });
  const [loading, setLoading] = useState(false);
  const [previewThumb, setPreviewThumb] = useState(null);
  const [previewCourseImage, setPreviewCourseImage] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const courses = await getTeacherCourses();
      const found = courses.find(c => c.id === parseInt(id));
      if (found) {
        setCourse(found);
        setPreviewThumb(found.thumbnail ? `http://localhost:5000/uploads/${found.thumbnail}` : null);
        setPreviewCourseImage(found.course_image ? `http://localhost:5000/uploads/${found.course_image}` : null);
      }
    };
    fetchCourse();
  }, [id]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length === 0) return;

    const file = files[0];
    setCourse(prev => ({ ...prev, [name]: file }));

    // Show preview
    const url = URL.createObjectURL(file);
    if (name === 'thumbnail') setPreviewThumb(url);
    if (name === 'course_image') setPreviewCourseImage(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', course.title);
      formData.append('description', course.description);
      if (course.thumbnail instanceof File) formData.append('thumbnail', course.thumbnail);
      if (course.course_image instanceof File) formData.append('course_image', course.course_image);


      await updateTeacherCourse(id, formData); // backend should accept multipart/form-data
      navigate('/teacher/courses'); // go back
    } catch (err) {
      alert('Failed to update');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-4">
        <input
          type="text"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Course Title"
        />

        <textarea
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          className="w-full p-2 border rounded"
          placeholder="Description"
          rows={4}
        />

        {/* Thumbnail */}
        <div>
          <label className="block mb-1 font-medium">Thumbnail</label>
          {previewThumb && <img src={previewThumb} alt="Thumbnail Preview" className="w-full h-32 object-cover rounded mb-2" />}
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        {/* Course Image */}
        <div>
          <label className="block mb-1 font-medium">Course Image</label>
          {previewCourseImage && <img src={previewCourseImage} alt="Course Preview" className="w-full h-32 object-cover rounded mb-2" />}
          <input
            type="file"
            name="course_image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
