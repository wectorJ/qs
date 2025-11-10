import { loadFromLocalStorage } from "../js/localStorage/localStorageManager.js";

class QuizBox extends HTMLElement {
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

		titleLink.textContent = title || 'Untitled quiz';
		let quizHref = './quiz.html';
		if (typeof id === 'number' || typeof id === 'string') {
			const encodedId = encodeURIComponent(id);
			quizHref += `?id=${encodedId}`;

			wrapper.style.cursor = 'pointer';
			wrapper.addEventListener('click', () => {
				window.location.href = quizHref;
			});
			
		}
		titleLink.href = quizHref;
		
		heading.appendChild(titleLink);
		const questionsCount = Array.isArray(questions) ? questions.length : 0;
		questionInfo.textContent = `Count of questions: ${questionsCount}`;
		descriptionInfo.textContent = description || 'No description available.';

		wrapper.appendChild(heading);
		wrapper.appendChild(questionInfo);
		wrapper.appendChild(descriptionInfo);

		this.appendChild(wrapper);
	}
}

if (!customElements.get('quiz-box')) {
	customElements.define('quiz-box', QuizBox);
}

document.addEventListener('DOMContentLoaded', async () => {
	const listContainer = document.getElementById('quiz-list');

	if (!listContainer) {
		return;
	}

	try {
		//const response = await fetch('js/localStorage/quises_data.json');

		// if (!response.ok) {
		// 	throw new Error(`Failed to load quises_data.json: ${response.status}`);
		// }

		// const data = await response.json();
		const data = loadFromLocalStorage();
		const quizes = Array.isArray(data?.quizes) ? data.quizes : [];

		if (!quizes.length) {
			listContainer.textContent = 'Quiz list is empty.';
			return;
		}

		quizes.forEach((quiz) => {
			const quizElement = document.createElement('quiz-box');
			quizElement.quiz = quiz;
			listContainer.appendChild(quizElement);
		});
	} catch (error) {
		console.error(error);
		listContainer.textContent = 'Failed to load quiz list.';
	}
});
