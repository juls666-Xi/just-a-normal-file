import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (username: string, password: string) =>
    api.post('/auth/register', { username, password }),
  
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  getMe: () =>
    api.get('/auth/me')
};

// Questions API
export const questionsAPI = {
  getQuestions: (mode?: string, difficulty?: string, count?: number) =>
    api.get('/questions', { params: { mode, difficulty, count } }),
  
  validateAnswer: (questionId: number, userAnswer: number, correctAnswer: number) =>
    api.post('/questions/validate', { questionId, userAnswer, correctAnswer })
};

// Scores API
export const scoresAPI = {
  saveScore: (result: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    totalTime: number;
    difficulty: string;
    mode: string;
  }) => api.post('/scores', result),
  
  getHistory: () =>
    api.get('/scores/history'),
  
  getBestScores: () =>
    api.get('/scores/best'),
  
  getStats: () =>
    api.get('/scores/stats')
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: (sortBy?: string, limit?: number, period?: string) =>
    api.get('/leaderboard', { params: { sortBy, limit, period } }),
  
  getUserRank: (userId: string) =>
    api.get(`/leaderboard/rank/${userId}`)
};

export default api;
