import { saveToLocalStorage } from './localStorageManager.js';
import { loadFromLocalStorage } from './localStorageManager.js';

import { quizQuestions } from './localStorageManager.js';
import { addQuestionToQuiz } from './localStorageManager.js';


import myJson from './quises_data.json' with {type: 'json'};
saveToLocalStorage(myJson);

console.log(quizQuestions());

const newQuestion = {
  question: "What is the capital of Germany?",
  options: ["Berlin", "Madrid", "Paris", "Rome"],
  answer: "Berlin"
};
addQuestionToQuiz(newQuestion);

addQuestionToQuiz(newQuestion, 1);


console.log(quizQuestions(1));
