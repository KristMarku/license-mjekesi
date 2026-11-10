import { useState } from "react";

import Navigation from "../components/Navigation";
import InfoPanel from "../components/InfoPanel";
import Quiz from "../components/Quiz";
import generateQuiz from "../utils/generateQuiz";
import data from "../data/structure.json";

import "../styles/Home.css";

function Home() {
  const [currentNode, setCurrentNode] = useState(data);
  const [history, setHistory] = useState([]);
  const [direction, setDirection] = useState("forward");
  const [quiz, setQuiz] = useState(null);
  const [quizMessage, setQuizMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleClick(item) {
    if (isLoading) return;
    setDirection("forward");
    setQuizMessage("");
    setHistory([...history, currentNode]);
    setCurrentNode(item);
  }

  function goBack() {
    if (isLoading) return;
    if (history.length === 0) return;

    setDirection("back");
    setQuizMessage("");

    const previous = history[history.length - 1];

    setCurrentNode(previous);
    setHistory(history.slice(0, -1));
  }

  async function startQuiz(shuffleLesson = false) {
    if (isLoading) return;
    setIsLoading(true);
    setQuizMessage('Duke ngarkuar pyetjet…');
    try {
      const generatedQuiz = await generateQuiz(currentNode, data, shuffleLesson);
      if (generatedQuiz === null) {
        setQuizMessage('Kjo temë nuk ka ende pyetje.');
        return;
      }
      setQuizMessage('');
      setQuiz(generatedQuiz);
    } catch (error) {
      console.error(error);
      setQuizMessage('Pyetjet nuk u ngarkuan. Provo përsëri.');
    } finally {
      setIsLoading(false);
    }
  }

  function exitQuiz() {
    setQuiz(null);
    setQuizMessage("");

    if (window.matchMedia("(max-width: 768px)").matches) {
      setCurrentNode(data);
      setHistory([]);
      setDirection("back");
    }
  }

  return (
    <div
      className={`home ${currentNode.type === "root" ? "atRoot" : ""} ${
        quiz !== null ? "isQuizActive" : ""
      }`}
    >
      <Navigation
        currentNode={currentNode}
        history={history}
        handleClick={handleClick}
        goBack={goBack}
        direction={direction}
      />

      {quiz === null ? (
        <InfoPanel
          currentNode={currentNode}
          onStartQuiz={startQuiz}
          quizMessage={quizMessage}
          isLoading={isLoading}
        />
      ) : (
        <Quiz quiz={quiz} exitQuiz={exitQuiz} />
      )}
    </div>
  );
}

export default Home;
