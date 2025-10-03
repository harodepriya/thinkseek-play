import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, User, Menu, X, ArrowLeft, Download, Sparkles, Heart, Music, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useToast } from "@/hooks/use-toast";

const SUGGESTION_CATEGORIES = [
  {
    category: "Wellness",
    icon: Heart,
    tips: [
      "Take a deep breath and stretch for 2 minutes",
      "Drink a glass of water right now",
      "How can I improve my sleep routine?",
      "What are some quick stress relief techniques?",
    ]
  },
  {
    category: "Music",
    icon: Music,
    tips: [
      "Listen to calming piano music today",
      "Try a nature sounds playlist for focus",
      "What music helps with productivity?",
      "Suggest calming sounds for meditation",
    ]
  },
  {
    category: "Inspiration",
    icon: Sparkles,
    tips: [
      "Every sunrise is a new beginning",
      "You are capable of amazing things",
      "Give me creative writing prompts",
      "How to overcome creative blocks?",
    ]
  }
];

const AIAssistantPage = () => {
  const navigate = useNavigate();
  const { messages, isLoading, sendMessage, clearMessages } = useChatMessages();
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinInput, setCheckinInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => {
        setIsRecording(false);
        toast({ title: "Voice input failed", variant: "destructive" });
      };
    }
  }, [toast]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show daily check-in
  useEffect(() => {
    const lastCheckin = localStorage.getItem('last_checkin_date');
    const today = new Date().toDateString();
    if (lastCheckin !== today && messages.length === 0) {
      setShowCheckinModal(true);
    }
  }, [messages.length]);

  // Rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex(prev => (prev + 1) % SUGGESTION_CATEGORIES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue("");
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice input not supported", variant: "destructive" });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleCheckinSubmit = async () => {
    if (checkinInput.trim()) {
      await sendMessage(`Daily Check-in: ${checkinInput}`);
      localStorage.setItem('last_checkin_date', new Date().toDateString());
      setShowCheckinModal(false);
      setCheckinInput("");
    }
  };

  const exportChat = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindscape-chat-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentCategory = SUGGESTION_CATEGORIES[currentCategoryIndex];
  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Daily Check-in Modal */}
      <Dialog open={showCheckinModal} onOpenChange={setShowCheckinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Daily Check-in 💙</DialogTitle>
            <DialogDescription>How are you feeling today?</DialogDescription>
          </DialogHeader>
          <Textarea
            value={checkinInput}
            onChange={(e) => setCheckinInput(e.target.value)}
            placeholder="Share your thoughts, feelings, or goals for today..."
            className="min-h-[100px]"
          />
          <Button onClick={handleCheckinSubmit}>Submit Check-in</Button>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">AI Assistant</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportChat}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 && (
                <Card className="p-8 text-center border-2">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to MindScape AI</h2>
                  <p className="text-muted-foreground">
                    Your personal wellness companion. How can I help you today?
                  </p>
                </Card>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <Avatar className="h-8 w-8 border-2 border-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border-2'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8 border-2 border-secondary">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card border-2 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t bg-card p-4">
            <div className="max-w-3xl mx-auto flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        {isSidebarOpen && (
          <div className="w-80 border-l bg-card p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-foreground">Suggestions</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Card className="p-4 mb-4 border-2">
              <div className="flex items-center gap-2 mb-3">
                <CategoryIcon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-foreground">{currentCategory.category}</h4>
              </div>
              <div className="space-y-2">
                {currentCategory.tips.map((tip, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => {
                      setInputValue(tip);
                      setIsSidebarOpen(false);
                    }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0 text-primary" />
                    <span className="text-sm">{tip}</span>
                  </Button>
                ))}
              </div>
            </Card>

            <Button variant="destructive" className="w-full" onClick={clearMessages}>
              Clear Chat History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPage;
