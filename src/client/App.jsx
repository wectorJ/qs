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
          <Route path="/quizmunism" element={<MainMenu />} />
          <Route path="/quizmunism/quiz/:id" element={<TakeQuiz />} />
          <Route path="/quizmunism/results" element={<Results />} />
          <Route path="/quizmunism/create" element={<CreateEditQuiz />} />
          <Route path="/quizmunism/edit/:id" element={<CreateEditQuiz />} /> 
        </Routes>
      </div>
      <Footer />
    </QuizProvider>
  );
}

export default App;
