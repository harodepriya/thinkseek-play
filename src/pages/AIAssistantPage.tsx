import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, User, Menu, X, Bell, Settings, LogOut, Lightbulb, MessageSquare, Coffee, Music, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Message type definition
interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Predefined AI responses for demo
const AI_RESPONSES = [
  "That's a wonderful question! I'm here to help you explore your wellness journey. Let me share some insights...",
  "I understand what you're going through. Here are some gentle suggestions that might help you today...",
  "Great point! Let's dive deeper into that topic. I have some ideas that could inspire you...",
  "I love your curiosity! Here's what I think about that, along with some creative approaches...",
  "That resonates with me. Let me offer some perspective and practical tips you might find helpful...",
  "Excellent observation! Here are some thoughtful ways to approach this situation...",
];

// Dynamic suggestion categories with rotating content
const SUGGESTION_CATEGORIES = [
  {
    category: "Wellness",
    icon: Heart,
    color: "secondary", // Warm orange/red for wellness
    tips: [
      "Take a deep breath and stretch for 2 minutes",
      "Drink a glass of water right now",
      "How can I improve my sleep routine?",
      "What are some quick stress relief techniques?",
      "Stand up and do 10 gentle stretches",
      "Practice a 5-minute mindfulness exercise",
      "Tips for maintaining work-life balance",
      "Set a reminder to move every hour"
    ]
  },
  {
    category: "Music",
    icon: Music,
    color: "tertiary", // Teal/green for music
    tips: [
      "Listen to calming piano music today",
      "Try a nature sounds playlist for focus",
      "Create a playlist for my current mood",
      "What music helps with productivity?",
      "Discover ambient music for relaxation",
      "Explore lo-fi beats for studying",
      "Suggest calming sounds for meditation",
      "Help me discover new artists"
    ]
  },
  {
    category: "Inspiration",
    icon: Sparkles,
    color: "primary", // Purple/blue for inspiration
    tips: [
      "Every sunrise is a new beginning",
      "You are capable of amazing things",
      "Give me creative writing prompts",
      "How to overcome creative blocks?",
      "Inspire me with art project ideas",
      "Small steps lead to big changes",
      "Help me brainstorm new hobbies",
      "Believe in your journey"
    ]
  }
];

// LocalStorage keys
const STORAGE_KEYS = {
  MESSAGES: 'ai_assistant_messages',
  LAST_CHECKIN: 'ai_assistant_last_checkin',
  CHECKIN_MESSAGE: 'ai_assistant_checkin_message'
};

const AIAssistantPage = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [checkinInput, setCheckinInput] = useState("");
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  // Refs for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize: Load messages from localStorage and check for daily check-in
  useEffect(() => {
    // Load saved messages
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      // Convert timestamp strings back to Date objects
      const messagesWithDates = parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(messagesWithDates);
    } else {
      // First time user - set welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        type: "assistant",
        content: "Hello! I'm your AI wellness companion. I'm here to support your journey with personalized insights, creative inspiration, and thoughtful conversations. How can I help you today?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }

    // Check if daily check-in is needed
    const lastCheckin = localStorage.getItem(STORAGE_KEYS.LAST_CHECKIN);
    const today = new Date().toDateString();
    
    if (lastCheckin !== today) {
      // Show check-in modal after a brief delay
      setTimeout(() => setShowCheckinModal(true), 1000);
    }

    // Rotate suggestion categories every 10 seconds
    const rotationInterval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % SUGGESTION_CATEGORIES.length);
    }, 10000);

    return () => clearInterval(rotationInterval);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
    setIsSidebarOpen(false);
  };

  // Toggle voice recording
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
  };

  // Handle daily check-in submission
  const handleCheckinSubmit = () => {
    if (!checkinInput.trim()) return;

    const checkinMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Daily Check-in: ${checkinInput}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, checkinMessage]);
    
    // Save check-in date and message
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEYS.LAST_CHECKIN, today);
    localStorage.setItem(STORAGE_KEYS.CHECKIN_MESSAGE, checkinInput);
    
    // AI Response to check-in
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `Thank you for sharing! I hear that you're feeling "${checkinInput}". I'm here to support you today. Let's make it a great day together! 💙`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setShowCheckinModal(false);
    setCheckinInput("");
  };

  // Get current category for display
  const currentCategory = SUGGESTION_CATEGORIES[currentCategoryIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Daily Check-in Modal */}
      <Dialog open={showCheckinModal} onOpenChange={setShowCheckinModal}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-6 w-6 text-secondary" />
              Daily Check-In
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Take a moment to reflect on how you're feeling today.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                How are you feeling today?
              </label>
              <Textarea
                value={checkinInput}
                onChange={(e) => setCheckinInput(e.target.value)}
                placeholder="I'm feeling..."
                className="min-h-[100px] bg-surface border-border text-foreground"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCheckinSubmit();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowCheckinModal(false)}
                className="text-muted-foreground"
              >
                Skip for now
              </Button>
              <Button 
                onClick={handleCheckinSubmit}
                disabled={!checkinInput.trim()}
                className="bg-gradient-secondary text-secondary-foreground"
              >
                Submit Check-In
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3 sticky top-0 z-40 backdrop-blur-lg bg-card/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MindFlow AI</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Your Wellness Assistant</p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium text-foreground">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem className="text-foreground">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-foreground">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Dynamic Suggestions Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-30 w-80 bg-surface border-r border-border transform transition-transform duration-300 ease-in-out h-full overflow-hidden`}>
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <currentCategory.icon className={`h-5 w-5 text-${currentCategory.color}`} />
              {currentCategory.category}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click any suggestion • Rotates every 10s
            </p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-6 space-y-3 animate-fade-in">
              {currentCategory.tips.map((tip, index) => (
                <button
                  key={`${currentCategoryIndex}-${index}`}
                  onClick={() => handleSuggestionClick(tip)}
                  className={`w-full text-left p-4 text-sm text-foreground bg-card rounded-xl border border-border hover:border-${currentCategory.color} hover:bg-surface-hover transition-all duration-200 group shadow-soft hover:shadow-medium`}
                >
                  <span className={`group-hover:text-${currentCategory.color}`}>{tip}</span>
                </button>
              ))}
              
              {/* Category indicator dots */}
              <div className="flex justify-center gap-2 pt-4">
                {SUGGESTION_CATEGORIES.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === currentCategoryIndex 
                        ? `bg-${currentCategory.color} w-6` 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col bg-background">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "assistant" && (
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <Card className={`max-w-[80%] shadow-soft ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border"
                  }`}>
                    <CardContent className="p-4">
                      <p className={`text-sm leading-relaxed ${
                        message.type === "user" ? "text-primary-foreground" : "text-foreground"
                      }`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.type === "user" ? "opacity-80" : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  {message.type === "user" && (
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4 justify-start animate-fade-in">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-card border-border shadow-soft">
                    <CardContent className="p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border bg-card/80 backdrop-blur-lg p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about wellness, creativity, or inspiration..."
                    className="pr-12 resize-none min-h-[50px] bg-surface border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    disabled={isTyping}
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={`shrink-0 ${
                    isRecording 
                      ? "bg-destructive/20 text-destructive hover:bg-destructive/30" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="shrink-0 bg-gradient-primary text-primary-foreground hover:opacity-90"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistantPage;