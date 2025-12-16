import { createContext, useState, useEffect, useContext } from 'react';
import { useAlert } from '../components/AlertProvider';

const QuizContext = createContext();
const BASE_URL = 'http://localhost:5000/api/quizzes';

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const { showAlert } = useAlert();

  // Fetch quizzes from backend
  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  // Helper to update local state after backend change
  const refreshQuizzes = () => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error refreshing quizzes:", err));
  };

  const updateQuizResult = (id, resultData) => {
    // Results are kept in local state only for now
    setQuizzes(prev => prev.map(q => {
      if (String(q.id) === String(id)) {
        return { ...q, result: resultData };
      }
      return q;
    }));
  };

  const addNewQuiz = async (newQuizData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuizData)
      });
      if (res.ok) {
        refreshQuizzes();
      }
    } catch (err) {
      console.error("Error adding quiz:", err);
    }
  };

  const deleteQuiz = (id) => {
    showAlert(
      "Are you sure?",
      [
        { label: "Yes", onClick: async () => { 
          try {
            await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
            refreshQuizzes();
          } catch (err) {
            console.error("Error deleting quiz:", err);
          }
        }},
        { label: "No more I am", onClick: () => {} },
      ]
    )
  };

  const updateQuiz = async (id, quizData) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizData)
      });
      if (res.ok) {
        refreshQuizzes();
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  }

  return (
    <QuizContext.Provider value={{ quizzes, updateQuizResult, addNewQuiz, deleteQuiz,  updateQuiz}}>
        {children}
    </QuizContext.Provider>
  );
};

export const useQuizzes = () => useContext(QuizContext);