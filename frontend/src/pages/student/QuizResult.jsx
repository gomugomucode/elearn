import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, Link } from "react-router-dom";

export default function QuizResult() {
  const { quizId } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/student/quiz/result/${quizId}`)
      .then(res => setResult(res.data.result))
      .catch(() => alert("Result not found"));
  }, [quizId]);

  if (!result) return <p className="p-6 text-center">Loading result...</p>;

const percentage = result.score.toFixed(2); // just use backend percentage


  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">{result.title}</h1>

    <p className="text-lg">
  Score: <b>{result.correct}</b> / {result.total}
</p>

<p className="text-lg mt-2">
  Percentage: <b>{percentage}%</b>
</p>


      <Link
        to="/student/quizzes"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Back to Quizzes
      </Link>
    </div>
  );
}
