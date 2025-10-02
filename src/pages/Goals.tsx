import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Check, Trophy, Target, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Goal {
  id: string;
  title: string;
  type: "daily" | "weekly";
  completed: boolean;
  createdAt: number;
}

interface Habit {
  id: string;
  title: string;
  streak: number;
  lastChecked: number | null;
  history: number[]; // timestamps
}

const ACHIEVEMENTS = [
  { title: "First Goal", icon: Target, requirement: 1, description: "Complete your first goal" },
  { title: "Week Warrior", icon: Flame, requirement: 7, description: "7-day streak" },
  { title: "Goal Master", icon: Trophy, requirement: 10, description: "Complete 10 goals" },
];

const Goals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [newHabit, setNewHabit] = useState("");
  const [goalType, setGoalType] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    const savedHabits = localStorage.getItem("habits");
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedHabits) setHabits(JSON.parse(savedHabits));
  }, []);

  const addGoal = () => {
    if (!newGoal.trim()) return;
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal,
      type: goalType,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [...goals, goal];
    setGoals(updated);
    localStorage.setItem("goals", JSON.stringify(updated));
    setNewGoal("");
    toast({ title: `${goalType === "daily" ? "Daily" : "Weekly"} goal added!` });
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map((g) =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    setGoals(updated);
    localStorage.setItem("goals", JSON.stringify(updated));
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      title: newHabit,
      streak: 0,
      lastChecked: null,
      history: [],
    };
    const updated = [...habits, habit];
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
    setNewHabit("");
    toast({ title: "Habit added!" });
  };

  const checkHabit = (id: string) => {
    const now = Date.now();
    const updated = habits.map((h) => {
      if (h.id !== id) return h;
      const today = new Date().setHours(0, 0, 0, 0);
      const lastCheckedDay = h.lastChecked ? new Date(h.lastChecked).setHours(0, 0, 0, 0) : null;
      
      if (lastCheckedDay === today) {
        // Already checked today, uncheck
        return {
          ...h,
          lastChecked: null,
          streak: Math.max(0, h.streak - 1),
          history: h.history.filter((t) => new Date(t).setHours(0, 0, 0, 0) !== today),
        };
      } else {
        // Check today
        const isConsecutive = lastCheckedDay === today - 86400000; // yesterday
        return {
          ...h,
          lastChecked: now,
          streak: isConsecutive ? h.streak + 1 : 1,
          history: [...h.history, now],
        };
      }
    });
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  const getUnlockedAchievements = () => {
    const completedCount = goals.filter((g) => g.completed).length;
    const maxStreak = Math.max(0, ...habits.map((h) => h.streak));
    
    return ACHIEVEMENTS.filter((achievement) => {
      if (achievement.title === "First Goal") return completedCount >= 1;
      if (achievement.title === "Week Warrior") return maxStreak >= 7;
      if (achievement.title === "Goal Master") return completedCount >= 10;
      return false;
    });
  };

  const unlockedAchievements = getUnlockedAchievements();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Goals & Challenges
              </h1>
              <p className="text-sm text-muted-foreground">Build better habits</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Achievements */}
        <Card className="mb-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map((achievement, idx) => {
                const Icon = achievement.icon;
                const unlocked = unlockedAchievements.includes(achievement);
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      unlocked ? "bg-primary/10 border-primary" : "bg-muted/50 border-muted"
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    <h3 className="font-medium">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    {unlocked && (
                      <Badge className="mt-2" variant="default">Unlocked!</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Goals Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My Goals
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background">
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Goal title..."
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addGoal()}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant={goalType === "daily" ? "default" : "outline"}
                        onClick={() => setGoalType("daily")}
                        className="flex-1"
                      >
                        Daily
                      </Button>
                      <Button
                        variant={goalType === "weekly" ? "default" : "outline"}
                        onClick={() => setGoalType("weekly")}
                        className="flex-1"
                      >
                        Weekly
                      </Button>
                    </div>
                    <Button onClick={addGoal} className="w-full">Create Goal</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No goals yet. Start creating!</p>
            ) : (
              <div className="space-y-2">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoal(goal.id)}
                    />
                    <span className={`flex-1 ${goal.completed ? "line-through text-muted-foreground" : ""}`}>
                      {goal.title}
                    </span>
                    <Badge variant={goal.type === "daily" ? "default" : "secondary"}>
                      {goal.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habit Tracker */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                Habit Tracker
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Habit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background">
                  <DialogHeader>
                    <DialogTitle>Create New Habit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Habit title..."
                      value={newHabit}
                      onChange={(e) => setNewHabit(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHabit()}
                    />
                    <Button onClick={addHabit} className="w-full">Create Habit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {habits.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No habits yet. Start building!</p>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const today = new Date().setHours(0, 0, 0, 0);
                  const checkedToday = habit.lastChecked
                    ? new Date(habit.lastChecked).setHours(0, 0, 0, 0) === today
                    : false;

                  return (
                    <div
                      key={habit.id}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <Button
                        size="icon"
                        variant={checkedToday ? "default" : "outline"}
                        onClick={() => checkHabit(habit.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <h3 className="font-medium">{habit.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {habit.streak} day streak
                        </p>
                      </div>
                      {habit.streak >= 3 && (
                        <Flame className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder */}
        <div className="mt-6 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground mb-2">Join community challenges</p>
          <Button variant="outline" disabled>Coming Soon</Button>
        </div>
      </main>
    </div>
  );
};

export default Goals;
