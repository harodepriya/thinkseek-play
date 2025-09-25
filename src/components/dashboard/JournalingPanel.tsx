import { useState } from "react";
import { FileText, Camera, Mic, Sparkles, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
  prompt?: string;
}

export const JournalingPanel = () => {
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Morning Reflections",
      content: "Today I woke up feeling grateful for the beautiful sunrise. The colors reminded me of...",
      date: new Date(2024, 0, 15),
      mood: "peaceful",
      prompt: "What made you smile today?",
    },
    {
      id: "2",
      title: "Creative Breakthrough",
      content: "Had an amazing idea during my walk. Sometimes the best insights come when you're not trying...",
      date: new Date(2024, 0, 14),
      mood: "inspired",
    },
  ]);

  const aiPrompts = [
    "What made you smile today?",
    "Describe a moment of peace you experienced recently",
    "What are you most grateful for right now?",
    "Write about a challenge you overcame this week",
    "What would you tell your younger self?",
    "Describe your ideal day from start to finish",
  ];

  const saveEntry = () => {
    if (!currentEntry.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: `Entry ${new Date().toLocaleDateString()}`,
      content: currentEntry,
      date: new Date(),
      prompt: selectedPrompt || undefined,
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry("");
    setSelectedPrompt(null);
  };

  const usePrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setCurrentEntry(`Prompt: "${prompt}"\n\n`);
  };

  return (
    <Card className="bg-gradient-surface border-border shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="bg-gradient-primary p-1.5 rounded-lg">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          Journaling & Notes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
            <TabsTrigger value="entries">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-4">
            {selectedPrompt && (
              <div className="bg-surface rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI Prompt</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedPrompt}</p>
              </div>
            )}

            <Textarea
              placeholder="Start writing your thoughts, feelings, or experiences..."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[200px] bg-surface border-border"
            />

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button variant="outline" size="sm">
                  <Mic className="h-4 w-4 mr-2" />
                  Voice Note
                </Button>
              </div>
              <Button onClick={saveEntry} disabled={!currentEntry.trim()}>
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="prompts" className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              Get inspired with AI-generated prompts for deeper reflection
            </p>
            <div className="grid gap-3">
              {aiPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="p-3 bg-surface rounded-lg hover:bg-surface-hover cursor-pointer transition-colors group"
                  onClick={() => usePrompt(prompt)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm flex-1">{prompt}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Use Prompt
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="entries" className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Your recent journal entries</span>
              <Badge variant="secondary">{entries.length} entries</Badge>
            </div>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 bg-surface rounded-lg hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{entry.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {entry.date.toLocaleDateString()}
                    </div>
                  </div>
                  
                  {entry.prompt && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Prompt
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {entry.content}
                  </p>
                  
                  {entry.mood && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {entry.mood}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};