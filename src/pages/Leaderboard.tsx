import React, { useEffect, useState } from 'react';
import { leaderboardAPI } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  Target, 
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import type { LeaderboardEntry } from '@/types';
import { toast } from 'sonner';

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('score');
  const [period, setPeriod] = useState('all');

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy, period]);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await leaderboardAPI.getLeaderboard(sortBy, 20, period);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      toast.error('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
      case 2:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200';
      case 3:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank against players worldwide
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Highest Score
                    </div>
                  </SelectItem>
                  <SelectItem value="accuracy">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Best Accuracy
                    </div>
                  </SelectItem>
                  <SelectItem value="time">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Fastest Time
                    </div>
                  </SelectItem>
                  <SelectItem value="date">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Most Recent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="daily">Today</SelectItem>
                  <SelectItem value="weekly">This Week</SelectItem>
                  <SelectItem value="monthly">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{leaderboard.length}</div>
            <div className="text-xs text-muted-foreground">Top Players</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {leaderboard[0]?.score || 0}
            </div>
            <div className="text-xs text-muted-foreground">Top Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {leaderboard.length > 0 
                ? Math.round(leaderboard.reduce((acc, entry) => acc + entry.accuracy, 0) / leaderboard.length)
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {leaderboard.length > 0
                ? Math.round(leaderboard.reduce((acc, entry) => acc + entry.totalTime, 0) / leaderboard.length)
                : 0}s
            </div>
            <div className="text-xs text-muted-foreground">Avg Time</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard List */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            {period === 'all' ? 'All time' : period === 'daily' ? "Today's" : period === 'weekly' ? "This week's" : "This month's"} best scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scores yet for this period</p>
              <p className="text-sm text-muted-foreground">Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry._id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-accent ${getRankStyle(entry.rank)}`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-10 flex justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{entry.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-right hidden sm:block">
                      <div className="font-bold">{entry.score}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="font-bold">{entry.accuracy}%</div>
                      <div className="text-xs text-muted-foreground">accuracy</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.totalTime}s</div>
                      <div className="text-xs text-muted-foreground">time</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex-shrink-0 hidden md:flex gap-1">
                    {entry.rank === 1 && (
                      <Badge variant="default" className="bg-yellow-500">
                        #1
                      </Badge>
                    )}
                    {entry.accuracy === 100 && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Perfect
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Rank */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            How to Climb the Ranks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Score Points</div>
                <div className="text-muted-foreground">Answer correctly and quickly for bonus points</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Maintain Accuracy</div>
                <div className="text-muted-foreground">Correct answers earn more than speed</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Beat the Clock</div>
                <div className="text-muted-foreground">Time bonuses reward fast thinking</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
