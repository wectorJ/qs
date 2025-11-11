export class QuizBox extends HTMLElement {
  set quiz(value) {
    this._quiz = value;
    this.render();
  }

  async render() {
    if (!this._quiz) return;

    // Attach shadow DOM
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    // Load CSS
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = './quiz-box.css';
    this.shadowRoot.appendChild(styleLink);

    // Load template
    const response = await fetch('../js/classes/quiz-box/quiz-box.html');
    const htmlText = await response.text();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    const template = tempDiv.querySelector('.quiz-box-template');
    const card = template.content.cloneNode(true);

    // Populate data
    const { id, title, questions, description } = this._quiz;

    const titleLink = card.querySelector('.quiz-title-link');
    titleLink.textContent = title || 'Untitled quiz';

    const questionCountElem = card.querySelector('.quiz-question-count');
    questionCountElem.textContent = `Count of questions: ${Array.isArray(questions) ? questions.length : 0}`;

    const descriptionElem = card.querySelector('.quiz-description');
    descriptionElem.textContent = description || 'No description available.';

    // Set href & click behavior
    let quizHref = './quiz.html';
    if (id !== undefined) {
      quizHref += `?id=${encodeURIComponent(id)}`;
      titleLink.href = quizHref;

      const wrapper = card.querySelector('.quiz-card');
      wrapper.addEventListener('click', () => {
        window.location.href = quizHref;
      });
    }

    // Clear previous content & append new card
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(styleLink);
    this.shadowRoot.appendChild(card);
  }
}

// Define custom element
if (!customElements.get('quiz-box')) {
  customElements.define('quiz-box', QuizBox);
}
