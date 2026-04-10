import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { scoresAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Gamepad2,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';
import type { Score } from '@/types';
import { toast } from 'sonner';

interface UserStats {
  totalGames: number;
  overallAccuracy: number;
  averageScore: number;
  highestScore: number;
  totalCorrect: number;
  totalQuestions: number;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, historyRes] = await Promise.all([
        scoresAPI.getStats(),
        scoresAPI.getHistory()
      ]);
      setStats(statsRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'addition': return '+';
      case 'subtraction': return '−';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '★';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
          {user?.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.username}</h1>
          <p className="text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              {stats?.highestScore || 0} Best
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Gamepad2 className="h-3 w-3" />
              {stats?.totalGames || 0} Games
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto" />
            ) : (
              <div className="text-2xl font-bold">{stats?.highestScore || 0}</div>
            )}
            <div className="text-xs text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto" />
            ) : (
              <div className="text-2xl font-bold">{stats?.overallAccuracy || 0}%</div>
            )}
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto" />
            ) : (
              <div className="text-2xl font-bold">{stats?.averageScore || 0}</div>
            )}
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Gamepad2 className="h-6 w-6 text-primary mx-auto mb-2" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalGames || 0}</div>
            )}
            <div className="text-xs text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats & History */}
      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="history">Game History</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Statistics
              </CardTitle>
              <CardDescription>Your overall performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-primary" />
                        <span className="font-medium">Total Correct</span>
                      </div>
                      <div className="text-3xl font-bold">{stats.totalCorrect}</div>
                      <div className="text-sm text-muted-foreground">answers</div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="font-medium">Questions Attempted</span>
                      </div>
                      <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                      <div className="text-sm text-muted-foreground">total</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Accuracy</span>
                        <span className="font-medium">{stats.overallAccuracy}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${stats.overallAccuracy}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span>Personal Best</span>
                      </div>
                      <span className="text-2xl font-bold text-primary">{stats.highestScore}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No stats available yet</p>
                  <p className="text-sm text-muted-foreground">Play some games to see your statistics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Games
              </CardTitle>
              <CardDescription>Your last 50 games</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No games played yet</p>
                  <p className="text-sm text-muted-foreground">Start playing to see your history</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((game) => (
                    <div
                      key={game._id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                    >
                      {/* Mode & Difficulty */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                        {getModeIcon(game.mode)}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold capitalize">{game.mode}</span>
                          <Badge className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                            {game.difficulty}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(game.date).toLocaleDateString()} • {game.totalTime}s
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-right">
                          <div className="font-bold text-lg">{game.score}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <div className={`font-bold ${game.accuracy >= 80 ? 'text-green-600' : game.accuracy >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {game.accuracy}%
                          </div>
                          <div className="text-xs text-muted-foreground">accuracy</div>
                        </div>
                        <div className="text-right hidden md:block">
                          <div className="font-bold">{game.correctAnswers}/{game.totalQuestions}</div>
                          <div className="text-xs text-muted-foreground">correct</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
