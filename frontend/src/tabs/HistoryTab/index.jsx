import { useEffect, useState } from "react";
import { getHistory, getQuizById } from "../../services/api";
import QuizDisplay from "../../components/QuizDisplay";
import "./index.css";


const VIEW_MODES = {
  NONE: null,
  VIEW: "view",
  QUIZ: "quiz",
};

export default function HistoryTab() {

  const [history, setHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(VIEW_MODES.NONE);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load history:", err);
      setError("Failed to load quiz history.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuiz = async (quizId) => {
    try {
      const data = await getQuizById(quizId);
      const quiz = data.quiz || data.quiz_data || data;

      if (!quiz || !Array.isArray(quiz.questions)) {
        throw new Error("Invalid quiz data");
      }

      setSelectedQuiz(quiz);
      setMode(VIEW_MODES.NONE);
    } catch (err) {
      console.error("Failed to load quiz:", err);
      alert("Unable to load quiz. Please try again.");
    }
  };

  const handleCloseQuiz = () => {
    setSelectedQuiz(null);
    setMode(VIEW_MODES.NONE);
  };

  
  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="3" className="table-loading">
            Loading quiz history...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          <td colSpan="3" className="table-error">
            ❌ {error}
          </td>
        </tr>
      );
    }

    if (history.length === 0) {
      return (
        <tr>
          <td colSpan="3" className="table-empty">
            No quizzes generated yet.
          </td>
        </tr>
      );
    }

    return history.map((item) => (
      <tr key={item.id}>
        <td>{item.title}</td>
        <td className="table-url">{item.url}</td>
        <td>
          <button
            className="view-button"
            onClick={() => handleViewQuiz(item.id)}
          >
            View
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Quiz History</h2>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>

      {selectedQuiz && (
        <div className="history-actions">
          {mode === VIEW_MODES.NONE ? (
            <div className="history-mode-buttons">
              <button
                className="mode-button"
                onClick={() => setMode(VIEW_MODES.VIEW)}
              >
                View Answers
              </button>
              <button
                className="mode-button"
                onClick={() => setMode(VIEW_MODES.QUIZ)}
              >
                Take Quiz
              </button>
              <button
                className="mode-button cancel"
                onClick={handleCloseQuiz}
              >
                Close
              </button>
            </div>
          ) : (
            <div className="selected-mode-row">
              <span className="selected-mode-label">
                {mode === VIEW_MODES.VIEW
                  ? "Viewing Answers"
                  : "Taking Quiz"}
              </span>
              <button
                className="change-mode"
                onClick={() => setMode(VIEW_MODES.NONE)}
              >
                Change
              </button>
            </div>
          )}

          <QuizDisplay
            quiz={selectedQuiz}
            quizMode={mode === VIEW_MODES.QUIZ}
            revealAnswers={mode === VIEW_MODES.VIEW}
          />
        </div>
      )}
    </div>
  );
}
