import { loadFromLocalStorage, saveToLocalStorage } from "../../localStorage/localStorageManager.js";

export class QuizEditBox extends HTMLElement {
  constructor() {
    super();

    this._quiz = null;
    this.template_main = null;
    this.template_question = null;
    this.template_option = null;
    this.styles = null;
  }

  connectedCallback() {
    this.loadTemplates();
  }

  async loadTemplates() {
    // Load all templates
    const [htmlMain, htmlQuestion, htmlOption, cssFile] = await Promise.all([
      fetch("../js/classes/quiz-edit-box/quiz-edit-box.html").then(r => r.text()),
      fetch("../js/classes/quiz-edit-box/quiz-question-template.html").then(r => r.text()),
      fetch("../js/classes/quiz-edit-box/quiz-option-template.html").then(r => r.text()),
      fetch("../js/classes/quiz-edit-box/quiz-edit-box.css").then(r => r.text())
    ]);

    // Parse HTML templates
    const tmpMain = document.createElement("div");
    tmpMain.innerHTML = htmlMain;

    const tmpQuestion = document.createElement("div");
    tmpQuestion.innerHTML = htmlQuestion;

    const tmpOption = document.createElement("div");
    tmpOption.innerHTML = htmlOption;

    this.template_main = tmpMain.querySelector(".quiz-edit-template");
    this.template_question = tmpQuestion.querySelector(".quiz-question-template");
    this.template_option = tmpOption.querySelector(".quiz-option-template");
    this.styles = cssFile;

    if (this._quiz) {
      this.render();
    }
  }

  set quiz(value) {
    this._quiz = value;
    if (this.template_main) this.render();
  }

  render() {
    if (!this._quiz) return;
    this.innerHTML = "";

    const shadow = this.attachShadow({ mode: "open" });

    // attach styles
    const style = document.createElement("style");
    style.textContent = this.styles;
    shadow.appendChild(style);

    // clone base template
    const content = this.template_main.content.cloneNode(true);
    const { id, title, description, questions } = this._quiz;

    const heading = content.querySelector(".edit-heading");
    const titleInput = content.querySelector(".quiz-title");
    const descInput = content.querySelector(".quiz-description");
    const questionsList = content.querySelector(".questions-list");
    const saveBtn = content.querySelector(".save-btn");

    heading.textContent = `Edit Quiz: ${title || "Untitled quiz"}`;
    titleInput.value = title || "";
    descInput.value = description || "";

    // Build each question using question template
    questions.forEach((question, index) => {
      const questionNode = this.template_question.content.cloneNode(true);
      const questionInput = questionNode.querySelector(".question-text-input");
      const optionsContainer = questionNode.querySelector(".options-container");
      const addOptionBtn = questionNode.querySelector(".add-option-btn");

      questionInput.value = question.question || "";
      questionInput.placeholder = `Question ${index + 1}`;

      // Add existing options
      (question.options || []).forEach(opt => {
        const optNode = this.createOptionNode(opt, question.answer, index);
        optionsContainer.appendChild(optNode);
      });

      // Add new option button
      addOptionBtn.addEventListener("click", () => {
        const newOpt = this.createOptionNode("", question.answer, index);
        optionsContainer.appendChild(newOpt);
      });

      questionsList.appendChild(questionNode);
    });

    // Save button handler
    saveBtn.addEventListener("click", () => this.saveQuizChanges(id, titleInput, descInput, questionsList));

    shadow.appendChild(content);
  }

  createOptionNode(optionText, correctAnswer, questionIndex) {
    const optionNode = this.template_option.content.cloneNode(true);
    const radio = optionNode.querySelector(".radio-option-input-button");
    const textInput = optionNode.querySelector(".option-text-input");
    const deleteBtn = optionNode.querySelector(".delete-option-button");

    textInput.value = optionText;
    textInput.placeholder = "Option";
    radio.name = `choice-${questionIndex}`;

    if (optionText === correctAnswer) {
      radio.checked = true;
    }

    deleteBtn.addEventListener("click", (e) => {
      const item = e.target.closest(".option-item");
      const parent = item?.parentElement;
      if (parent && parent.children.length > 1) {
        item.remove();
      }
    });

    return optionNode;
  }

  saveQuizChanges(id, titleInput, descInput, questionsList) {
    const updatedTitle = titleInput.value.trim();
    const updatedDesc = descInput.value.trim();

    const updatedQuestions = Array.from(questionsList.querySelectorAll(".question-edit-box")).map((qBox, idx) => {
      const questionText = qBox.querySelector(".question-text-input").value.trim();
      const optionInputs = Array.from(qBox.querySelectorAll(".option-text-input"));
      const radioInputs = Array.from(qBox.querySelectorAll(`input[name="choice-${idx}"]`));

      const options = optionInputs.map(i => i.value.trim());
      const checkedIdx = radioInputs.findIndex(r => r.checked);
      const answer = checkedIdx >= 0 ? options[checkedIdx] : options[0] || "";

      return { question: questionText, options, answer };
    });

    const storedData = loadFromLocalStorage();
    const quizes = storedData.quizes || [];
    const updated = quizes.map(q =>
      String(q.id) === String(id)
        ? { ...q, title: updatedTitle, description: updatedDesc, questions: updatedQuestions }
        : q
    );

    saveToLocalStorage({ ...storedData, quizes: updated });
    alert("Quiz updated successfully!");
  }
}

customElements.define("quiz-edit-box", QuizEditBox);
