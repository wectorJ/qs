export function QuestionCreateEdit({ qIndex, q, questions, setQuestions }) {

  const onQuestionTextChange = (index, text) => {
    const updated = [...questions];
    updated[index].question = text;
    setQuestions(updated);
  };

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

  const onAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
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

  const onRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };



  return (
    <div className='question-create-edit-card'>
      <fieldset className="question-fieldset">
        <legend>Question {qIndex + 1}</legend>

        {/* question Text */}
        <input 
          required
          type="text" 
          className="question-input"
          placeholder="Enter question text"
          value={q.question}
          onChange={(e) => onQuestionTextChange(qIndex, e.target.value)}
        />

        <p className="options-label">Options (Select the radio button for the correct answer):</p>

        {/* Options */}
        {q.options.map((opt, optIndex) => (
          <div key={optIndex} className="option-row">

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
        ))}

        {/* Buttons for add/remove */}
        <div className="question-actions">
          <button 
            type="button" 
            className="btn-sm"
            onClick={() => onAddOption(qIndex)}
          >
            + Add Option
          </button>

          <button 
            type="button" 
            className="btn-sm btn-remove"
            onClick={() => onRemoveQuestion(qIndex)}
          >
            Remove Question
          </button>
        </div>

      </fieldset>
    </div>
  );
}
