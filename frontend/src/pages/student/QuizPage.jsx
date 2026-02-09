import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function QuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState(null);

  // Start quiz
  useEffect(() => {
    api.get(`/student/quiz/${quizId}`)
      .then(res => {
        setQuiz(res.data.quiz);
        setTimeLeft((res.data.quiz.time_limit || 0) * 60);
        setAttemptId(res.data.attemptId);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load quiz");
      });
  }, [quizId]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  const handleSubmit = async (auto = false) => {
    if (submitting) return;
    if (!attemptId) {
      alert("Quiz session expired. Please restart.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/student/quiz/${quizId}/submit`, {
        attemptId,
        answers,
      });

      if (!auto) alert("Quiz submitted successfully.");
      navigate(`/student/quiz/result/${quizId}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Submission failed");
      setSubmitting(false);
    }
  };

  if (!quiz) return <p className="p-6">Loading quiz...</p>;

  const minutes = Math.floor((timeLeft || 0) / 60);
  const seconds = (timeLeft || 0) % 60;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>

      <p className="mb-4 font-semibold text-red-600">
        ⏱ Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
      </p>

      {quiz.questions.map((q, i) => (
        <div key={q.id} className="mb-4 border p-4 rounded">
          <p className="font-semibold">
            {i + 1}. {q.question_text}
          </p>

          {q.options.map((opt, idx) => (
            <label key={idx} className="block mt-1">
              <input
                type="radio"
                name={`q_${q.id}`}
                checked={answers[q.id] === idx}
                disabled={timeLeft <= 0}
                onChange={() => setAnswers(prev => ({ ...prev, [q.id]: idx }))}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={() => handleSubmit(false)}
        disabled={submitting || timeLeft <= 0}
        className="w-full bg-blue-600 text-white py-2 rounded mt-4 disabled:bg-gray-400"
      >
        Submit Quiz
      </button>
    </div>
  );
}
