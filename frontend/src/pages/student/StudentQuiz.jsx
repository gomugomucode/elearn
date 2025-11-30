import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/student/quiz/quizzes")
      .then((res) => setQuizzes(res.data.quizzes))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Available Quizzes
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="p-5 border rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            <h2 className="text-xl font-semibold text-gray-800">{q.title}</h2>
            <p className="text-sm text-gray-500 mb-2">Course: {q.courseName}</p>
            <p className="text-gray-600 mb-4">Total Questions: {q.totalQuestions}</p>

            <Link
              to={`/student/quiz/${q.id}`}
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Start Quiz
            </Link>
          </div>
        ))}
      </div>

      {quizzes.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No quizzes available right now.</p>
      )}
    </div>
  );
}
