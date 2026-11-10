const questionFiles = import.meta.glob("../questions/**/*.json", {
  import: "default",
});

function getQuestionFiles(node) {
  const ownFile = node.questionFile ? [node.questionFile] : [];
  const childFiles = (node.children ?? []).flatMap(getQuestionFiles);

  return [...ownFile, ...childFiles];
}

async function getQuestions(questionFilePaths) {
  const groups = await Promise.all(questionFilePaths.map(async (questionFilePath) => {
    const load = questionFiles[`../questions/${questionFilePath}`];
    if (!load) throw new Error(`Missing question file: ${questionFilePath}`);
    const questions = await load();
    if (!Array.isArray(questions)) throw new Error('Invalid question file');
    return questions;
  }));
  return groups.flat();
}

function uniqueQuestions(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = JSON.stringify([
      question.question.trim().toLowerCase(),
      question.answers.map((answer) => answer.trim().toLowerCase()),
      question.correct,
      question.image || '',
    ]);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function shuffleQuestions(questions) {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export default async function generateQuiz(currentNode, rootNode, shuffleLesson) {
  const selectedNode = currentNode.type === "exam" ? rootNode : currentNode;
  const questionFilePaths = getQuestionFiles(selectedNode);
  const loadedQuestions = await getQuestions(questionFilePaths);
  const availableQuestions = currentNode.type === "exam"
    ? uniqueQuestions(loadedQuestions)
    : loadedQuestions;
  const questions =
    currentNode.type === "lesson"
      ? shuffleLesson
        ? shuffleQuestions(availableQuestions)
        : availableQuestions
      : shuffleQuestions(availableQuestions).slice(0, 50);

  if (questions.length === 0) {
    return null;
  }

  return {
    title: currentNode.title,
    questions,
    currentQuestion: 0,
    answers: {},
    score: 0,
  };
}
