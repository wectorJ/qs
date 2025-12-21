export function OptionCreateEdit({qIndex, opt, optIndex, q, questions, setQuestions}) {


  const maxOptionTextLength = 50;
  
  const onOptionChange = (qIndex, optIndex, text) => {
    const updated = [...questions];

    if (updated[qIndex].answer === updated[qIndex].options[optIndex]) {
      updated[qIndex].answer = text;
    }

    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const onCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  
  const onRemoveOption = (qIndex, optIndex) => {
    const updated = [...questions];
    const removed = updated[qIndex].options[optIndex];

    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);

    if (updated[qIndex].answer === removed) {
      updated[qIndex].answer = '';
    }

    setQuestions(updated);
  };



  return(
    <div className="option">
      {/* correct answer */}
      <input 
        type="radio" 
        name={`correct-answer-${qIndex}`}
        checked={q.answer === opt && opt !== ''} 
        onChange={() => onCorrectAnswerChange(qIndex, opt)}
        disabled={opt === ''}
      />

      {/* Option Text */}
      <input 
        required
        type="text"
        className="option-text-input"
        placeholder={`Option ${optIndex + 1}`}
        value={opt}
        onChange={(e) => onOptionChange(qIndex, optIndex, e.target.value)}
        // maxLength={maxOptionTextLength}  

      />

      {/* X Button */}
      <button 
        type="button"
        className="delete-option-btn"
        onClick={() => onRemoveOption(qIndex, optIndex)}
        title="Delete this option"
        disabled={q.options.length <= 1} 
      >
        X
      </button>
    </div>
  );
}