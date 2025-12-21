import { DropDownMenu } from '../components/DropDownMenu'

export function QuizCard({ quiz, navigate, onDelete }) {
  const handleCardClick = () => {
    navigate(`/quizmunism/quiz/${quiz.id}`);
  };

  return (
    <div className="quiz-card-item" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>{quiz.title || 'Untitled Quiz'}</h3>
        <p>{quiz.questions?.length || 0} Questions</p>
      </div>

      <DropDownMenu quizId={quiz.id} onDelete={onDelete}></DropDownMenu>

    </div>
  );
}