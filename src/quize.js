
let quizName = localStorage.getItem('currentQuiz');


const quiz = JSON.parse(localStorage.getItem(quizName));
console.log(quiz);

function displayQuiz() {
    const container = document.getElementById('quiz_container');
    container.innerHTML = `<h2>${quiz.quizTitle}</h2>`;
    
    quiz.questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        questionDiv.innerHTML = `
            <h3>Question ${index + 1}: ${question.questionText}</h3>
            ${question.options.map((option, optIndex) => `
                <label>
                    <input type="radio" name="question${index}" value="${optIndex}">
                    ${option}
                </label><br>
                `).join('')}`;

        container.appendChild(questionDiv);
    });
}

function checkAnswers() {
    let score = 0;
    quiz.questions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="question${index}"]:checked`);
        if (selected && parseInt(selected.value) === question.correctOptionIndex) {
            score++;
        }
    });
    document.getElementById('results').innerHTML = `Your score: ${score} out of ${quiz.questions.length}`;
    
    localStorage.setItem('quizResult_' + quizName, score);

}

displayQuiz();
document.getElementById('submit_quiz').addEventListener('click', checkAnswers);