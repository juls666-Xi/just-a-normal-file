export interface User {
  id: string;
  username: string;
}

export interface Question {
  id: number;
  question: string;
  answer: number;
  operator: string;
}

export interface QuizResult {
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  difficulty: string;
  mode: string;
}

export interface Score {
  _id: string;
  userId: string;
  username: string;
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  difficulty: string;
  mode: string;
  date: string;
}

export interface LeaderboardEntry {
  rank: number;
  _id: string;
  username: string;
  score: number;
  accuracy: number;
  totalTime: number;
  date: string;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Mode = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';
