import { useState } from "react";
import { Plus, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  date: Date;
  note?: string;
}

export const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: "1",
      mood: "Happy",
      emoji: "😊",
      date: new Date(2024, 0, 15),
      note: "Great workout this morning!",
    },
    {
      id: "2", 
      mood: "Calm",
      emoji: "😌",
      date: new Date(2024, 0, 14),
      note: "Meditation session went well",
    },
    {
      id: "3",
      mood: "Energetic",
      emoji: "⚡",
      date: new Date(2024, 0, 13),
    },
    {
      id: "4",
      mood: "Peaceful",
      emoji: "🧘",
      date: new Date(2024, 0, 12),
    },
  ]);

  const moods = [
    { value: "happy", label: "Happy", emoji: "😊" },
    { value: "sad", label: "Sad", emoji: "😢" },
    { value: "calm", label: "Calm", emoji: "😌" },
    { value: "anxious", label: "Anxious", emoji: "😰" },
    { value: "energetic", label: "Energetic", emoji: "⚡" },
    { value: "peaceful", label: "Peaceful", emoji: "🧘" },
    { value: "excited", label: "Excited", emoji: "🤩" },
    { value: "tired", label: "Tired", emoji: "😴" },
  ];

  const addMoodEntry = () => {
    if (!selectedMood) return;

    const moodData = moods.find(m => m.value === selectedMood);
    if (!moodData) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: moodData.label,
      emoji: moodData.emoji,
      date: new Date(),
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setSelectedMood("");
  };

  // Calculate mood trend (simplified)
  const recentMoods = moodEntries.slice(0, 7);
  const positiveMoods = ["Happy", "Calm", "Energetic", "Peaceful", "Excited"];
  const positiveCount = recentMoods.filter(entry => 
    positiveMoods.includes(entry.mood)
  ).length;
  const trendPercentage = Math.round((positiveCount / recentMoods.length) * 100) || 0;

  return (
    <Card className="bg-gradient-surface border-border shadow-medium">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-gradient-secondary p-1.5 rounded-lg">
            <TrendingUp className="h-4 w-4 text-secondary-foreground" />
          </div>
          Mood Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add Mood */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">How are you feeling?</h3>
          <div className="flex gap-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    <span className="flex items-center gap-2">
                      {mood.emoji} {mood.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={addMoodEntry}
              disabled={!selectedMood}
              size="icon"
              className="bg-gradient-secondary"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mood Trend */}
        <div className="bg-surface rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">7-Day Wellness</span>
            <Badge variant="secondary" className="text-xs">
              {trendPercentage}% positive
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${trendPercentage}%` }}
            />
          </div>
        </div>

        {/* Recent Entries */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Recent Entries</span>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {moodEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-surface-hover/50"
              >
                <span className="text-lg">{entry.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{entry.mood}</span>
                    <span className="text-xs text-muted-foreground">
                      {entry.date.toLocaleDateString([], { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};