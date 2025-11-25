import { Routes, Route } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import MainMenu from './pages/MainMenu';
import TakeQuiz from './pages/TakeQuiz';
import Results from './pages/Results';
import CreateEditQuiz from './pages/CreateEditQuiz';
import Footer from './components/Footer'

function App() {
  return (
    <QuizProvider>
      <div className="container">
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/quiz/:id" element={<TakeQuiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/create" element={<CreateEditQuiz />} />
          <Route path="/edit/:id" element={<CreateEditQuiz />} /> 
        </Routes>
      </div>
      <Footer />
    </QuizProvider>
  );
}

export default App;
