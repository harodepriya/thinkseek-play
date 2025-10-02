import { useState, useEffect } from "react";
import { ArrowLeft, Save, Download, Lightbulb, Upload, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface JournalEntry {
  id: string;
  content: string;
  timestamp: number;
  prompt?: string;
}

const AI_PROMPTS = [
  "What are three things you're grateful for today?",
  "Describe a challenge you faced and how you handled it.",
  "What made you smile today?",
  "What's something you learned about yourself recently?",
  "If you could change one thing about today, what would it be?",
  "What are you looking forward to tomorrow?",
  "Write about a person who positively impacted your day.",
  "What emotions did you experience today and why?",
];

const Journaling = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentEntry, setCurrentEntry] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("journal_entries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Entry is empty",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      content: currentEntry,
      timestamp: Date.now(),
      prompt: currentPrompt || undefined,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem("journal_entries", JSON.stringify(updated));
    setCurrentEntry("");
    setCurrentPrompt("");
    toast({ title: "Entry saved!" });
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "journal-entries.json";
    link.click();
    toast({ title: "Entries exported!" });
  };

  const generatePrompt = () => {
    const randomPrompt = AI_PROMPTS[Math.floor(Math.random() * AI_PROMPTS.length)];
    setCurrentPrompt(randomPrompt);
    toast({ title: "New prompt generated!" });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  Journaling & Notes
                </h1>
                <p className="text-sm text-muted-foreground">Express your thoughts</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportEntries} disabled={entries.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Writing Area */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>New Entry</CardTitle>
              <Button variant="outline" size="sm" onClick={generatePrompt}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Prompt
              </Button>
            </div>
            {currentPrompt && (
              <Badge variant="secondary" className="mt-2">
                Prompt: {currentPrompt}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Start writing your thoughts..."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={saveEntry} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Entry
              </Button>
              <Button variant="outline" disabled>
                <ImageIcon className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Add File
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Past Entries */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Entries ({entries.length})</h2>
          {entries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No entries yet. Start journaling!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    {entry.prompt && (
                      <Badge variant="outline" className="mb-2">
                        {entry.prompt}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground mb-2">
                      {formatDate(entry.timestamp)}
                    </p>
                    <p className="whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Journaling;
