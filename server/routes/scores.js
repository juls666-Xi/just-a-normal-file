const express = require('express');
const { body, validationResult } = require('express-validator');
const Score = require('../models/Score');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Save score (protected route)
router.post(
  '/',
  authMiddleware,
  [
    body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
    body('accuracy').isFloat({ min: 0, max: 100 }).withMessage('Accuracy must be between 0 and 100'),
    body('totalQuestions').isInt({ min: 1 }).withMessage('Total questions must be at least 1'),
    body('correctAnswers').isInt({ min: 0 }).withMessage('Correct answers must be non-negative'),
    body('totalTime').isInt({ min: 0 }).withMessage('Total time must be non-negative'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard', 'mixed']),
    body('mode').optional().isIn(['addition', 'subtraction', 'multiplication', 'division', 'mixed'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { score, accuracy, totalQuestions, correctAnswers, totalTime, difficulty, mode } = req.body;

      const newScore = new Score({
        userId: req.user.userId,
        username: req.user.username,
        score,
        accuracy,
        totalQuestions,
        correctAnswers,
        totalTime,
        difficulty: difficulty || 'mixed',
        mode: mode || 'mixed'
      });

      await newScore.save();

      res.status(201).json({
        message: 'Score saved successfully',
        score: newScore
      });
    } catch (error) {
      console.error('Save score error:', error);
      res.status(500).json({ message: 'Error saving score' });
    }
  }
);

// Get user's score history (protected route)
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(50);

    res.json(scores);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Error fetching score history' });
  }
});

// Get user's best scores (protected route)
router.get('/best', authMiddleware, async (req, res) => {
  try {
    const bestScore = await Score.findOne({ userId: req.user.userId })
      .sort({ score: -1 })
      .limit(1);

    const bestAccuracy = await Score.findOne({ userId: req.user.userId })
      .sort({ accuracy: -1 })
      .limit(1);

    const fastestTime = await Score.findOne({ userId: req.user.userId, correctAnswers: { $gt: 5 } })
      .sort({ totalTime: 1 })
      .limit(1);

    res.json({
      bestScore: bestScore || null,
      bestAccuracy: bestAccuracy || null,
      fastestTime: fastestTime || null
    });
  } catch (error) {
    console.error('Get best scores error:', error);
    res.status(500).json({ message: 'Error fetching best scores' });
  }
});

// Get user's stats (protected route)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalGames = await Score.countDocuments({ userId: req.user.userId });
    
    const allScores = await Score.find({ userId: req.user.userId });
    
    const totalCorrect = allScores.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalQuestions = allScores.reduce((sum, s) => sum + s.totalQuestions, 0);
    const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    const averageScore = totalGames > 0 
      ? allScores.reduce((sum, s) => sum + s.score, 0) / totalGames 
      : 0;

    const highestScore = allScores.length > 0 
      ? Math.max(...allScores.map(s => s.score))
      : 0;

    res.json({
      totalGames,
      overallAccuracy: parseFloat(overallAccuracy.toFixed(2)),
      averageScore: parseFloat(averageScore.toFixed(2)),
      highestScore,
      totalCorrect,
      totalQuestions
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
