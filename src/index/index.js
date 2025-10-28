const createButton = document.getElementById('create')
const quizButton = document.getElementById('quiz')
const manageButton = document.getElementById('manage')

createButton.addEventListener('click', function(){
    window.location.href = 'create.html'
})

quizButton.addEventListener('click', function(){
    window.location.href = 'quize.html'
})

manageButton.addEventListener('click', function(){
    window.location.href = 'manage.html'
})
