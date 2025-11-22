import { createContext, useState, useEffect, useContext } from 'react';
import { useAlert } from '../components/AlertProvider';
import quizDataRaw from './quises_data.json'; 

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    const storedData = localStorage.getItem('QuizesData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setQuizzes(parsed.quizes || []);
      } catch (e) {
        console.error("Error parsing local storage", e);
        setQuizzes(quizDataRaw.quizes || []); 
      }
    } else {
      setQuizzes(quizDataRaw.quizes || []); 
    }
  }, []);

  const saveQuizzes = (updatedQuizzes) => {
    setQuizzes(updatedQuizzes);
    localStorage.setItem('QuizesData', JSON.stringify({ quizes: updatedQuizzes }));
  };

  const updateQuizResult = (id, resultData) => {
    const updated = quizzes.map(q => {
      if (String(q.id) === String(id)) {
        return { ...q, result: resultData };
      }
      return q;
    });
    saveQuizzes(updated);
  };

  const addNewQuiz = (newQuizData) => {
    const maxId = quizzes.reduce((max, q) => Math.max(max, Number(q.id) || 0), 0);
    const newQuiz = {
      ...newQuizData,
      id: maxId + 1, // new ID for a quiz
      result: null
    };
    
    const updated = [...quizzes, newQuiz];
    saveQuizzes(updated);
  };

  const deleteQuiz = (id) => {
    showAlert(
      "Are you sure?",
      [
        { label: "Yes", onClick: () => { 
          const updated = quizzes.filter(q => String(q.id) !== String(id));
          saveQuizzes(updated);
        }},
        { label: "No more I am", onClick: () => {} },
      ]
    )
  };

  const updateQuiz = (id, quizData) => {
    const updated = quizzes.map(q => {
      if (String(q.id) === String(id)) {
        return {id,  ...quizData};
      }
      return q;
    });
    saveQuizzes(updated);
  }

  return (
    <QuizContext.Provider value={{ quizzes, updateQuizResult, addNewQuiz, deleteQuiz,  updateQuiz}}>
        {children}
    </QuizContext.Provider>
  );
};

export const useQuizzes = () => useContext(QuizContext);