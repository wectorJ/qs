import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import '../styles/mainMenu.css'; // We will update this CSS below

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
          <h1 className="menu-title">My Quizzes</h1>
          <Link to="/create">
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

        {/* Link to Results remains at the bottom */}
        <div style={{marginTop: '30px'}}>
            <Link to="/results" className="secondary-link">View Past Results</Link>
        </div>

      </div>
    </div>
  );
}

// Sub-component for the Card to handle Dropdown state independently
function QuizCard({ quiz, navigate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevents starting the quiz
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(quiz.id);
    setShowMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    alert("Edit functionality coming soon!"); 
    // You would navigate to `/edit/${quiz.id}` here
    setShowMenu(false);
  };

  return (
    <div className="quiz-card-item" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>{quiz.title || 'Untitled Quiz'}</h3>
        <p>{quiz.questions?.length || 0} Questions</p>
      </div>

      {/* The Three Dots Menu Button */}
      <div className="menu-dots-wrapper">
        <button className="dots-btn" onClick={toggleMenu}>
          &#8942; {/* HTML Entity for vertical dots */}
        </button>

        {showMenu && (
          <div className="dropdown-menu">
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete} className="delete-option">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}