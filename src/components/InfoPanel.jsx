import "../styles/InfoPanel.css";

function InfoPanel({ currentNode, onStartQuiz, quizMessage, isLoading }) {
  return (
    <div className="infoPanel">
      <h1 className={currentNode.type === "lesson" ? "topicTitle" : currentNode.type === "folder" ? "subjectTitle" : ""}>
        {currentNode.title}
      </h1>

      <p>{currentNode.description}</p>

      {quizMessage && <p className="quizMessage">{quizMessage}</p>}

      {currentNode.type === "lesson" && (
        <>
          <h3>Questions</h3>
          <p>{currentNode.questions}</p>
        </>
      )}

      {currentNode.type === "lesson" && (
        <div className="testOptions">
          <button className="startButton" disabled={isLoading} onClick={() => onStartQuiz(false)}>
            ▶ Start Test
          </button>
          <button className="shuffleButton" disabled={isLoading} onClick={() => onStartQuiz(true)}>
            Shuffle Questions
          </button>
        </div>
      )}

      {currentNode.type === "exam" && (
        <button className="examButton" disabled={isLoading} onClick={() => onStartQuiz()}>
          ▶ Start Exam
        </button>
      )}
    </div>
  );
}

export default InfoPanel;
