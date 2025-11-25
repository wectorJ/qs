import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import { useAlert } from '../components/AlertProvider';
import { QuestionCreateEdit } from '../components/QuestionCreateEdit';
import '../styles/createQuiz.css';


export default function CreateQuiz() {
  const { id } = useParams(); // Get the id from the url for editing page
  const { addNewQuiz, quizzes, updateQuiz } = useQuizzes(); // get methods forom QuizContext (Formally known as localStorageManager) 
  const navigate = useNavigate();

  const { showAlert } = useAlert();

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
        showAlert("Quiz not found", [
          { label: "Ok", onClick: () => { navigate('/'); } }
        ]); 
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validSubmit();
    if(!isValid) return;
    

    const quizData = { title, description, questions };

    if (isEditing) {
      showAlert(`Quiz "${title}" updated successfully!`, [
        { 
          label: "Ok", 
          onClick: () => { 
            updateQuiz(id, quizData); 
            navigate('/');
          } 
        }
      ]); 
    } else {
      showAlert(`New quiz "${title}" created successfully!`, [
        { 
          label: "Ok", 
          onClick: () => { 
            addNewQuiz(quizData); 
            navigate('/');
          } 
        }
      ]); 
    }
    
  };

  const validSubmit = async () => {
    // check title
    if (!isValidTittleText(title)) {
      await showAlert("Please enter a quiz title", [{ label: "Ok" }]);
      return false;
    }

    // check decsription
    if (!isValidDescriptionText(description)) {
      await showAlert("Description text is not valid", [{ label: "Ok" }]);
      return false;
    }
    
    // question text validation
    if (questions.some(q => !isValidQuestionText(q.question))) {
      await showAlert("Question text is not valid", [{ label: "Ok" }]);
      return false;
    }

    // check every question has text
    if (questions.some(q => !q.question || q.question.trim() === "")) {
      await showAlert("Please fill out every question text", [{ label: "Ok" }]);
      return false;
    }

    // check every question has an answer
    if (questions.some(q => !q.answer || q.answer.trim() === "")) {
      await showAlert("Please check every answer for every question", [{ label: "Ok" }]);
      return false;
    }

    return true;
  }

  const isValidQuestionText = (text) => {
    return text.trim().length > 0;
  }
  
  const isValidDescriptionText = (text) => {
    return text.trim().length > 0;
  }

  const isValidTittleText = (text) => {
    if(!text.trim()) return false;
    if(text.trim().length <= 0) return false;
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
            required
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
            required
            className="form-textarea"
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Short description..."
          />
        </div>

        <hr />

        {questions.map((q, qIndex) => (
          <QuestionCreateEdit
            key={qIndex}
            qIndex={qIndex}
            q={q}
            setQuestions={setQuestions}
            questions={questions}
          />
        ))}

        <button type="button" className="btn-add-question" onClick={addQuestion}>+ Add New Question</button>
        
        <br/>
        <button type="submit" className="btn-save">{isEditing ? 'Save Changes' : 'Save Quiz'}</button>
        <Link to="/"><button type="button" className="btn-cancel">Cancel</button></Link>
      </form>
    </div>
  );
}