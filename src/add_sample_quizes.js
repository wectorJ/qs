if (localStorage.getItem('quizData_sampleQuiz1') === null) {
    fetch('./src/sample_quizes/1.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('quizData_sampleQuiz1', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

if (localStorage.getItem('quizData_sampleQuiz2') === null) {
    fetch('./src/sample_quizes/2.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('quizData_sampleQuiz2', JSON.stringify(data));
        })
        .catch(error => console.error('Error loading quiz data:', error));
}