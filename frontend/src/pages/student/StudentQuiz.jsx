


import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function StudentQuiz() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    api.get("/student/quizzes").then((res) => setQuizzes(res.data.quizzes));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Available Quizzes</h1>

      {quizzes.map((q) => (
        <div key={q.id} className="p-4 border rounded shadow mt-3">
          <h2 className="font-semibold">{q.title}</h2>
          <p>Total Questions: {q.totalQuestions}</p>

          <Link
            to={`/student/quiz/${q.id}`}
            className="mt-3 inline-block bg-purple-600 text-white px-4 py-2 rounded"
          >
            Start Quiz
          </Link>
        </div>
      ))}
    </div>
  );
}
