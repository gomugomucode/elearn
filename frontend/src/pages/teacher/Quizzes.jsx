import { useEffect, useState } from "react";
import {
  getTeacherCourses,
  getTeacherQuizzes,
  createTeacherQuiz,
  getQuizById,
  updateTeacherQuiz,
  deleteTeacherQuiz,
} from "../../services/api";

const TeacherQuizzes = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [quizForm, setQuizForm] = useState({
    course_id: "",
    title: "",
    time_limit: 10,
    questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }],
  });

  // Load courses & quizzes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setCourses(await getTeacherCourses());
        setQuizzes(await getTeacherQuizzes());
      } catch (err) {
        console.error(err);
        alert("Failed to load data: " + err.message);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setQuizForm({
      course_id: "",
      title: "",
      time_limit: 10,
      questions: [{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }],
    });
    setCurrentQuizId(null);
  };

  const addQuestion = () =>
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        { question_text: "", options: ["", "", "", ""], correct_answer: 0 },
      ],
    });

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex][field] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...quizForm.questions];
    updated[qIndex].options[oIndex] = value;
    setQuizForm({ ...quizForm, questions: updated });
  };

  // CREATE or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentQuizId) {
        await updateTeacherQuiz(currentQuizId, quizForm);
        alert("Quiz updated successfully!");
      } else {
        await createTeacherQuiz(quizForm);
        alert("Quiz created successfully!");
      }
      resetForm();
      setQuizzes(await getTeacherQuizzes());
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz: " + err.message);
    }
  };

  // EDIT
  const handleEdit = async (quiz) => {
    try {
      const fullQuiz = await getQuizById(quiz.id);
      const existingQuestions = fullQuiz.questions?.map(q => ({
        question_text: q.question_text || "",
        options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
        correct_answer: q.correct_answer ?? 0,
      })) || [{ question_text: "", options: ["", "", "", ""], correct_answer: 0 }];

      setQuizForm({
        course_id: fullQuiz.course_id || "",
        title: fullQuiz.title || "",
        time_limit: fullQuiz.time_limit || 10,
        questions: existingQuestions,
      });

      setCurrentQuizId(quiz.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to load quiz for editing: " + err.message);
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this quiz?")) return;
    try {
      await deleteTeacherQuiz(id);
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz: " + err.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Teacher Quizzes</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow-md">
        <h2 className="font-semibold text-xl mb-4">
          {currentQuizId ? "Edit Quiz" : "Create New Quiz"}
        </h2>

        {/* Course & Title & Time Limit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <select
            value={quizForm.course_id}
            onChange={(e) => setQuizForm({ ...quizForm, course_id: parseInt(e.target.value) })}
            className="p-2 border rounded col-span-1"
            required
          >
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>

          <input
            type="text"
            placeholder="Quiz Title"
            value={quizForm.title}
            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
            className="p-2 border rounded col-span-2"
            required
          />

          <input
            type="number"
            placeholder="Time Limit"
            value={quizForm.time_limit}
            onChange={(e) => setQuizForm({ ...quizForm, time_limit: parseInt(e.target.value) || 10 })}
            className="p-2 border rounded col-span-1"
            min={1}
            max={120}
            required
          />
        </div>

        {/* Questions */}
        {quizForm.questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
            <input
              type="text"
              placeholder="Question"
              value={q.question_text}
              onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)}
              className="w-full p-2 border rounded mb-2"
              required
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex items-center mb-1 gap-2">
                <input
                  type="radio"
                  name={`correct_${qIndex}`}
                  checked={q.correct_answer === oIndex}
                  onChange={() => updateQuestion(qIndex, "correct_answer", oIndex)}
                  className="mr-2"
                />
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  className="flex-1 p-1 border rounded"
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex gap-2">
          <button type="button" onClick={addQuestion} className="px-3 py-1 bg-green-100 text-green-800 rounded">Add Question</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{currentQuizId ? "Update Quiz" : "Create Quiz"}</button>
          {currentQuizId && <button type="button" onClick={resetForm} className="px-3 py-1 bg-gray-200 rounded">Cancel Edit</button>}
        </div>
      </form>

      {/* Quiz list */}
      <div className="grid gap-4">
        {quizzes.map(q => (
          <div key={q.id} className="bg-white p-4 rounded shadow-md flex justify-between items-center">
            <div>
              <h3 className="font-bold">{q.title}</h3>
              <p className="text-gray-600 text-sm">Course: {q.course_title}</p>
              <p className="text-xs text-gray-500">Time Limit: {q.time_limit} mins</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(q)} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Edit</button>
              <button onClick={() => handleDelete(q.id)} className="px-2 py-1 bg-red-100 text-red-800 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherQuizzes;
