import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";
import { FaUpload, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

export default function AssignmentSubmission() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    // Optional: Fetch assignment details
    // fetchAssignmentDetails();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      await api.post(`/student/assignments/submit/${assignmentId}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/student/assignments");
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to submit assignment");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Success!</h1>
          <p className="text-gray-600">
            Your assignment has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/student/assignments")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
        >
          <FaArrowLeft /> Back to Assignments
        </button>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📤 Submit Assignment
          </h1>
          <p className="text-gray-600 mb-6">Assignment ID: {assignmentId}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <FaUpload className="text-4xl text-blue-600 mb-2" />
                <p className="text-lg font-semibold text-gray-800">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.zip"
                />
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-colors ${
                loading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Uploading..." : "Submit Assignment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
