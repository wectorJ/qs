import { loadFromLocalStorage } from "./localStorage/localStorageManager.js";
import './classes/quiz-box/quiz-box.js';

document.addEventListener('DOMContentLoaded', async () => {
  const listContainer = document.getElementById('quiz-list');
  if (!listContainer) return;

  try {
    const data = loadFromLocalStorage() || {};
    const quizzes = Array.isArray(data.quizes) ? data.quizes : [];

    if (quizzes.length === 0) {
      listContainer.textContent = 'Quiz list is empty.';
      return;
    }

    // Clear container before adding
    listContainer.innerHTML = '';

    // Create and append <quiz-box> elements
    quizzes.forEach((quiz) => {
      const quizElement = document.createElement('quiz-box');
      quizElement.quiz = quiz;
      listContainer.appendChild(quizElement);
    });

  } catch (error) {
    console.error('Error loading quizzes:', error);
    listContainer.textContent = 'Failed to load quiz list.';
  }
});
