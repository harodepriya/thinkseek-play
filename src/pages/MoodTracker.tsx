import { useState, useEffect } from "react";
import { ArrowLeft, Smile, Frown, Meh, Zap, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  mood: string;
  timestamp: number;
  note?: string;
}

const MOODS = [
  { value: "happy", label: "Happy", icon: Smile, color: "text-yellow-500" },
  { value: "calm", label: "Calm", icon: Cloud, color: "text-blue-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "text-gray-500" },
  { value: "stressed", label: "Stressed", icon: Zap, color: "text-red-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-gray-400" },
];

const MoodTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("mood_history");
    if (saved) {
      setMoodHistory(JSON.parse(saved));
    }
  }, []);

  const logMood = () => {
    if (!selectedMood) {
      toast({
        title: "Select a mood",
        description: "Please choose how you're feeling.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: MoodEntry = {
      mood: selectedMood,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...moodHistory];
    setMoodHistory(updated);
    localStorage.setItem("mood_history", JSON.stringify(updated));
    setSelectedMood("");
    toast({ title: "Mood logged successfully!" });
  };

  const getMoodStats = () => {
    const counts: Record<string, number> = {};
    moodHistory.forEach((entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  };

  const getInsights = () => {
    const stats = getMoodStats();
    const total = moodHistory.length;
    if (total === 0) return "Start logging your moods to see insights!";

    const topMood = Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
    const moodLabel = MOODS.find((m) => m.value === topMood[0])?.label || topMood[0];
    const percentage = Math.round((topMood[1] / total) * 100);

    return `You've been ${moodLabel.toLowerCase()} ${percentage}% of the time this week.`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = getMoodStats();

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
                Mood & Wellness Tracker
              </h1>
              <p className="text-sm text-muted-foreground">Track your emotional journey</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Log Mood Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How are you feeling right now?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {MOODS.map((mood) => {
                const Icon = mood.icon;
                return (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-24 flex flex-col gap-2"
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <Icon className={`h-8 w-8 ${selectedMood === mood.value ? "" : mood.color}`} />
                    <span className="text-sm">{mood.label}</span>
                  </Button>
                );
              })}
            </div>
            <Button onClick={logMood} className="w-full" disabled={!selectedMood}>
              Log Mood
            </Button>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{getInsights()}</p>
          </CardContent>
        </Card>

        {/* Mood Statistics */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOODS.map((mood) => {
                const count = stats[mood.value] || 0;
                const percentage = moodHistory.length > 0
                  ? Math.round((count / moodHistory.length) * 100)
                  : 0;
                const Icon = mood.icon;

                return (
                  <div key={mood.value} className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${mood.color}`} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{mood.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} times ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mood History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {moodHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No mood logs yet. Start tracking!
              </p>
            ) : (
              <div className="space-y-2">
                {moodHistory.slice(0, 10).map((entry, idx) => {
                  const mood = MOODS.find((m) => m.value === entry.mood);
                  const Icon = mood?.icon || Meh;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${mood?.color}`} />
                        <span className="font-medium">{mood?.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Placeholder for reminders */}
        <div className="mt-6 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground mb-2">Set mood check-in reminders</p>
          <Button variant="outline" disabled>Coming Soon</Button>
        </div>
      </main>
    </div>
  );
};

export default MoodTracker;
