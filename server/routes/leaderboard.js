const express = require('express');
const { query, validationResult } = require('express-validator');
const Score = require('../models/Score');

const router = express.Router();

// Get global leaderboard
router.get(
  '/',
  [
    query('sortBy')
      .optional()
      .isIn(['score', 'accuracy', 'time', 'date'])
      .withMessage('Invalid sort field'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('period')
      .optional()
      .isIn(['all', 'daily', 'weekly', 'monthly'])
      .withMessage('Invalid period')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const sortBy = req.query.sortBy || 'score';
      const limit = parseInt(req.query.limit) || 20;
      const period = req.query.period || 'all';

      // Build date filter
      let dateFilter = {};
      const now = new Date();
      
      if (period === 'daily') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        dateFilter = { date: { $gte: startOfDay } };
      } else if (period === 'weekly') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        dateFilter = { date: { $gte: startOfWeek } };
      } else if (period === 'monthly') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        dateFilter = { date: { $gte: startOfMonth } };
      }

      // Build sort options
      let sortOptions = {};
      switch (sortBy) {
        case 'score':
          sortOptions = { score: -1, date: -1 };
          break;
        case 'accuracy':
          sortOptions = { accuracy: -1, score: -1 };
          break;
        case 'time':
          sortOptions = { totalTime: 1, score: -1 };
          break;
        case 'date':
          sortOptions = { date: -1 };
          break;
        default:
          sortOptions = { score: -1 };
      }

      // Get leaderboard with user aggregation for highest scores
      let leaderboard;
      
      if (sortBy === 'score') {
        // For score leaderboard, get each user's best score
        leaderboard = await Score.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$userId',
              username: { $first: '$username' },
              score: { $max: '$score' },
              accuracy: { $first: '$accuracy' },
              totalTime: { $first: '$totalTime' },
              totalQuestions: { $first: '$totalQuestions' },
              correctAnswers: { $first: '$correctAnswers' },
              date: { $first: '$date' }
            }
          },
          { $sort: sortOptions },
          { $limit: limit }
        ]);
      } else {
        // For other sorts, get individual scores
        leaderboard = await Score.find(dateFilter)
          .sort(sortOptions)
          .limit(limit)
          .select('username score accuracy totalTime totalQuestions correctAnswers date');
      }

      // Add rank to each entry
      const rankedLeaderboard = leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry
      }));

      res.json({
        sortBy,
        period,
        limit,
        totalEntries: rankedLeaderboard.length,
        leaderboard: rankedLeaderboard
      });
    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ message: 'Error fetching leaderboard' });
    }
  }
);

// Get user's rank
router.get('/rank/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's best score
    const userBestScore = await Score.findOne({ userId })
      .sort({ score: -1 });

    if (!userBestScore) {
      return res.json({ rank: null, message: 'No scores found for this user' });
    }

    // Count how many users have higher scores
    const higherScores = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          maxScore: { $max: '$score' }
        }
      },
      {
        $match: {
          maxScore: { $gt: userBestScore.score }
        }
      }
    ]);

    const rank = higherScores.length + 1;

    res.json({
      rank,
      bestScore: userBestScore.score,
      username: userBestScore.username
    });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ message: 'Error fetching user rank' });
  }
});

module.exports = router;
