import { useEffect, useState } from "react";
import { getHistory, getQuizById } from "../../services/api";
import QuizDisplay from "../../components/QuizDisplay";
import "./index.css";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [modeSelected, setModeSelected] = useState(null); // 'view' | 'quiz' | null

  useEffect(() => {
    getHistory().then((d) => setHistory(Array.isArray(d) ? d : []));
  }, []);

  const handleView = async (id) => {
    const data = await getQuizById(id);
    const quizData = data.quiz || data.quiz_data || data;
    if (quizData && Array.isArray(quizData.questions)) {
      setSelectedQuiz(quizData);
      setModeSelected(null);
    } else {
      console.error("Invalid quiz data:", data);
    }
  };

  const chooseMode = (mode) => {
    setModeSelected(mode);
  };

  const clearSelection = () => {
    setSelectedQuiz(null);
    setModeSelected(null);
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
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td className="table-url">{item.url}</td>
                <td>
                  <button className="view-button" onClick={() => handleView(item.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedQuiz && (
        <div className="history-actions">
          {!modeSelected ? (
            <div className="history-mode-buttons">
              <button className="mode-button" onClick={() => chooseMode("view")}>
                View Answers
              </button>
              <button className="mode-button" onClick={() => chooseMode("quiz")}>
                Take Quiz
              </button>
              <button className="mode-button cancel" onClick={clearSelection}>
                Close
              </button>
            </div>
          ) : (
            <div className="selected-mode-row">
              <span className="selected-mode-label">
                {modeSelected === "view" ? "Viewing Answers" : "Taking Quiz"}
              </span>
              <button className="change-mode" onClick={() => setModeSelected(null)}>
                Change
              </button>
            </div>
          )}

          <QuizDisplay
            quiz={selectedQuiz}
            quizMode={modeSelected === "quiz"}
            revealAnswers={modeSelected === "view"}
          />
        </div>
      )}
    </div>
  );
}
