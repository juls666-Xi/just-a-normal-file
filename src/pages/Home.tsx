import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Calculator, Clock, Trophy, Zap, ArrowRight, Sparkles } from 'lucide-react';
import type { Difficulty, Mode } from '@/types';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [selectedMode, setSelectedMode] = useState<Mode>('mixed');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  const modes: { value: Mode; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'addition', label: 'Addition', icon: <span className="text-2xl">+</span>, description: 'Practice adding numbers' },
    { value: 'subtraction', label: 'Subtraction', icon: <span className="text-2xl">−</span>, description: 'Practice subtracting numbers' },
    { value: 'multiplication', label: 'Multiplication', icon: <span className="text-2xl">×</span>, description: 'Practice multiplying numbers' },
    { value: 'division', label: 'Division', icon: <span className="text-2xl">÷</span>, description: 'Practice dividing numbers' },
    { value: 'mixed', label: 'Mixed Mode', icon: <Sparkles className="h-6 w-6" />, description: 'All operations combined' },
  ];

  const difficulties: { value: Difficulty; label: string; description: string; color: string }[] = [
    { value: 'easy', label: 'Easy', description: '1-digit numbers', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', description: '2-digit numbers', color: 'text-yellow-500' },
    { value: 'hard', label: 'Hard', description: '3+ digits & decimals', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10">
            <Brain className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Master Your <span className="text-primary">Mental Math</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Challenge yourself with timed math quizzes, track your progress, and compete on the global leaderboard.
        </p>
        
        {!isAuthenticated && (
          <div className="flex justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        )}
      </section>

      {/* Quiz Configuration */}
      {isAuthenticated && (
        <section className="max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Start a New Quiz</CardTitle>
              <CardDescription>Choose your preferred mode and difficulty</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Mode Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Select Mode</Label>
                <RadioGroup
                  value={selectedMode}
                  onValueChange={(value) => setSelectedMode(value as Mode)}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4"
                >
                  {modes.map((mode) => (
                    <div key={mode.value}>
                      <RadioGroupItem
                        value={mode.value}
                        id={mode.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={mode.value}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-muted bg-card hover:bg-accent cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        {mode.icon}
                        <span className="font-medium">{mode.label}</span>
                        <span className="text-xs text-muted-foreground text-center">{mode.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Difficulty Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Select Difficulty</Label>
                <RadioGroup
                  value={selectedDifficulty}
                  onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
                  className="grid grid-cols-3 gap-4"
                >
                  {difficulties.map((diff) => (
                    <div key={diff.value}>
                      <RadioGroupItem
                        value={diff.value}
                        id={diff.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={diff.value}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-muted bg-card hover:bg-accent cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <span className={`font-bold ${diff.color}`}>{diff.label}</span>
                        <span className="text-xs text-muted-foreground">{diff.description}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Start Button */}
              <Link 
                to="/quiz" 
                state={{ mode: selectedMode, difficulty: selectedDifficulty }}
                className="block"
              >
                <Button size="lg" className="w-full gap-2">
                  <Calculator className="h-5 w-5" />
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Practice With Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Timed Challenges</CardTitle>
              <CardDescription>
                Race against the clock with 5-10 seconds per question. Build speed and accuracy under pressure.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>
                Compete with players worldwide. Climb the ranks and showcase your mental math skills.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Adaptive Difficulty</CardTitle>
              <CardDescription>
                Progress from easy 1-digit problems to complex calculations with decimals.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="py-12 bg-primary/5 rounded-2xl px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Track Your Progress</h2>
          <p className="text-muted-foreground mb-8">
            Sign up to save your scores, view detailed statistics, and monitor your improvement over time.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Game Modes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Difficulty Levels</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Practice</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
