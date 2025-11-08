import { loadFromLocalStorage, saveToLocalStorage } from "../localStorage/localStorageManager.js";



const createQuizBtn = document.getElementById('create-quiz-btn');
const quizTitleInput = document.getElementById('quiz-title');
const quizDescriptionInput = document.getElementById('quiz-description');
const questionsContainer = document.getElementById('questions-container');
const addQuestionBtn = document.getElementById('add-question-btn');
const removeQuestionBtn = document.getElementById('remove-question-btn');


let addOptionBtn;
let template_question;
let template_option;

// template for question field
async function loadTemplates() {
  const response = await fetch('./js/create/templates.html');
  const html = await response.text();

  // Create a temporary container to parse the HTML string
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Extract templates
  template_question = temp.querySelector('.question-template');
  template_option = temp.querySelector('.option-template');
}

loadTemplates().then(() => {
  addQuestionBtn.addEventListener('click', () => {
    addQuestionField();
  }); 

  removeQuestionBtn.addEventListener('click', () => {
    removeQuestionField();
  });


});


function addQuestionField() {
  const question = template_question.content.cloneNode(true);
  const questionText = question.querySelector('.question-text');
  const questionCount = questionsContainer.children.length + 1;

  questionText.textContent = `Question ${questionCount}`;

  const optionList = question.querySelector('.options-list');
  // optionList.appendChild(option);
  addOption(optionList, questionCount);
  addOption(optionList, questionCount);
  addOption(optionList, questionCount);

  const addOptionBtn = question.querySelector('.add-option-btn');
  addOptionBtn.addEventListener('click', () => {
    addOption(optionList, questionCount);
  });

  const removeOptionBtn = question.querySelector('.remove-option-btn');
  removeOptionBtn.addEventListener('click', () => {
    removeOption(optionList);
  });

  questionsContainer.appendChild(question); 
}


function addOption(optionListContainer, questionNumber) {
  const optionNumber = optionListContainer.children.length + 1;
  const option = template_option.content.cloneNode(true);

  option.querySelector('.option-text-input').placeholder = `Option ${optionNumber}`;
  option.querySelector('.radio-option-input-button').name = `choice ${questionNumber}`;
  
  optionListContainer.appendChild(option);
}

function removeOption(optionListContainer) {
  if (optionListContainer.children.length > 1) {
    optionListContainer.removeChild(optionListContainer.lastElementChild);
  }
}

function removeQuestionField() {
  if (questionsContainer.children.length > 0) {
    questionsContainer.removeChild(questionsContainer.lastElementChild);
  }
}







export function addQuestionToQuiz(quizID, questionText, options, answer, value = 1) {
  const data = loadFromLocalStorage();

  const quiz = data.quizes.find(q => q.id === quizID);

  const newQuestion = new QuizQuestion(questionText, options, answer, value);
  quiz.questions.push(newQuestion);


  saveToLocalStorage(data); 
}

export function createNewQuiz(title, description) {
  const data = loadFromLocalStorage() || { current_quiz_id: 0, quizes: [] };

  const newQuizID = data.current_quiz_id + 1;

  const questionsQuiz = new QuizQuestion("Sample Question", ["Option 1", "Option 2", "Option 3"], "Option 1", 1);
  
  
  const newQuiz = new Quiz(newQuizID, title, description, questionsQuiz ? [questionsQuiz] : []);  
  

  const li = document.createElement('quiz');
  li.innerHTML = `
    {
      "id": ${newQuizID},
      "title": "${title}",
      "description": "${description}",
      "questions": []
    }
  `;


  data.quizes.push(li);
  data.current_quiz_id = newQuizID;
  saveToLocalStorage(data);

  return newQuizID;
}



if (createQuizBtn) {
  createQuizBtn.addEventListener('click', () => {
    const title = quizTitleInput.value.trim();
    const description = quizDescriptionInput.value.trim();

    const newQuizID = createNewQuiz(title, description);
  });
}
