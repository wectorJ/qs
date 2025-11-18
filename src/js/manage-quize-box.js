// manage-quizzes.js
import { loadFromLocalStorage } from "./localStorage/localStorageManager.js";
import "./classes/quiz-manage-box/quiz-manage-box.js";
import "./classes/quiz-edit-box/quiz-edit-box.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listContainer = document.getElementById("quiz-list");
  if (!listContainer) return;

  const quizzes = loadFromLocalStorage()?.quizes || [];

  const params = new URLSearchParams(window.location.search);
  const quizIdParam = params.get("id");

  // No quiz id in URL: render all quizzes using manage-quiz-box
  if (!quizIdParam) {
    quizzes.forEach((quizData) => {
      const quizBox = document.createElement("quiz-manage-box");
      quizBox.quiz = quizData;
      listContainer.appendChild(quizBox);
    });
    return;
  }

  // If URL has quiz id: find that quiz
  const quizData = quizzes.find((q) => String(q.id) === String(quizIdParam));
  if (quizData) {
    const editBox = document.createElement("quiz-edit-box");
    editBox.quiz = quizData;
    listContainer.appendChild(editBox);
  } else {
    listContainer.textContent = "Quiz to manage not found.";
  }
});
