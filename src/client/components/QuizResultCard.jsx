import { Link } from 'react-router-dom';

export function QuizResultCard({ quiz }) {
  const { result } = quiz;
  const date = result.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A';

  return (
    <article className="result-card">
      <h2>
        <Link to={`/quizmunism/quiz/${quiz.id}`}>{result.title}</Link>
      </h2>
      
      <p className="result-description">{result.description}</p>
      
      <div className="result-meta">
        <div className="result-meta-top">
          <span className="score-badge">
            Score: {result.correct} / {result.total} ({result.percentage}%) 
          </span>
          <span className="date-text">{date}</span>
        </div>

        { result.percentage === 100 ? ( 
          <span className="score-message perfect" title="Perfect score">
            Party is proud of our work, comrade!
          </span>
        ) : ( 
          <span className="score-message imperfect" title="Not a perfect score">
            Party is disappointed. Do better, comrade.
          </span>
        ) }
      </div>
    </article>
  );
}