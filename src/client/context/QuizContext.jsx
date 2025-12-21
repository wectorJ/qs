import { createContext, useState, useEffect, useContext } from 'react';
import { useAlert } from '../components/AlertProvider';

const QuizContext = createContext();
const BASE_URL = 'http://localhost:5000/api/quizzes';

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const { showAlert } = useAlert();

  // Shared function to fetch quizzes from backend
  const fetchQuizzes = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setQuizzes(data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  // initial load
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // update after backend change
  const refreshQuizzes = () => {
    fetchQuizzes();
  };

  const updateQuizResult = async (id, resultData) => {
    try {
        const res = await fetch(`${BASE_URL}/${id}/result`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: resultData })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // Update local state
      setQuizzes(prev => prev.map(q => {
          if (String(q.id) === String(id)) {
            return { ...q, result: resultData };
        }
        return q;
      }));
    } catch (err) {
      console.error("Error saving quiz result:", err);
    }
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
            showAlert("Quiz deleted successfully", [{ label: "OK", onClick: () => {} }]);
            refreshQuizzes();
          } catch (err) {
            showAlert("Oh no! Quiz deletion failed", [{ label: "OK", onClick: () => {} }]);
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