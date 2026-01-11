import { useState, useEffect } from "react";
import { generateQuiz, previewURL } from "../../services/api";
import QuizDisplay from "../../components/QuizDisplay";
import "./index.css";

export default function GenerateQuizTab() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewError, setPreviewError] = useState("");
  const [checkingPreview, setCheckingPreview] = useState(false);
  const [modeSelected, setModeSelected] = useState(null);
  const [validationTimer, setValidationTimer] = useState(null);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setError("");
    // clear any existing preview immediately
    setPreview(null);
    setPreviewError("");
    setCheckingPreview(false);

    // cancel any ongoing validation timeout
    if (validationTimer) clearTimeout(validationTimer);

    // schedule new validation after user stops typing
    if (value.trim()) {
      const timer = setTimeout(() => validateUrl(value), 700);
      setValidationTimer(timer);
    }
  };

  const validateUrl = async (value) => {
    setCheckingPreview(true);
    try {
      const data = await previewURL(value);
      setPreview(data);
      setPreviewError("");
    } catch {
      setPreview(null);
      setPreviewError("Invalid or unreachable URL");
    } finally {
      setCheckingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError("");
    setQuiz(null);
    setModeSelected(null);
    try {
      const data = await generateQuiz(url);
      const quizData = data.quiz || data.quiz_data || data;
      if (quizData && Array.isArray(quizData.questions)) {
        setQuiz(quizData);
      } else {
        setError("Invalid quiz data format.");
      }
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError("Failed to generate quiz. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const chooseMode = (mode) => {
    setModeSelected(mode);
  };

  const resetMode = () => {
    setModeSelected(null);
  };

  return (
    <div className="generate-container">
      <h2 className="generate-title">Generate Quiz</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter article URL..."
          value={url}
          onChange={handleUrlChange}
          className="url-input"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-button"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>

      {checkingPreview && <p className="info-text">Validating URL...</p>}
      {preview && !checkingPreview && (
        <div className="preview-container">
          <h4>{preview.title}</h4>
          <p className="preview-url">{url}</p>
        </div>
      )}
      {previewError && <p className="error-text">{previewError}</p>}
      {error && <p className="error-text">{error}</p>}

      {quiz && (
        <div className="quiz-section">
          {!modeSelected && (
            <div className="quiz-mode-buttons">
              <button onClick={() => chooseMode("view")} className="mode-button">
                View Answers
              </button>
              <button onClick={() => chooseMode("quiz")} className="mode-button">
                Take Quiz
              </button>
            </div>
          )}

          {modeSelected && (
            <div className="selected-mode-row">
              <span className="selected-mode-label">
                {modeSelected === "view" ? "Viewing Answers" : "Taking Quiz"}
              </span>
              <button className="change-mode" onClick={resetMode}>
                Change Mode
              </button>
            </div>
          )}

          <QuizDisplay
            quiz={quiz}
            quizMode={modeSelected === "quiz"}
            revealAnswers={modeSelected === "view"}
          />
        </div>
      )}
    </div>
  );
}
