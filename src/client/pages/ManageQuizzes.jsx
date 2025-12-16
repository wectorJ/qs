import { Link } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';

export default function ManageQuizzes() {
  const { quizzes } = useQuizzes();

  return (
    <div className="container">
      <h2>Manage Your Quizzes</h2>
      <p>Here you can edit or delete existing quizzes.</p>
      
      <div id="quiz-list">
        {quizzes.length === 0 ? (
          <p>No quizzes to manage.</p>
        ) : (
          quizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong>{quiz.title}</strong>
                <span style={{ marginLeft: '10px', color: '#666' }}>
                  ID: {quiz.id}
                </span>
              </div>
              
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/">
          <button>Back to Main Menu</button>
        </Link>
      </div>
    </div>
  );
}