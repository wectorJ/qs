import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import { useAlert } from '../components/AlertProvider';
import '../styles/takeQuiz.css';

export default function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateQuizResult } = useQuizzes();

  const { showAlert } = useAlert();

  
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
   const found = quizzes.find(q => String(q.id) === String(id));
   setQuiz(found);

    // If result exists (re-visiting a completed quiz)
    if (found?.result) {
        // setSubmitted(true);
        setScore({ correct: found.result.correct, total: found.result.total });
    }
  }, [id, quizzes]);

  if (!quiz) return <div>Loading or Quiz not found...</div>;

  const handleOptionChange = (questionIndex, value) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    if (Object.keys(answers).length !== quiz.questions.length) {
        showAlert("Please answer all questions before submitting.", [
          { label: "Ok", onClick: () => {} }
        ]); 
        return;
    }

    // Score Calculation
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.answer) correctCount++;
    });

    const total = quiz.questions.length;
    const percentage = total ? Math.round((correctCount / total) * 100) : 0;
    
    // Create Result Object
    const resultEntry = {
      quizId: quiz.id,
      title: quiz.title,
      description: quiz.description,
      correct: correctCount,
      total: total,
      percentage: percentage,
      completedAt: new Date().toISOString(),
    };

    // Save and Update State
    updateQuizResult(quiz.id, resultEntry);
    setScore({ correct: correctCount, total });
    setSubmitted(true);
  };
  
  // Helper to determine the class for visual feedback after submission
  const getOptionClass = (qIndex, opt) => {
      if (!submitted) return '';
      
      const isCorrectOption = opt === quiz.questions[qIndex].answer;
      const isUserAnswer = answers[qIndex] === opt;
      
      if (isCorrectOption) {
          return 'correct-answer';
      }
      if (isUserAnswer && !isCorrectOption) {
          return 'incorrect-answer';
      }
      return '';
  }


  return (
    <div className="quiz-container">
        <div className={`quiz-box ${submitted ? 'submitted' : ''}`}> 
            
            {/* The "Menu" link */}
            <div 
                className="menu-literal-link"
                onClick={() => navigate('/')}
            >
                Menu
            </div>
            
            <div className="quiz-header">
                <h2>{quiz.title}</h2>
                <p>{quiz.description}</p>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()}>
                {quiz.questions.map((q, index) => (
                  <fieldset key={index} className="quiz-question">
                    <legend>{index + 1}. {q.question}</legend>
                    {q.options.map((opt, optIndex) => (
                      <label 
                            key={optIndex} 
                            // Apply highlighting class
                            className={`quiz-option ${getOptionClass(index, opt)}`} 
                        >
                        <input 
                          type="radio" 
                          name={`question-${index}`} 
                          value={opt}
                          checked={answers[index] === opt}
                          onChange={() => handleOptionChange(index, opt)}
                          disabled={submitted}
                        />
                        {opt}
                      </label>
                    ))}
                  </fieldset>
                ))}
        
                {!submitted ? (
                  <button type="submit" className="submit-btn" onClick={handleSubmit}>Submit Quiz</button>
                ) : (
                  <div className="quiz-result">
                    <h3>You scored {score.correct} out of {score.total}!</h3>
                        <p style={{marginBottom: '20px'}}>Your result has been saved.</p>
                    <button onClick={() => navigate('/')}>Back to Menu</button>
                  </div>
                )}
            </form>
        </div>
    </div>
  );
}