import { loadFromLocalStorage, saveToLocalStorage } from "../localStorage/localStorageManager.js";



const quizTitleInput = document.getElementById('quiz-title');
const quizDescriptionInput = document.getElementById('quiz-description');
const questionsContainer = document.getElementById('questions-container');

const createQuizBtn = document.getElementById('create-quiz-btn');
const addQuestionBtn = document.getElementById('add-question-btn');
const removeQuestionBtn = document.getElementById('remove-question-btn');

const data = loadFromLocalStorage();

data.currect_question_number = 1;
data.currect_option_number = { };

saveToLocalStorage(data);

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

  // removeQuestionBtn.addEventListener('click', () => {
  //   removeQuestionField();
  // });


});


function addQuestionField() {
  const data = loadFromLocalStorage();

  // const questionCount = questionsContainer.children.length + 1;
  const questionCount = data.currect_question_number;
  data.currect_question_number += 1; 
  saveToLocalStorage(data);

  const question = template_question.content.cloneNode(true);
  const questionText = question.querySelector('.question-text');
  const questionTextInput = question.querySelector('.question-text-input');


  questionText.textContent = `Question ${questionCount}`;
  questionTextInput.placeholder = `Question ${questionCount}`;
  questionTextInput.name = `question-text-${questionCount}`;




  const optionList = question.querySelector('.options-list');
  // optionList.appendChild(option);
  addOption(optionList, questionCount);
  addOption(optionList, questionCount);
  addOption(optionList, questionCount);

  const addOptionBtn = question.querySelector('.add-option-btn');
  addOptionBtn.addEventListener('click', () => {
    addOption(optionList, questionCount);
  });

  const removeQuestionBtn = question.querySelector('.delete-question-button');
  removeQuestionBtn.addEventListener('click', (event) => {
    const questionItem = event.target.closest('.question-item');
    if (questionItem) {
      questionItem.remove();
    }
  });

  // const removeOptionBtn = question.querySelector('.remove-option-btn');
  // removeOptionBtn.addEventListener('click', () => {
  //   removeOption(optionList);
  // });

  questionsContainer.appendChild(question); 
}


function addOption(optionListContainer, questionNumber) {

  

  const optionNumber = getQuestionOptionCount(questionNumber);
  saveQuestionOptionCount(questionNumber, optionNumber);

  const option = template_option.content.cloneNode(true);
  const deleteOptionBtn = option.querySelector('.delete-option-button');
  deleteOptionBtn.name = `delete-option-${optionNumber}`;

  deleteOptionBtn.addEventListener('click', () => {
    if (optionListContainer.children.length > 1) {
      // optionListContainer.content.removeChild(optionListContainer[optionListContainer.children.length - 1]);
      optionListContainer.removeChild(deleteOptionBtn.closest('.option-item'));
      // console.log(optionListContainer[0]);
    }
  });

  option.querySelector('.option-text-input').placeholder = `Option ${optionNumber}`;
  option.querySelector('.radio-option-input-button').name = `choice ${questionNumber}`;
  
  optionListContainer.appendChild(option);
}

function saveQuestionOptionCount(questionNumber, optionCount){
  const data = loadFromLocalStorage();
  data.currect_option_number[questionNumber] = optionCount+1 || 1;
  saveToLocalStorage(data);
}

function getQuestionOptionCount(questionNumber){
  const data = loadFromLocalStorage();
  return data.currect_option_number?.[questionNumber] ?? 1;
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









export function createNewQuiz() {
  // Load data or initialize new structure
  const data = loadFromLocalStorage() || { current_quiz_id: 0, quizes: [] };

  // Get title & description
  const title = quizTitleInput.value.trim() || 'Untitled Quiz';
  const description = quizDescriptionInput.value.trim() || 'No description provided.';

  const questionElements = questionsContainer.querySelectorAll(':scope > div');
  const questions = [];


  if (questionElements.length === 0) {
    alert('Please add at least one question to create a quiz.');
    return;
  }
  if (title === 'Untitled Quiz') {
    alert('Please provide a title for the quiz.');
    return;
  }
  if (description === 'No description provided.') {
    alert('Please provide a description for the quiz.');
    return;
  }

  

  questionElements.forEach((questionElement) => {
    const questionText = questionElement.querySelector('.question-text-input')?.value.trim() || 'Untitled Question';
    const optionElements = questionElement.querySelectorAll('.option-item');

    const options = [];
    let correctAnswer = null;

    optionElements.forEach((optionElement, index) => {
      const optionText = optionElement.querySelector('.option-text-input')?.value.trim() || `Option ${index + 1}`;
      options.push(optionText);

      const radioInput = optionElement.querySelector('.radio-option-input-button');
      if (radioInput?.checked) {
        correctAnswer = optionText;
      }
    });

    // Default correct answer if none selected
    if (!correctAnswer && options.length > 0) {
      correctAnswer = options[0];
    }

    questions.push({
      question: questionText,
      options: options,
      answer: correctAnswer,
      value: 1
    });
  });

  // Create new quiz
  const newQuiz = {
    id: data.current_quiz_id + 1,
    title,
    description,
    questions
  };

  // Save to localStorage
  data.current_quiz_id += 1;
  data.quizes.push(newQuiz);
  saveToLocalStorage(data);
  window.location.href = "./index.html";

}





if (createQuizBtn) {
  createQuizBtn.addEventListener('click', () => {
    createNewQuiz();
  });
}
