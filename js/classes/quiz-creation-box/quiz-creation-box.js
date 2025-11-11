import { loadFromLocalStorage, saveToLocalStorage, saveQuestionOptionCount, getQuestionOptionCount  } from "../../localStorage/localStorageManager.js";

export class QuizCreation extends HTMLElement {
  constructor() {
    super();

    this.quizTitleInput = null;
    this.quizDescriptionInput = null;
    this.questionsContainer = null;
    this.createQuizBtn = null;
    this.addQuestionBtn = null;

    this.template_main = null;
    this.template_question = null;
    this.template_option = null;
  }

  async connectedCallback() {
    await this.loadTemplates();

    // Attach shadow DOM
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Inject CSS
    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", "../js/classes/quiz-creation-box/quiz-creation-box.css");
    shadowRoot.appendChild(styleLink);

    // Inject main template
    const mainContent = this.template_main.content.cloneNode(true);
    shadowRoot.appendChild(mainContent);

    // Save references to key elements
    this.quizTitleInput = shadowRoot.getElementById("quiz-title");
    this.quizDescriptionInput = shadowRoot.getElementById("quiz-description");
    this.questionsContainer = shadowRoot.getElementById("questions-container");
    this.addQuestionBtn = shadowRoot.getElementById("add-question-btn");
    this.createQuizBtn = shadowRoot.getElementById("create-quiz-btn");

    // Initialize localStorage counters
    const data = loadFromLocalStorage();
    data.currect_question_number = 1;
    data.currect_option_number = {};
    saveToLocalStorage(data);

    // Event listeners
    this.addQuestionBtn.addEventListener("click", () => this.addQuestionField());
    if (this.createQuizBtn) {
      this.createQuizBtn.addEventListener("click", () => this.createNewQuiz());
    }
  }

  async loadTemplates() {
    const response = await fetch("../js/classes/quiz-creation-box/quiz-creation-box.html");
    const htmlText = await response.text();
    const tmp = document.createElement("div");
    tmp.innerHTML = htmlText;

    this.template_main = tmp.querySelector(".quiz-creation-template");
    this.template_question = tmp.querySelector(".question-template");
    this.template_option = tmp.querySelector(".option-template");
  }

  addQuestionField() {
    const data = loadFromLocalStorage();
    const questionNumber = data.currect_question_number++;
    saveToLocalStorage(data);

    const questionNode = this.template_question.content.cloneNode(true);
    const questionElem = questionNode.querySelector(".question-item");

    // Question input
    const questionInput = questionElem.querySelector(".question-text-input");
    questionInput.name = `question-text-${questionNumber}`;
    questionInput.placeholder = `Question`;

    const optionsList = questionElem.querySelector(".options-list");

    // Add 3 default options
    this.addOption(optionsList, questionNumber);
    this.addOption(optionsList, questionNumber);
    this.addOption(optionsList, questionNumber);

    // Add option button
    const addOptionBtn = questionElem.querySelector(".add-option-btn");
    addOptionBtn.addEventListener("click", () => this.addOption(optionsList, questionNumber));

    // Delete question button
    const removeQuestionBtn = questionElem.querySelector(".delete-question-button");
    removeQuestionBtn.addEventListener("click", () => {
      if (questionElem) questionElem.remove();
    });

    this.questionsContainer.appendChild(questionElem);
  }

  addOption(optionsContainer, questionNumber) {
    const optionCount = getQuestionOptionCount(questionNumber);
    saveQuestionOptionCount(questionNumber, optionCount);

    const optionNode = this.template_option.content.cloneNode(true);
    const optionElem = optionNode.querySelector(".option-item");

    const deleteBtn = optionElem.querySelector(".delete-option-button");
    deleteBtn.addEventListener("click", () => {
      if (optionsContainer.children.length > 1) {
        optionElem.remove();
      }
    });

    const radioInput = optionElem.querySelector(".radio-option-input-button");
    radioInput.name = `choice-${questionNumber}`;
    optionElem.querySelector(".option-text-input").placeholder = `Option`;

    optionsContainer.appendChild(optionElem);
  }

  createNewQuiz() {
    const data = loadFromLocalStorage() || { current_quiz_id: 0, quizes: [] };
    const title = this.quizTitleInput.value.trim();
    const description = this.quizDescriptionInput.value.trim();

    if (!title) return alert("Please provide a title for the quiz.");
    if (!description) return alert("Please provide a description for the quiz.");

    const questionElements = this.questionsContainer.querySelectorAll(".question-item");
    if (questionElements.length === 0) return alert("Please add at least one question.");

    const questions = Array.from(questionElements).map((qElem, qIndex) => {
      const questionText = qElem.querySelector(".question-text-input").value.trim() || `Question ${qIndex + 1}`;
      const optionsElems = qElem.querySelectorAll(".option-item");

      const options = Array.from(optionsElems).map(opt => opt.querySelector(".option-text-input").value.trim());
      let answer = null;
      optionsElems.forEach((opt, idx) => {
        if (opt.querySelector(".radio-option-input-button").checked) {
          answer = options[idx];
        }
      });
      if (!answer) answer = options[0] || "";

      return { question: questionText, options, answer, value: 1 };
    });

    const newQuiz = { id: data.current_quiz_id + 1, title, description, questions };
    data.current_quiz_id += 1;
    data.quizes.push(newQuiz);
    saveToLocalStorage(data);

    window.location.href = "./index.html";
  }
}

customElements.define("quiz-creation", QuizCreation);
