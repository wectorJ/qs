const Quiz = require('../models/Quiz');

// get all quizzes
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.log("Error fetching quizzes:");
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// create a new quiz
exports.createQuiz = async (req, res) => {
  const quiz = new Quiz({
    id: Date.now(), // unique ID based on timestamp
    title: req.body.title,
    description: req.body.description,
    questions: req.body.questions
  });

  try {
    const newQuiz = await quiz.save();
    console.log("Quiz created:", newQuiz);
    res.status(201).json(newQuiz);
  } catch (err) {
    console.log("Error creating quiz:");
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// delete a quiz
exports.deleteQuiz = async (req, res) => {
  try {
    await Quiz.findOneAndDelete({ id: req.params.id });
    console.log("Quiz deleted with id:", req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.log("Error deleting quiz:");
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// update a quiz
exports.updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { id: req.params.id },
      { 
        title: req.body.title,
        description: req.body.description,
        questions: req.body.questions
      },
      { new: true } // return the updated document
    );
    console.log("Quiz updated:", updatedQuiz);
    res.json(updatedQuiz);
  } catch (err) {
    console.log("Error updating quiz:");
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// save quiz result
exports.updateQuizResult = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { id: req.params.id },
      { result: req.body.result },
      { new: true }
    );
    console.log("Quiz result saved for id:", req.params.id);
    res.json(updatedQuiz);
  } catch (err) {
    console.log("Error saving quiz result:");
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};