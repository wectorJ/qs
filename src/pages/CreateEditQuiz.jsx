import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import '../styles/createQuiz.css';

export default function CreateQuiz() {
  const { id } = useParams(); // Get the id from the url for editing page
  const { addNewQuiz, quizzes, updateQuiz } = useQuizzes(); // get methods forom QuizContext (Formally known as localStorageManager) 
  const navigate = useNavigate();

  // useMemo, stable reference of the default state
  const initialQuestionState = useMemo(() => ([
    { question: '', options: ['', ''], answer: '' }
  ]), []);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(initialQuestionState);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect to Load Quiz Data for Editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const quizToEdit = quizzes.find(q => String(q.id) === String(id));
      
      if (quizToEdit) {
        setTitle(quizToEdit.title || '');
        setDescription(quizToEdit.description || '');
        
        // Use a deep copy of questions to ensure state integrity
        const questionsToLoad = quizToEdit.questions && quizToEdit.questions.length > 0
            ? quizToEdit.questions
            : initialQuestionState; 
            
        setQuestions(JSON.parse(JSON.stringify(questionsToLoad)));
      } else {
        alert("Quiz not found!");
        navigate('/'); 
      }
    } else {
        setIsEditing(false);
        // Reset state for new quiz creation
        setTitle('');
        setDescription('');
        setQuestions(initialQuestionState);
    }
    setLoading(false);
  }, [id, quizzes, navigate, initialQuestionState]);

  // Question creation handlers

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
  

  // State change when creating or editing

  const handleOptionChange = (qIndex, optIndex, text) => {
    const updated = [...questions];
    
    // If the text of the selected correct answer is changed, update the answer field too.
    if (updated[qIndex].answer === questions[qIndex].options[optIndex]) {
      updated[qIndex].answer = text;
    }
    updated[qIndex].options[optIndex] = text;
    setQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answer = value;
    setQuestions(updated);
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validSubmit()){
      return false; 
    }

    const quizData = { title, description, questions };

    if (isEditing) {
      updateQuiz(id, quizData);
      alert(`Quiz "${title}" updated successfully!`);
    } else {
      addNewQuiz(quizData);
      alert(`New quiz "${title}" created successfully!`);
    }

    navigate('/'); 
  };

  const validSubmit = () => {
    // Validate submition
    // title
    if (!title.trim()) { alert('Please enter a quiz title'); return false}

    // questions text(does every question text exists)
    if(
      questions.forEach( (question) => {
          if (!question.question.trim()) return false;
        }
      )
    ) { alert('Please fill out every question text'); return false; }
  
    // questions text(is every question text valid)
    if(
      questions.forEach( (question) => {
        // validation goes here, but for now we do not care about it
        return true;
      }
    )
    ) { alert('Question text is not valid'); return false;}

    // every question has an answer
    if(
      questions.forEach( (question) => {
        if(!question.answer) return true;
      }
    )
    ) { alert('Please check every question answer'); return false;}

    return true;
  }
  
  if (loading) return (
    <div className="create-quiz-container">
        <h2>Loading Quiz...</h2>
    </div>
  );

  return (
    <div className="create-quiz-container">
      <h2>{isEditing ? `Edit Quiz: ${title}` : 'Create a New Quiz'}</h2>
      
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
                    disabled={q.options.length <= 2} // Prevent deletion if only 2 options remain
                >
                    X
                </button>
              </div>
            ))}
            
            <div className="question-actions">
                <button type="button" className="btn-sm" onClick={() => addOption(qIndex)}>+ Add Option</button>
                <button type="button" className="btn-sm btn-remove" onClick={() => removeQuestion(qIndex)} disabled={questions.length <= 1}>Remove Question</button>
            </div>
          </fieldset>
        ))}

        <button type="button" className="btn-add-question" onClick={addQuestion}>+ Add New Question</button>
        
        <br/>
        <button type="submit" className="btn-save">{isEditing ? 'Save Changes' : 'Save Quiz'}</button>
        <Link to="/"><button type="button" className="btn-cancel">Cancel</button></Link>
      </form>
    </div>
  );
}