import { loadFromLocalStorage, saveToLocalStorage } from "../js/localStorage/localStorageManager.js";

class ManageQuizBox extends HTMLElement {
	set quiz(value) {
		this._quiz = value;
		this.render();
	}

	render() {
		this.textContent = '';

		if (!this._quiz) {
			return;
		}

		const { id, title, questions, description } = this._quiz;
		const wrapper = document.createElement('article');
		wrapper.className = 'quiz-card';

		const heading = document.createElement('h2');
		const titleLink = document.createElement('a');
		const questionInfo = document.createElement('p');
		const descriptionInfo = document.createElement('p');
        const deleteButton = document.createElement('button');
        const editButton = document.createElement('button');

        deleteButton.textContent = 'Delete';
        editButton.textContent = 'Edit';

        deleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the quiz "${title}"?`)) {
                const storedData = loadFromLocalStorage();
                const quizes = storedData.quizes || [];
                const updatedQuizes = quizes.filter(quiz => quiz.id !== id);
                saveToLocalStorage({ ...storedData, quizes: updatedQuizes });
                this.remove();
            }
        });

        editButton.addEventListener('click', () => {
            let quizHref = './manage.html';
            if (typeof id === 'number' || typeof id === 'string') {
                const encodedId = encodeURIComponent(id);
                quizHref += `?id=${encodedId}`;
            }
            window.location.href = quizHref;
        });





		titleLink.textContent = title || 'Untitled q	uiz';
		let quizHref = './quiz.html';
		if (typeof id === 'number' || typeof id === 'string') {
			const encodedId = encodeURIComponent(id);
			quizHref += `?id=${encodedId}`;

			// wrapper.style.cursor = 'pointer';
			// wrapper.addEventListener('click', () => {
			// 	window.location.href = quizHref +`?id=${encodedId}`;
			// });
		}
		titleLink.href = quizHref;
		


		heading.appendChild(titleLink);
		const questionsCount = Array.isArray(questions) ? questions.length : 0;
		questionInfo.textContent = `Count of questions: ${questionsCount}`;
		descriptionInfo.textContent = description || 'No description available.';

		wrapper.appendChild(heading);
		wrapper.appendChild(descriptionInfo);
		wrapper.appendChild(questionInfo);
        wrapper.appendChild(editButton);
        wrapper.appendChild(deleteButton);

		this.appendChild(wrapper);
	}
}

if (!customElements.get('manage-quiz-box')) {
	customElements.define('manage-quiz-box', ManageQuizBox);
}



document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('quiz-list');
    if (!listContainer) {
        return;
    }
    const quizzes = loadFromLocalStorage().quizes || [];

    quizzes.forEach(quizData => {
        const quizBox = document.createElement('manage-quiz-box');
        quizBox.quiz = quizData;
        listContainer.appendChild(quizBox);
    });
});