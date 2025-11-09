import { loadFromLocalStorage, saveToLocalStorage } from './localStorage/localStorageManager.js';

document.addEventListener('DOMContentLoaded', async () => {
	const container = document.getElementById('quiz');

	if (!container) {
		return;
	}

	const params = new URLSearchParams(window.location.search);
	const quizIdParam = params.get('id');

	if (!quizIdParam) {
		container.textContent = 'Quiz ID is missing. Please select a quiz from the main page.';
		return;
	}

	try {
		let data = loadFromLocalStorage();

		if (!data) {
			const response = await fetch('js/localStorage/quises_data.json');

			if (!response.ok) {
				throw new Error(`Failed to load quises_data.json: ${response.status}`);
			}

			data = await response.json();
		}
		const quizes = Array.isArray(data?.quizes) ? data.quizes : [];
		const quiz = quizes.find((item) => String(item.id) === String(quizIdParam));

		if (!quiz) {
			container.textContent = 'Quiz not found. Please return to the main page and choose another quiz.';
			return;
		}

		renderQuiz(container, quiz);
	} catch (error) {
		console.error(error);
		container.textContent = 'Failed to load quiz data. Please try again later.';
	}
});

function renderQuiz(container, quiz) {
	container.textContent = '';

	const form = document.createElement('form');
	form.id = 'quiz-form';

	const title = document.createElement('h2');
	title.textContent = quiz.title || 'Untitled quiz';

	const description = document.createElement('p');
	description.textContent = quiz.description || 'No description available.';

	form.appendChild(title);
	form.appendChild(description);

	const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

	if (!questions.length) {
		const noQuestions = document.createElement('p');
		noQuestions.textContent = 'This quiz has no questions yet.';
		form.appendChild(noQuestions);
		container.appendChild(form);
		return;
	}

	questions.forEach((question, index) => {
		const fieldset = document.createElement('fieldset');
		fieldset.className = 'quiz-question';
		fieldset.dataset.questionId = question.id ?? String(index);

		const legend = document.createElement('legend');
		legend.textContent = `${index + 1}. ${question.question ?? 'Untitled question'}`;
		fieldset.appendChild(legend);

		const options = Array.isArray(question.options) ? question.options : [];

		if (options.length) {
			options.forEach((option, optionIndex) => {
				const optionId = `question-${index}-option-${optionIndex}`;
				const label = document.createElement('label');
				label.setAttribute('for', optionId);
				label.className = 'quiz-option';

				const input = document.createElement('input');
				input.type = 'radio';
				input.name = `question-${index}`;
				input.id = optionId;
				input.value = option;

				label.appendChild(input);
				label.appendChild(document.createTextNode(option));
				fieldset.appendChild(label);
			});
		} else {
			const noOptions = document.createElement('p');
			noOptions.textContent = 'No answer options provided.';
			fieldset.appendChild(noOptions);
		}

		form.appendChild(fieldset);
	});

	const resultMessage = document.createElement('p');
	resultMessage.id = 'quiz-result';
	resultMessage.className = 'quiz-result';
	form.appendChild(resultMessage);

	container.appendChild(form);
	setupSubmitHandler(form, quiz, resultMessage);
}

function setupSubmitHandler(form, quiz, resultMessage) {
	const submitButton = document.getElementById('submit-quiz-button');

	if (!submitButton) {
		return;
	}

	submitButton.onclick = (event) => {
		event.preventDefault();
		const score = evaluateQuiz(form, quiz.questions || []);
		resultMessage.textContent = `You scored ${score.correct} out of ${score.total}.`;

		try {
			saveQuizResult(quiz, score);
			resultMessage.textContent += ' Result saved.';
			submitButton.disabled = true;
		} catch (storageError) {
			console.error('Failed to persist quiz result:', storageError);
		}
	};
}

function evaluateQuiz(form, questions) {
	const score = { correct: 0, total: questions.length };

	questions.forEach((question, index) => {
		const selected = form.querySelector(`input[name="question-${index}"]:checked`);
		if (selected && selected.value === question.answer) {
			score.correct += 1;
		}
	});

	return score;
}

const QUIZ_RESULTS_KEY = 'quizResults';

function saveQuizResult(quiz, score) {
	const data = loadFromLocalStorage();
	if (!data) {
		throw new Error('No local storage data available to save quiz result.');
	}
	const results = loadQuizResults();
	const entry = {
		quizId: quiz.id ?? null,
		title: quiz.title ?? 'Untitled quiz',
		correct: score.correct,
		total: score.total,
		percentage: score.total ? Math.round((score.correct / score.total) * 100) : 0,
		completedAt: new Date().toISOString(),
	};

	// results.push(entry);
	data.quizes[quiz.id-1].result = entry;
	saveToLocalStorage(data);

	
	// localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(results));

	
	return entry;
}

function loadQuizResults() {
	try {
		const raw = localStorage.getItem(QUIZ_RESULTS_KEY);
		if (!raw) {
			return [];
		}
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch (error) {
		console.error('Failed to read quiz results from localStorage:', error);
		return [];
	}
}
