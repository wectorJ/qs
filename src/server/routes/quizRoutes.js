const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

const { body, param, validationResult } = require('express-validator');

// middleware for validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

console.log('Loaded quizController:', quizController);

router.get('/', quizController.getQuizzes);

// validation for DELETE a quiz
router.delete('/:id', 
    param('id').isInt().withMessage('Invalid quiz ID'),
    validate,
    quizController.deleteQuiz
);

// validation for CREATE a quiz
router.post('/',
  body('title')
    .notEmpty().withMessage('Title is required'),
  body('questions')
    .isArray({ min: 1 }).withMessage('At least one question required'),
  body('questions.*.question')
    .notEmpty().withMessage('Question text required'),
  body('questions.*.answer')
    .notEmpty().withMessage('Answer required'),
  validate,
  quizController.createQuiz
);

// validation for UPDATE a quiz
router.put('/:id',
  param('id').isInt().withMessage('Invalid quiz ID'),
  body('title').optional().isLength({ min: 3, max: 100 }),
  body('questions').optional().isArray({ min: 1 }),
  validate,
  quizController.updateQuiz
);

// validation for UPDATE quiz result
router.put('/:id/result',
  param('id').isInt().withMessage('Invalid quiz ID'),
  body('result').notEmpty().withMessage('Result data required'),
  validate,
  quizController.updateQuizResult
);

module.exports = router;