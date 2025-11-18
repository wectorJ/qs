import { QuizCreation } from "../classes/quiz-creation-box/quiz-creation-box.js";

export function initQuizCreation() {
  const container = document.getElementById("quiz-creation-container");
  if (!container) return;

  const quizComponent = document.createElement("quiz-creation");
  container.appendChild(quizComponent);
}

// Для обратной совместимости, если нужно
initQuizCreation();
