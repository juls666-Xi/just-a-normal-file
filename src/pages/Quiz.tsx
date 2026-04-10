import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { questionsAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import type { Question, Difficulty, Mode } from '@/types';
import { Timer, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface QuizState {
  mode: Mode;
  difficulty: Difficulty;
}

const Quiz: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode = 'mixed', difficulty = 'medium' } = (location.state as QuizState) || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer duration based on difficulty
  const getTimerDuration = () => {
    switch (difficulty) {
      case 'easy': return 8;
      case 'medium': return 10;
      case 'hard': return 12;
      default: return 10;
    }
  };

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await questionsAPI.getQuestions(mode, difficulty, 10);
        setQuestions(response.data.questions);
        setStartTime(Date.now());
        setTimeLeft(getTimerDuration());
      } catch (error) {
        toast.error('Failed to load questions');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [mode, difficulty]);

  // Focus input on question change
  useEffect(() => {
    if (!isLoading && !isAnswered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isLoading, isAnswered]);

  // Timer
  useEffect(() => {
    if (isLoading || isAnswered || quizComplete) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          handleTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isLoading, isAnswered, quizComplete]);

  const handleTimeout = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsAnswered(true);
    setIsCorrect(false);
    setStreak(0);
    
    // Play wrong sound
    playSound('wrong');
  }, []);

  const playSound = (type: 'correct' | 'wrong') => {
    const audio = new Audio();
    // Using data URI for simple beep sounds
    if (type === 'correct') {
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu8LdnGgU1kNbxz4AzBhxqv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XysWUeBjiS1/LNfi0GI33R8tOENAcdcO/r4phJDQxPqOXyxGUhBjqT1/PQfS4GI3/R8tSFNwYdcfDr4plHDAtQp+TwxmUgBDeOz/PShjYGHG3A7+SaSQ0LUqjl8sZmIAU2jc7z1YU1Bhxwv+zmm0gNC1Ko5fLFZSAFNo/M89CEMwYccLzs4ppIDQtRqOXyxGUgBTeOz/PShDMGHHC87OKbSA0LUqjl8sRlIAU2js3z0oQzBhxwvOzhmUgNC1Ko5fLDZSAFNo7N89CEMwYccLzr4ZhIDQtRqOXyw2UgBTeOzPPQhDMGHHC86+GYSA0LUqjl8sNlIAU3jszz0IQ==';
    } else {
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVanu8LdnGgU1kNbxz4AzBhxqv+zplkcODVGm5O+4ZSAEMYrO89GFNwYdcfDr4ZdJDQtPp+XysWUeBjiS1/LNfi0GI33R8tOENAcdcO/r4phJDQxPqOXyxGUhBjqT1/PQfS4GI3/R8tSFNwYdcfDr4plHDAtQp+TwxmUgBDeOz/PShjYGHG3A7+SaSQ0LUqjl8sZmIAU2jc7z1YU1Bhxwv+zmm0gNC1Ko5fLFZSAFNo/M89CEMwYccLzs4ppIDQtRqOXyxGUgBTeOz/PShDMGHHC87OKbSA0LUqjl8sRlIAU2js3z0oQzBhxwvOzhmUgNC1Ko5fLDZSAFNo7N89CEMwYccLzr4ZhIDQtRqOXyw2UgBTeOzPPQhDMGHHC86+GYSA0LUqjl8sNlIAU3jszz0IQ==';
    }
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (isAnswered || !userAnswer.trim()) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const currentQuestion = questions[currentIndex];
    const userNumAnswer = parseFloat(userAnswer);
    const correct = userNumAnswer === currentQuestion.answer;

    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate points: base 10 + streak bonus + time bonus
      const timeBonus = Math.ceil(timeLeft);
      const streakBonus = Math.min(newStreak * 2, 10);
      const points = 10 + streakBonus + timeBonus;
      
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      playSound('correct');
      toast.success(`+${points} points!`, { duration: 1000 });
    } else {
      setStreak(0);
      playSound('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
      setTimeLeft(getTimerDuration());
    } else {
      // Quiz complete
      setQuizComplete(true);
    }
  };

  const handleFinish = () => {
    const finalTotalTime = Math.floor((Date.now() - startTime) / 1000);
    const accuracy = Math.round((correctCount / questions.length) * 100);
    
    navigate('/results', {
      state: {
        score,
        accuracy,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        totalTime: finalTotalTime,
        difficulty,
        mode
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-muted-foreground">Great job finishing the quiz</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Total Score</div>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="text-3xl font-bold text-primary">{correctCount}/{questions.length}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleFinish} className="flex-1">
                View Results
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Quiz
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timerDuration = getTimerDuration();
  const timerProgress = (timeLeft / timerDuration) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-muted-foreground">Question </span>
            <span className="font-bold">{currentIndex + 1}</span>
            <span className="text-muted-foreground">/{questions.length}</span>
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-orange-500">
              <span className="text-lg">🔥</span>
              <span className="font-bold">{streak}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <span className="text-muted-foreground text-sm">Score: </span>
          <span className="font-bold text-primary">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progress} className="mb-8" />

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="pt-8 pb-8">
          {/* Timer */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span className="text-sm">Time Remaining</span>
              </div>
              <span className={`font-mono font-bold ${timeLeft <= 3 ? 'text-red-500' : ''}`}>
                {Math.ceil(timeLeft)}s
              </span>
            </div>
            <Progress 
              value={timerProgress} 
              className={`h-2 ${timeLeft <= 3 ? 'bg-red-100' : ''}`}
            />
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {currentQuestion?.question}
            </h2>
          </div>

          {/* Answer Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              ref={inputRef}
              type="number"
              step="0.1"
              placeholder="Your answer..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isAnswered}
              className="text-center text-2xl py-6"
              autoComplete="off"
            />

            {!isAnswered && (
              <Button 
                type="submit" 
                className="w-full"
                disabled={!userAnswer.trim()}
              >
                Submit Answer
              </Button>
            )}
          </form>

          {/* Feedback */}
          {isAnswered && (
            <div className="mt-6 space-y-4">
              <div className={`flex items-center justify-center gap-2 p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-bold text-lg">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6" />
                    <span className="font-bold text-lg">Incorrect</span>
                  </>
                )}
              </div>

              {!isCorrect && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="font-bold text-lg">{currentQuestion?.answer}</span>
                </div>
              )}

              <Button onClick={handleNext} className="w-full">
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finish Quiz
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyboard hint */}
      <p className="text-center text-sm text-muted-foreground">
        Press <kbd className="px-2 py-1 bg-muted rounded">Enter</kbd> to submit
      </p>
    </div>
  );
};

export default Quiz;
