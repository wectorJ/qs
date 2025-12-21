const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

console.log('Loaded quizController:', quizController);

router.get('/', quizController.getQuizzes);
router.post('/', quizController.createQuiz);
router.put('/:id', quizController.updateQuiz);
router.put('/:id/result', quizController.updateQuizResult);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;