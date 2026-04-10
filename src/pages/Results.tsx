import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { scoresAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Share2,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface ResultState {
  score: number;
  accuracy: number;
  totalQuestions: number;
  correctAnswers: number;
  totalTime: number;
  difficulty: string;
  mode: string;
}

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const result = location.state as ResultState;

  useEffect(() => {
    if (!result) {
      navigate('/');
      return;
    }

    // Auto-save score if authenticated
    if (isAuthenticated && !isSaved) {
      saveScore();
    }
  }, [result, navigate, isAuthenticated]);

  const saveScore = async () => {
    if (!result || isSaving || isSaved) return;

    try {
      setIsSaving(true);
      await scoresAPI.saveScore({
        score: result.score,
        accuracy: result.accuracy,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        totalTime: result.totalTime,
        difficulty: result.difficulty,
        mode: result.mode
      });
      setIsSaved(true);
      toast.success('Score saved successfully!');
    } catch (error) {
      toast.error('Failed to save score');
    } finally {
      setIsSaving(false);
    }
  };

  if (!result) return null;

  const { score, accuracy, totalQuestions, correctAnswers, totalTime, difficulty, mode } = result;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const averageTime = totalTime / totalQuestions;

  // Performance rating
  const getRating = () => {
    if (accuracy >= 90 && averageTime < 5) return { label: 'Excellent!', color: 'text-green-500', icon: <Award className="h-8 w-8" /> };
    if (accuracy >= 80) return { label: 'Great Job!', color: 'text-blue-500', icon: <Trophy className="h-8 w-8" /> };
    if (accuracy >= 60) return { label: 'Good Effort!', color: 'text-yellow-500', icon: <Zap className="h-8 w-8" /> };
    return { label: 'Keep Practicing!', color: 'text-orange-500', icon: <TrendingUp className="h-8 w-8" /> };
  };

  const rating = getRating();

  const formatMode = (m: string) => m.charAt(0).toUpperCase() + m.slice(1);
  const formatDifficulty = (d: string) => d.charAt(0).toUpperCase() + d.slice(1);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 ${rating.color}`}>
          {rating.icon}
        </div>
        <h1 className="text-4xl font-bold mb-2">{rating.label}</h1>
        <p className="text-muted-foreground">
          {formatMode(mode)} • {formatDifficulty(difficulty)} Difficulty
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">{score}</div>
            <div className="text-sm text-muted-foreground">Total Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">{totalTime}s</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">{correctAnswers}/{totalQuestions}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>How you performed in this quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Accuracy Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium">{accuracy}%</span>
                </div>
                <Progress value={accuracy} className="h-3" />
              </div>

              {/* Speed Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Average Time per Question</span>
                  <span className="font-medium">{averageTime.toFixed(1)}s</span>
                </div>
                <Progress 
                  value={Math.min((averageTime / 10) * 100, 100)} 
                  className="h-3"
                />
              </div>

              {/* Correct vs Incorrect */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                    <div className="text-sm text-green-600/70">Correct</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                    <div className="text-sm text-red-600/70">Incorrect</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
              <CardDescription>Question-by-question analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Quiz Mode</div>
                    <div className="text-sm text-muted-foreground">Type of questions</div>
                  </div>
                  <div className="text-right font-medium">{formatMode(mode)}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Difficulty Level</div>
                    <div className="text-sm text-muted-foreground">Complexity of questions</div>
                  </div>
                  <div className="text-right font-medium">{formatDifficulty(difficulty)}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Total Questions</div>
                    <div className="text-sm text-muted-foreground">Number of questions attempted</div>
                  </div>
                  <div className="text-right font-medium">{totalQuestions}</div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Success Rate</div>
                    <div className="text-sm text-muted-foreground">Correct answers percentage</div>
                  </div>
                  <div className={`text-right font-medium ${accuracy >= 70 ? 'text-green-600' : accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {accuracy}%
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <div>
                    <div className="font-medium">Time Efficiency</div>
                    <div className="text-sm text-muted-foreground">Seconds per question</div>
                  </div>
                  <div className="text-right font-medium">{averageTime.toFixed(2)}s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="flex-1">
          <Button className="w-full" size="lg">
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </Link>
        
        <Link to="/leaderboard" className="flex-1">
          <Button variant="outline" className="w-full" size="lg">
            <Trophy className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        </Link>

        <Button 
          variant="secondary" 
          className="flex-1" 
          size="lg"
          onClick={() => {
            navigator.clipboard.writeText(`I scored ${score} points with ${accuracy}% accuracy on Mental Math Quiz! Can you beat me?`);
            toast.success('Result copied to clipboard!');
          }}
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Result
        </Button>
      </div>

      {/* Save Status */}
      {isAuthenticated && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isSaved ? 'Score saved to your profile!' : isSaving ? 'Saving score...' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
