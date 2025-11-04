
export function addSampleQuizes() {
    if (localStorage.getItem('quizData_SampleQuiz1') === null) {
        fetch('./src/sample_quizes/1.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('quizData_SampleQuiz1', JSON.stringify(data));
            })
            .catch(error => console.error('Error loading quiz data:', error));
    }

    if (localStorage.getItem('quizData_SampleQuiz2') === null) {
        fetch('./src/sample_quizes/2.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('quizData_SampleQuiz2', JSON.stringify(data));
            })
            .catch(error => console.error('Error loading quiz data:', error));
    }
}

addSampleQuizes();