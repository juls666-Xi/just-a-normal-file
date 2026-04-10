const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  accuracy: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  totalTime: {
    type: Number,
    required: true,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    default: 'mixed'
  },
  mode: {
    type: String,
    enum: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
    default: 'mixed'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for leaderboard queries
scoreSchema.index({ score: -1 });
scoreSchema.index({ date: -1 });

module.exports = mongoose.model('Score', scoreSchema);
