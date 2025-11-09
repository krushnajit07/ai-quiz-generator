import { useState, useEffect } from "react";
import "./index.css";

export default function QuizDisplay({ quiz, quizMode = false, revealAnswers = false }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);

  useEffect(() => {
    if (quizMode) {
      // Take Quiz mode → fresh start
      setQuizVisible(true);
      setSubmitted(false);
      setUserAnswers({});
    } else if (revealAnswers) {
      // View Answers mode → show quiz with all correct answers revealed
      setQuizVisible(true);
      setSubmitted(true);
    } else {
      // Hidden state (no mode selected)
      setQuizVisible(false);
    }
  }, [quizMode, revealAnswers]);

  if (!quiz || !Array.isArray(quiz.questions)) {
    return <p className="quiz-loading">Loading quiz...</p>;
  }

  const cleanText = (text = "") =>
    text.trim().replace(/^[A-D]\)\s*/i, "").toLowerCase();

  const handleSelect = (qIndex, option) => {
    if (quizMode && !submitted) {
      setUserAnswers((prev) => ({ ...prev, [qIndex]: option }));
    }
  };

  const handleSubmit = () => {
    if (quizMode) setSubmitted(true);
  };

  const computeScore = () => {
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (cleanText(userAnswers[i]) === cleanText(q.answer)) score++;
    });
    return score;
  };

  const getDifficultyClass = (level) => {
    if (level === "easy") return "badge easy";
    if (level === "medium") return "badge medium";
    if (level === "hard") return "badge hard";
    return "badge unknown";
  };

  return (
    <div className="quiz-display">
      <h2 className="quiz-title">{quiz.title}</h2>
      <p className="quiz-summary">{quiz.summary}</p>
      <hr />

      {!quizVisible && (
        <div className="quiz-placeholder">
          <p> Choose a mode above to start your quiz or view answers.</p>
        </div>
      )}

      {quizVisible && (
        <>
          {quiz.questions.map((q, idx) => {
            const correctAnswer = q.answer;
            const userAnswer = userAnswers[idx];
            const isCorrect = cleanText(userAnswer) === cleanText(correctAnswer);

            return (
              <div
                key={idx}
                className={`quiz-card ${
                  submitted
                    ? isCorrect
                      ? "correct-card"
                      : "wrong-card"
                    : ""
                }`}
              >
                <div className="question-header">
                  <strong>
                    {idx + 1}. {q.question}
                  </strong>
                  {q.difficulty && (
                    <span className={getDifficultyClass(q.difficulty)}>
                      {q.difficulty}
                    </span>
                  )}
                </div>

                <ul className="option-list">
                  {q.options.map((opt, i) => {
                    const isSelected = userAnswer === opt;
                    const isRight = cleanText(opt) === cleanText(correctAnswer);

                    let className = "option";
                    if (submitted || revealAnswers) {
                      if (isRight) className += " correct";
                      else if (isSelected && !isRight) className += " wrong";
                    } else if (isSelected) {
                      className += " selected";
                    }

                    return (
                      <li
                        key={i}
                        onClick={() => handleSelect(idx, opt)}
                        className={className}
                      >
                        {opt}
                        {quizMode && submitted && isSelected && isCorrect && (
                          <span> ✅</span>
                        )}
                        {quizMode && submitted && isSelected && !isCorrect && (
                          <span> ❌</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {(submitted || revealAnswers) && (
                  <p className="correct-answer">
                    ✅ Correct Answer: {correctAnswer}
                  </p>
                )}
              </div>
            );
          })}

          {quizMode && !submitted && (
            <div className="submit-container">
              <button onClick={handleSubmit} className="submit-btn">
                Submit Quiz
              </button>
            </div>
          )}

          {quizMode && submitted && (
            <div className="score-container">
              <h3>
                🎯 You scored {computeScore()} / {quiz.questions.length}
              </h3>
            </div>
          )}

          {revealAnswers && (
            <div className="score-container view-mode">
              <p>✅ Viewing All Correct Answers</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
