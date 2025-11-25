import { Link } from 'react-router-dom';

export function QuizResultCard({ quiz }) {
  const { result } = quiz;
  const date = result.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A';

  return (
    <article className="result-card">
      <h2>
        <Link to={`/quiz/${quiz.id}`}>{result.title}</Link>
      </h2>
      
      <p className="result-description">{result.description}</p>
      
      <div className="result-meta">
        <span className="score-badge">
          Score: {result.correct} / {result.total} ({result.percentage}%)
        </span>
        <span className="date-text">{date}</span>
      </div>
    </article>
  );
}