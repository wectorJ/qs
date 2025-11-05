import { addSampleQuizes } from './add_sample_quizes.js';

const createButton = document.getElementById('create')
const manageButton = document.getElementById('manage')
const resulstsButton = document.getElementById('results')

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM is ready!");
    addSampleQuizes();
});

createButton.addEventListener('click', function(){
    window.location.href = 'create.html'
});

manageButton.addEventListener('click', function(){
    window.location.href = 'manage.html'
});

resulstsButton.addEventListener('click', function(){
    window.location.href = 'results.html'
});

const quizKeys = Object.keys(localStorage).filter(key => key.startsWith('quizData_'));
const quizButtonsContainer = document.getElementById('quiz_buttons_container');
const quizList = document.getElementById('quiz_list');

function showQuizButtons() {
    quizKeys.forEach(key => {    
        const quizData = JSON.parse(localStorage.getItem(key));
        const button = document.createElement('button');
        button.textContent = quizData.quizTitle;
        button.addEventListener('click', function() {
            localStorage.setItem('currentQuiz', key);
            window.location.href = 'quize.html';
        });
        quizList.appendChild(button);
    });
}
showQuizButtons();

