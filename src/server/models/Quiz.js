const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({   // model for quiz questions
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
  value: { type: Number, default: 1 }
});

const QuizSchema = new mongoose.Schema({     // model for quizzes
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
});

module.exports = mongoose.model('Quiz', QuizSchema);