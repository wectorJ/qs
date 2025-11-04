function loadQuizzes() {
    const quizListDiv = document.getElementById("quiz_list");
    quizListDiv.innerHTML = "<h3>Saved Quizzes</h3>";

    const allKeys = Object.keys(localStorage);
    const quizKeys = allKeys.filter((key) => key.startsWith("quizData_"));

    if (quizKeys.length === 0) {
        quizListDiv.innerHTML += "<p>No quizzes found.</p>";
        return;
    }

    quizKeys.forEach((key) => {
        const name = key.replace("quizData_", "");
        const quizItem = document.createElement("div");
        quizItem.style.marginBottom = "8px";
        quizItem.innerHTML = `
            <strong>${name}</strong>
            <button onclick="editQuiz('${key}')">Edit</button>
            <button onclick="deleteQuiz('${key}')">Delete</button>
        `;
        quizListDiv.appendChild(quizItem);
    });
}

function deleteQuiz(key) {
    localStorage.removeItem(key);
    loadQuizzes(); 
}

function editQuiz(key) {
    console.log("Editing quiz:", key);
    
    // Add editing, I AM TOO LAZY TO DO IT

}

loadQuizzes();