import { useState } from 'react';

export function QuizCard({ quiz, navigate, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleCardClick = () => {
    navigate(`/quizmunism/quiz/${quiz.id}`);
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(quiz.id);
    setShowMenu(false);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    // Navigate to the edit route with the quiz ID
    navigate(`/quizmunism/edit/${quiz.id}`); 
    setShowMenu(false);
  };

  return (
    <div className="quiz-card-item" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>{quiz.title || 'Untitled Quiz'}</h3>
        <p>{quiz.questions?.length || 0} Questions</p>
      </div>

      <div className="menu-dots-wrapper">
        <button className="dots-btn" onClick={toggleMenu}>
          &#8942;
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