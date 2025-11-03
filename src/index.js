const createButton = document.getElementById('create')
const manageButton = document.getElementById('manage')


createButton.addEventListener('click', function(){
    window.location.href = 'create.html'
});

manageButton.addEventListener('click', function(){
    window.location.href = 'manage.html'
});


const quizKeys = Object.keys(localStorage).filter(key => key.startsWith('quizData_'));
const quizButtonsContainer = document.getElementById('quiz_buttons_container');
const quizList = document.getElementById('quiz_list');

quizKeys.forEach(key => {
    const quizData = JSON.parse(localStorage.getItem(key));
    const button = document.createElement('button');
    button.textContent = quizData.quizTitle;
    button.addEventListener('click', function() {
        localStorage.setItem('currentQuiz', key);
        window.location.href = 'src/test.html';
    });
    quizList.appendChild(button);
});

