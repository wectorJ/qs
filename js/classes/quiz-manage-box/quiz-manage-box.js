import { loadFromLocalStorage, saveToLocalStorage } from "../../localStorage/localStorageManager.js";

export class QuizManageBox extends HTMLElement {
  constructor() {
    super();

    this._quiz = null;
    this.template = null;
    this.styles = null;
  }

  connectedCallback() {
    this.loadTemplates();
  }

  async loadTemplates() {
    const [htmlFile, cssFile] = await Promise.all([
      fetch("../js/classes/quiz-manage-box/quiz-manage-box.html").then(r => r.text()),
      fetch("../js/classes/quiz-manage-box/quiz-manage-box.css").then(r => r.text())
    ]);

    const tmp = document.createElement("div");
    tmp.innerHTML = htmlFile;
    this.template = tmp.querySelector(".quiz-manage-template");
    this.styles = cssFile;

    if (this._quiz) {
      this.render();
    }
  }

  set quiz(value) {
    this._quiz = value;
    if (this.template) this.render();
  }

  render() {
    if (!this._quiz) return;

    this.innerHTML = "";
    const shadow = this.attachShadow({ mode: "open" });

    // Attach styles
    const style = document.createElement("style");
    style.textContent = this.styles;
    shadow.appendChild(style);

    // Clone template
    const content = this.template.content.cloneNode(true);
    const { id, title, description, questions } = this._quiz;

    const titleEl = content.querySelector(".quiz-title");
    const descEl = content.querySelector(".quiz-description");
    const countEl = content.querySelector(".quiz-questions");
    const editBtn = content.querySelector(".edit-btn");
    const deleteBtn = content.querySelector(".delete-btn");

    // Set values
    const encodedId = encodeURIComponent(id);
    titleEl.textContent = title || "Untitled Quiz";
    titleEl.href = `./quiz.html?id=${encodedId}`;
    descEl.textContent = description || "No description available.";
    countEl.textContent = `Count of questions: ${Array.isArray(questions) ? questions.length : 0}`;

    // Delete quiz
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Are you sure you want to delete "${title}"?`)) {
        const storedData = loadFromLocalStorage();
        const quizes = storedData.quizes || [];
        const updated = quizes.filter(q => q.id !== id);
        saveToLocalStorage({ ...storedData, quizes: updated });
        this.remove();
      }
    });

    // Edit quiz
    editBtn.addEventListener("click", () => {
      window.location.href = `./manage.html?id=${encodedId}`;
    });

    shadow.appendChild(content);
  }
}

customElements.define("quiz-manage-box", QuizManageBox);
