import { OptionCreateEdit } from './Option.jsx';

export function QuestionCreateEdit({ qIndex, q, questions, setQuestions }) {

  const onQuestionTextChange = (index, text) => {
    const updated = [...questions];
    updated[index].question = text;
    setQuestions(updated);
  };

  const onAddOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
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
            <OptionCreateEdit
              qIndex={qIndex}
              opt={opt}
              optIndex={optIndex}
              q={q}
              questions={questions}
              setQuestions={setQuestions}
              />
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
