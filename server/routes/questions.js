const express = require('express');
const { query, validationResult } = require('express-validator');

const router = express.Router();

// Generate random number within range
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate decimal number
const randomDecimal = (min, max, decimals = 1) => {
  const num = Math.random() * (max - min) + min;
  return parseFloat(num.toFixed(decimals));
};

// Generate addition question
const generateAddition = (difficulty) => {
  let num1, num2;
  switch (difficulty) {
    case 'easy':
      num1 = randomNumber(1, 9);
      num2 = randomNumber(1, 9);
      break;
    case 'medium':
      num1 = randomNumber(10, 99);
      num2 = randomNumber(10, 99);
      break;
    case 'hard':
      num1 = randomDecimal(10, 999, 1);
      num2 = randomDecimal(10, 999, 1);
      break;
    default:
      num1 = randomNumber(1, 99);
      num2 = randomNumber(1, 99);
  }
  return {
    question: `${num1} + ${num2} = ?`,
    answer: parseFloat((num1 + num2).toFixed(1)),
    operator: '+'
  };
};

// Generate subtraction question
const generateSubtraction = (difficulty) => {
  let num1, num2;
  switch (difficulty) {
    case 'easy':
      num1 = randomNumber(5, 20);
      num2 = randomNumber(1, num1);
      break;
    case 'medium':
      num1 = randomNumber(50, 200);
      num2 = randomNumber(10, num1);
      break;
    case 'hard':
      num1 = randomDecimal(100, 1000, 1);
      num2 = randomDecimal(10, num1, 1);
      break;
    default:
      num1 = randomNumber(10, 100);
      num2 = randomNumber(1, num1);
  }
  return {
    question: `${num1} - ${num2} = ?`,
    answer: parseFloat((num1 - num2).toFixed(1)),
    operator: '-'
  };
};

// Generate multiplication question
const generateMultiplication = (difficulty) => {
  let num1, num2;
  switch (difficulty) {
    case 'easy':
      num1 = randomNumber(2, 9);
      num2 = randomNumber(2, 9);
      break;
    case 'medium':
      num1 = randomNumber(5, 20);
      num2 = randomNumber(3, 12);
      break;
    case 'hard':
      num1 = randomNumber(10, 50);
      num2 = randomNumber(10, 50);
      break;
    default:
      num1 = randomNumber(2, 12);
      num2 = randomNumber(2, 12);
  }
  return {
    question: `${num1} × ${num2} = ?`,
    answer: num1 * num2,
    operator: '×'
  };
};

// Generate division question
const generateDivision = (difficulty) => {
  let num1, num2, answer;
  switch (difficulty) {
    case 'easy':
      answer = randomNumber(2, 9);
      num2 = randomNumber(2, 9);
      num1 = answer * num2;
      break;
    case 'medium':
      answer = randomNumber(5, 20);
      num2 = randomNumber(3, 12);
      num1 = answer * num2;
      break;
    case 'hard':
      answer = randomNumber(10, 50);
      num2 = randomNumber(5, 20);
      num1 = answer * num2;
      break;
    default:
      answer = randomNumber(2, 12);
      num2 = randomNumber(2, 12);
      num1 = answer * num2;
  }
  return {
    question: `${num1} ÷ ${num2} = ?`,
    answer: answer,
    operator: '÷'
  };
};

// Generate questions based on mode and difficulty
const generateQuestions = (mode, difficulty, count = 10) => {
  const questions = [];
  const generators = {
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision
  };

  for (let i = 0; i < count; i++) {
    let questionData;
    
    if (mode === 'mixed') {
      const modes = Object.keys(generators);
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      questionData = generators[randomMode](difficulty);
    } else {
      questionData = generators[mode](difficulty);
    }

    questions.push({
      id: i + 1,
      ...questionData
    });
  }

  return questions;
};

// GET /api/questions - Generate questions
router.get(
  '/',
  [
    query('mode')
      .optional()
      .isIn(['addition', 'subtraction', 'multiplication', 'division', 'mixed'])
      .withMessage('Invalid mode'),
    query('difficulty')
      .optional()
      .isIn(['easy', 'medium', 'hard'])
      .withMessage('Invalid difficulty'),
    query('count')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Count must be between 1 and 50')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const mode = req.query.mode || 'mixed';
      const difficulty = req.query.difficulty || 'medium';
      const count = parseInt(req.query.count) || 10;

      const questions = generateQuestions(mode, difficulty, count);

      res.json({
        mode,
        difficulty,
        count,
        questions
      });
    } catch (error) {
      console.error('Question generation error:', error);
      res.status(500).json({ message: 'Error generating questions' });
    }
  }
);

// Validate answer
router.post('/validate', (req, res) => {
  try {
    const { questionId, userAnswer, correctAnswer } = req.body;
    
    if (questionId === undefined || userAnswer === undefined || correctAnswer === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const isCorrect = parseFloat(userAnswer) === parseFloat(correctAnswer);
    
    res.json({
      questionId,
      isCorrect,
      userAnswer,
      correctAnswer
    });
  } catch (error) {
    console.error('Answer validation error:', error);
    res.status(500).json({ message: 'Error validating answer' });
  }
});

module.exports = router;
