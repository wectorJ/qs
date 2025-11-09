import { loadFromLocalStorage } from "../js/localStorage/localStorageManager.js";

class QuizResultBox extends HTMLElement {
    set quiz(value) {
        this._quiz = value;
        this.render();
    }

    render() {
        this.textContent = '';

        if (!this._quiz || !this._quiz.result) {
            return;
        }

        const { result } = this._quiz;
        const { quizId, title, correct, total, percentage, completedAt } = result;

        const wrapper = document.createElement('article');
        wrapper.className = 'quiz-card';

        // Title + link
        const heading = document.createElement('h2');
        const titleLink = document.createElement('a');
        titleLink.textContent = title || 'Untitled quiz';

        if (typeof quizId === 'number' || typeof quizId === 'string') {
            const encodedId = encodeURIComponent(quizId);
            titleLink.href = `./result.html?id=${encodedId}`;
        } else {
            titleLink.href = './result.html';
        }
        heading.appendChild(titleLink);

        // Score info
        const scoreInfo = document.createElement('p');
        scoreInfo.textContent = `Score: ${correct} / ${total} (${percentage}%)`;

        // Completion date
        const completedInfo = document.createElement('p');
        if (completedAt) {
            const date = new Date(completedAt);
            completedInfo.textContent = `Completed at: ${date.toLocaleString()}`;
        } else {
            completedInfo.textContent = 'Completion date unavailable.';
        }

        wrapper.appendChild(heading);
        wrapper.appendChild(scoreInfo);
        wrapper.appendChild(completedInfo);
        this.appendChild(wrapper);
    }
}

if (!customElements.get('quiz-result-box')) {
    customElements.define('quiz-result-box', QuizResultBox);
}

document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('quiz-result-list');

    if (!listContainer) {
        return;
    }

    try {
        const data = loadFromLocalStorage();
        const quizes = Array.isArray(data?.quizes) ? data.quizes : [];

        if (!quizes.length) {
            listContainer.textContent = 'No quiz results found.';
            return;
        }

        listContainer.textContent = 'No quiz done :(';

        // Display only quizzes that have a result
        quizes.forEach((quiz) => {
            if (quiz.result) {
                listContainer.textContent = '';
                const quizElement = document.createElement('quiz-result-box');
                quizElement.quiz = quiz;
                listContainer.appendChild(quizElement);
            }
        });
    } catch (error) {
        console.error(error);
        listContainer.textContent = 'Failed to load quiz results.';
    }
});
