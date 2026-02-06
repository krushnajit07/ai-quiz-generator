import { useEffect, useState } from "react";
import "./index.css";

export default function QuizDisplay({
  quiz,
  quizMode = false,
  revealAnswers = false,
}) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);

  // 🔁 Handle mode switching safely
  useEffect(() => {
    if (quizMode) {
      setQuizVisible(true);
      setSubmitted(false);
      setUserAnswers({});
      return;
    }

    if (revealAnswers) {
      setQuizVisible(true);
      setSubmitted(false);   // view mode is NOT submitted
      setUserAnswers({});    // clear previous answers
      return;
    }

    setQuizVisible(false);
  }, [quizMode, revealAnswers]);

  if (!quiz || !Array.isArray(quiz.questions)) {
    return <p className="quiz-loading">Loading quiz...</p>;
  }

  const cleanText = (text = "") =>
    text.trim().replace(/^[A-D]\)\s*/i, "").toLowerCase();

  const selectOption = (questionIndex, option) => {
    if (!quizMode || submitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const submitQuiz = () => {
    if (quizMode) setSubmitted(true);
  };

  const getScore = () =>
    quiz.questions.reduce((score, question, index) => {
      return cleanText(userAnswers[index]) === cleanText(question.answer)
        ? score + 1
        : score;
    }, 0);

  const difficultyClass = (level) => {
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
      <br />

      {!quizVisible && (
        <div className="quiz-placeholder">
          <p>Choose a mode above to start your quiz or view answers.</p>
        </div>
      )}

      {quizVisible && (
        <>
          {quiz.questions.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.answer;

            const isCorrect =
              cleanText(userAnswer) === cleanText(correctAnswer);

            return (
              <div
                key={index}
                className={`quiz-card ${
                  quizMode && submitted
                    ? isCorrect
                      ? "correct-card"
                      : "wrong-card"
                    : ""
                }`}
              >
                <div className="question-header">
                  <strong>
                    {index + 1}. {question.question}
                  </strong>

                  {question.difficulty && (
                    <span className={difficultyClass(question.difficulty)}>
                      {question.difficulty}
                    </span>
                  )}
                </div>

                <ul className="option-list">
                  {question.options.map((option, optionIndex) => {
                    const selected = userAnswer === option;
                    const correct =
                      cleanText(option) === cleanText(correctAnswer);

                    let optionClass = "option";

                    // 🧠 Quiz mode styling
                    if (quizMode && submitted) {
                      if (correct) optionClass += " correct";
                      else if (selected) optionClass += " wrong";
                    }

                    // 👀 View answers mode styling
                    if (revealAnswers && correct) {
                      optionClass += " correct";
                    }

                    // ✨ Selection before submit
                    if (quizMode && !submitted && selected) {
                      optionClass += " selected";
                    }

                    return (
                      <li
                        key={optionIndex}
                        className={optionClass}
                        onClick={() => selectOption(index, option)}
                      >
                        {option}

                        {quizMode && submitted && selected && correct && (
                          <span> ✅</span>
                        )}

                        {quizMode && submitted && selected && !correct && (
                          <span> ❌</span>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {(quizMode && submitted || revealAnswers) &&
                  question.explanation && (
                    <p className="explanation">
                      📝 <strong>Explanation:</strong>{" "}
                      {question.explanation}
                    </p>
                  )}
              </div>
            );
          })}

          {quizMode && !submitted && (
            <div className="submit-container">
              <button className="submit-btn" onClick={submitQuiz}>
                Submit Quiz
              </button>
            </div>
          )}

          {quizMode && submitted && (
            <div className="score-container">
              <h3>
                🎯 You scored {getScore()} / {quiz.questions.length}
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
