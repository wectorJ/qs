import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import MainMenu from './pages/MainMenu';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import ManageQuizzes from './pages/ManageQuizzes';
import CreateQuiz from './pages/CreateQuiz';
import Footer from './components/Footer';

function App() {
  return (
    <QuizProvider>
      <Router>
        <div className="container">
           <Routes>
             <Route path="/" element={<MainMenu />} />
             <Route path="/quiz/:id" element={<TakeQuiz />} />
             <Route path="/results" element={<Results />} />
             <Route path="/manage" element={<ManageQuizzes />} />
             <Route path="/create" element={<CreateQuiz />} />
           </Routes>
        </div>
        <Footer />
      </Router>
    </QuizProvider>
  );
}

export default App;