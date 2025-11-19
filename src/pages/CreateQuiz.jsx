import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import '../styles/createQuiz.css';

export default function CreateQuiz() {
  const { addNewQuiz } = useQuizzes();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [questions, setQuestions] = useState([
    { question: '', options: ['', ''], answer: '' }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', ''], answer: '' }]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleQuestionTextChange = (index, text) => {
    const updated = [...questions];
    updated[index].question = text;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, text) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = text;
    
    if (updated[qIndex].answer === questions[qIndex].options[optIndex]) {
       updated[qIndex].answer = text;
    }
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    const optionToRemove = updated[qIndex].options[optIndex];

    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);

    if (updated[qIndex].answer === optionToRemove) {
        updated[qIndex].answer = ''; 
    }

    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return alert('Please enter a quiz title');
    
    const isValid = questions.every(q => 
      q.question.trim() && 
      q.answer && 
      q.options.every(opt => opt.trim())
    );

    if (!isValid) {
      return alert('Please fill out all questions, options, and select a correct answer for each.');
    }

    addNewQuiz({
      title,
      description,
      questions
    });

    navigate('/'); 
  };

  return (
    <div className="create-quiz-container">
      <h2>Create a New Quiz</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Quiz Title:</label><br/>
          <input 
            type="text" 
            className="form-input"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Math Basics"
          />
        </div>

        <div className="form-group">
          <label>Description:</label><br/>
          <textarea 
            className="form-textarea"
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Short description..."
          />
        </div>

        <hr />

        {questions.map((q, qIndex) => (
          <fieldset key={qIndex} className="question-fieldset">
            <legend>Question {qIndex + 1}</legend>
            
            <input 
              type="text" 
              className="question-input"
              placeholder="Enter question text"
              value={q.question}
              onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
            />

            <p className="options-label">Options (Select the radio button for the correct answer):</p>
            
            {q.options.map((opt, optIndex) => (
              <div key={optIndex} className="option-row">
                {/* Radio Button */}
                <input 
                  type="radio" 
                  name={`correct-answer-${qIndex}`} 
                  checked={q.answer === opt && opt !== ''} 
                  onChange={() => handleCorrectAnswerChange(qIndex, opt)}
                  disabled={opt === ''}
                />

                {/* Text Input */}
                <input 
                  type="text"
                  className="option-text-input"
                  placeholder={`Option ${optIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                />

                {/* X Button */}
                <button 
                    type="button" 
                    className="delete-option-btn"
                    onClick={() => removeOption(qIndex, optIndex)}
                    title="Delete this option"
                >
                    X
                </button>
              </div>
            ))}
            
            <div className="question-actions">
                <button type="button" className="btn-sm" onClick={() => addOption(qIndex)}>+ Add Option</button>
                <button type="button" className="btn-sm btn-remove" onClick={() => removeQuestion(qIndex)}>Remove Question</button>
            </div>
          </fieldset>
        ))}

        <button type="button" className="btn-add-question" onClick={addQuestion}>+ Add New Question</button>
        
        <br/>
        <button type="submit" className="btn-save">Save Quiz</button>
        <Link to="/"><button type="button" className="btn-cancel">Cancel</button></Link>
      </form>
    </div>
  );
}