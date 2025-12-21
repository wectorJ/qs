import { Link, useNavigate } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard'
import '../styles/mainMenu.css';

export default function MainMenu() {
  const { quizzes, deleteQuiz } = useQuizzes();
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="menu-box extended-box">
        
        <div 
          className="menu-literal-link"
          onClick={() => window.location.href = "https://youtu.be/dQw4w9WgXcQ?si=ikjNhtlICjVDam4U"}
        >
          Menu
        </div>

        <div className="header-row">
          <h1 className="menu-title">Our Quizzes</h1>
          <Link to="/quizmunism/create">
            <button className="create-btn">+ New Quiz</button>
          </Link>
        </div>

        <div className="quiz-grid">
          {quizzes.length === 0 ? (
            <p className="empty-state">No quizzes yet. Click "+ New Quiz" to create one!</p>
          ) : (
            quizzes.map((quiz) => (
              <QuizCard 
                key={quiz.id} 
                quiz={quiz} 
                navigate={navigate} 
                onDelete={deleteQuiz} 
              />
            ))
          )}
        </div>

        {/* results remains at the bottom */}
        <div style={{marginTop: '30px'}}>
            <Link to="/quizmunism/results" className="secondary-link">View Past Results</Link>
        </div>

      </div>
    </div>
  );
}