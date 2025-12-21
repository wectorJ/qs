import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useQuizzes } from '../context/QuizContext';
import { useAlert } from '../components/AlertProvider';
import { QuestionCreateEdit } from '../components/CreateEdit/Question';
import { QuizTitleInput } from '../components/CreateEdit/QuizTitleInput';
import '../styles/createQuiz.css';
import { QuizDescriptionInput } from '../components/CreateEdit/QuizDescriptionInput';


export default function CreateQuiz() {
  const { id } = useParams(); // Get the id from the url for editing page
  const { addNewQuiz, quizzes, updateQuiz } = useQuizzes(); // get methods forom QuizContext
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

  const maxTittleLength = 50;
  const maxDescriptionLength = 400;

  // useEffect to Load Quiz Data for Editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const quizToEdit = quizzes.find(q => String(q.id) === String(id));
      
      if (quizToEdit) {
        setTitle(quizToEdit.title || '');
        setDescription(quizToEdit.description || '');
        
        const questionsToLoad = quizToEdit.questions && quizToEdit.questions.length > 0 ? quizToEdit.questions : initialQuestionState; 
            
        setQuestions(JSON.parse(JSON.stringify(questionsToLoad)));
      } else {
        showAlert("Quiz not found", [
          { label: "Ok", onClick: () => { navigate('/quizmunism/'); } }
        ]); 
      }
    } 

    else {
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

    const quizData = { title, description, questions };



    if (isEditing) {
      showAlert(`Quiz "${title}" updated successfully!`, [
        { 
          label: "Ok", 
          onClick: () => { 
            updateQuiz(id, quizData); 
            navigate('/quizmunism/');
          } 
        }
      ]); 
    } else {
      showAlert(`New quiz "${title}" created successfully!`, [
        { 
          label: "Ok", 
          onClick: () => { 
            addNewQuiz(quizData); 
            navigate('/quizmunism/');
          } 
        }
      ]); 
    }
    
  };

  
  if (loading) return (
    <div className="create-quiz-container">
        <h2>Loading Quiz...</h2>
    </div>
  );

  return (
    <div className="create-quiz-container">
      <h2>{isEditing ? `Edit Quiz: ${title}` : 'Create a New Quiz'}</h2>
      
      <form onSubmit={handleSubmit}>

        <QuizTitleInput title={title} setTitle={setTitle} maxTittleLength={maxTittleLength} />

        <QuizDescriptionInput description={description} setDescription={setDescription} maxDescriptionLength={maxDescriptionLength} />

        <hr />

        {/* Questions List */}
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
        <Link to="/quizmunism/"><button type="button" className="btn-cancel">Cancel</button></Link>
      </form>
    </div>
  );
}