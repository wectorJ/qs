import { loadFromLocalStorage, saveToLocalStorage } from "./localStorage/localStorageManager.js";

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

class QuizEditBox extends HTMLElement {
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

		const quizTitleElement = document.createElement('h2');
		quizTitleElement.textContent = 'Edit Quiz: ' + (title || 'Untitled quiz');


		const quizTitleLabel = document.createElement('p');
		quizTitleLabel.textContent = 'Quiz Title: ';

		const titleInput = document.createElement('input');
		titleInput.type = 'text';
		titleInput.value = title || '';

		
		const descriptionLabel = document.createElement('p');
		descriptionLabel.textContent = 'Quiz Description: ';
		
		const descriptionInput = document.createElement('textarea');
		descriptionInput.value = description || '';


		const saveButton = document.createElement('button');
		saveButton.textContent = 'Save Changes';
		saveButton.addEventListener('click', () => {
			const updatedTitle = titleInput.value.trim();
			const updatedDescription = descriptionInput.value.trim();
			const storedData = loadFromLocalStorage();
			const quizes = storedData.quizes || [];
			const updatedQuizes = quizes.map(quiz => {
				if (quiz.id === id) {
					return {
						...quiz,
						title: updatedTitle,
						description: updatedDescription
					};
				}
				return quiz;
			});
			saveToLocalStorage({ ...storedData, quizes: updatedQuizes });
			alert('Quiz updated successfully!');
		});





		const hr = document.createElement('hr');
		const br = document.createElement('br');

		wrapper.appendChild(quizTitleElement);

		wrapper.appendChild(quizTitleLabel);
		wrapper.appendChild(titleInput);

		wrapper.appendChild(descriptionLabel);
		wrapper.appendChild(descriptionInput);
		wrapper.appendChild(hr);

		wrapper.appendChild(saveButton);

		this.appendChild(wrapper);
	}
}

if (!customElements.get('manage-quiz-box')) {
	customElements.define('manage-quiz-box', ManageQuizBox);
}
if (!customElements.get('edit-quiz-box')) {
	customElements.define('edit-quiz-box', QuizEditBox);
}



document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('quiz-list');
    if (!listContainer) {
        return;
    }
    const quizzes = loadFromLocalStorage().quizes || [];

	const params = new URLSearchParams(window.location.search);
	const quizIdParam = params.get('id');
	let quizToManage = null;

	if (!quizIdParam) {
    	quizzes.forEach(quizData => {
    	    const quizBox = document.createElement('manage-quiz-box');
    	    quizBox.quiz = quizData;
    	    listContainer.appendChild(quizBox);
    	});
	} else {
		quizzes.forEach(quizData => {
    	    const isThereQuizToManage = String(quizData.id) === String(quizIdParam);
			if (isThereQuizToManage) {
				quizToManage =  quizData.id;
			}
    	});

		console.log(quizToManage);
		if (quizToManage !== null) {
			const quizBox = document.createElement('edit-quiz-box');
			const quizData = quizzes.find((item) => String(item.id) === String(quizToManage));
			quizBox.quiz = quizData;
			listContainer.appendChild(quizBox);
		} else {
			listContainer.textContent = 'Quiz to manage not found.';
		}


	}
});