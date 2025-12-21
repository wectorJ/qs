import { useQuizzes } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { QuizResultCard } from '../components/QuizResultCard'
import '../styles/results.css'; // Import the new CSS

export default function Results() {
  const { quizzes } = useQuizzes();
  const navigate = useNavigate();
  
  // Filter for quizzes that have a result property
  const finishedQuizzes = quizzes.filter(q => q.result);

  return (
    <div className="results-container">
      <div className="results-box">
        
        {/* The "Menu" literal link for consistency */}
        <div 
          className="menu-literal-link"
          onClick={() => window.location.href = "https://youtu.be/dQw4w9WgXcQ?si=ikjNhtlICjVDam4U"}
        >
          Menu
        </div>

        <div className="results-header">
          <h1 className="results-title">Your Results</h1>
        </div>

        <div className="results-list">
          {finishedQuizzes.length === 0 ? (
            <div className="empty-state">
              <p>No quizzes done yet :(</p>
              <p style={{fontSize: '0.9rem'}}>Go take a quiz and come back!</p>
            </div>
          ) : (
            finishedQuizzes.map(quiz => (
              <QuizResultCard key={quiz.id} quiz={quiz} />
            ))
          )}
        </div>

        <div className="back-btn-container">
          <button className="back-btn" onClick={() => navigate('/quizmunism/')}>
            Back to Menu
          </button>
        </div>

      </div>
    </div>
  );
}

