const results_holder = document.getElementById('results_holder');
const resultsKeys = Object.keys(localStorage).filter(key => key.startsWith('quizResult_'));

console.log(resultsKeys);

for (const key of resultsKeys) {
    const quizName = key.replace('quizResult_quizData_', '');
    const score = localStorage.getItem(key);
    const resultDiv = document.createElement('div');
    resultDiv.className = 'result-entry';
    resultDiv.innerHTML = `<h3>Quiz: ${quizName}</h3><p>Your score: ${score}</p>`;
    results_holder.appendChild(resultDiv);
}
