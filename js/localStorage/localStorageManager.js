const KEY = 'QuizesData';

export function saveToLocalStorage(value) {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(KEY, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
}

export function loadFromLocalStorage() {
    try {
        const serializedValue = localStorage.getItem(KEY);
        if (serializedValue === null) {
            return undefined;
        }
        return JSON.parse(serializedValue);
    } catch (error) {
        console.error('Error loading from localStorage', error);
        return undefined;
    }
}



export function quizQuestions(quizID){
  const data = loadFromLocalStorage();
  const quizes = data ? data.quizes : [];

  if (quizID === undefined){
    quizID = data.current_quiz_id;
  }
  const currentQuiz = quizes.find(quiz => quiz.id === quizID);
  return currentQuiz ? currentQuiz.questions : [];
}

export function addQuestionToQuiz(newQuestion, id){
  const data = loadFromLocalStorage();
  const quizes = data ? data.quizes : [];

  if (id === undefined){
    id = data.current_quiz_id;
  }
  const quizIndex = quizes.findIndex(quiz => quiz.id === id);
  if (quizIndex !== -1) {
    quizes[quizIndex].questions.push(newQuestion);
    saveToLocalStorage(data);
  } else {
    console.error(`Quiz with id ${id} not found.`);
  }
  
}




















export function clearLocalStorage() {
  try {
    localStorage.removeItem(KEY);
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
}
