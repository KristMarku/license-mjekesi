import "../styles/Quiz.css";
import { useState } from "react";

function Quiz({ quiz, exitQuiz }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const question = quiz.questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];
  const isAnswered = selectedAnswer !== undefined;

  function selectAnswer(answerIndex) {
    if (isAnswered) return;

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion]: answerIndex,
    }));
  }

  function getAnswerClass(index) {
    if (!isAnswered) return "answerButton";

    if (index === question.correct) return "correct";
    if (index === selectedAnswer) return "incorrect";

    return "answerButton";
  }

  function calculateScore() {
    return quiz.questions.reduce((total, currentQuestion, index) => {
      return total + (answers[index] === currentQuestion.correct ? 1 : 0);
    }, 0);
  }

  function finishQuiz() {
    setIsFinished(true);
  }

  function confirmExitQuiz() {
    exitQuiz();
  }

  function renderExitConfirmation() {
    if (!showExitConfirmation) return null;

    return (
      <div className="modalOverlay" role="presentation">
        <div
          className="exitModal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exitQuizTitle"
        >
          <h2 id="exitQuizTitle">Quit quiz?</h2>
          <p>Your current progress will be lost.</p>

          <div className="modalActions">
            <button onClick={() => setShowExitConfirmation(false)}>
              Cancel
            </button>
            <button className="quitButton" onClick={confirmExitQuiz}>
              Yes, quit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = calculateScore();

    return (
      <div className="infoPanel">
        <h1>Quiz Finished</h1>
        <h2>
          Your score: {score} / {quiz.questions.length}
        </h2>

        <button
          className="exitQuizButton"
          onClick={() => setShowExitConfirmation(true)}
        >
          Exit Quiz
        </button>

        {renderExitConfirmation()}
      </div>
    );
  }

  return (
    <div className="infoPanel">
      <h1 className="quizTitle">{quiz.title}</h1>

      <p>
        Question {currentQuestion + 1} of {quiz.questions.length}
      </p>

      <h2>{question.question}</h2>

      {question.image && (
        <img
          className="questionImage"
          src={question.image}
          alt={question.imageAlt || "Question illustration"}
        />
      )}

      {question.answers.map((answer, index) => (
        <button
          key={index}
          className={getAnswerClass(index)}
          onClick={() => selectAnswer(index)}
          disabled={isAnswered}
        >
          {answer}
        </button>
      ))}

      {isAnswered && (
        <p className="explanation">
          <strong>Explanation:</strong> {question.explanation}
        </p>
      )}

      <div className="quizNavigation">
        <button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button onClick={finishQuiz}>Finish Quiz</button>
        ) : (
          <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
            Next
          </button>
        )}
      </div>

      <button
        className="exitQuizButton"
        onClick={() => setShowExitConfirmation(true)}
      >
        Exit Quiz
      </button>

      {renderExitConfirmation()}
    </div>
  );
}

export default Quiz;
