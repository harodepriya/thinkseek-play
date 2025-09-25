import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, User, Menu, X, Bell, Settings, LogOut, Lightbulb, MessageSquare, Coffee, Music, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

// Suggestion categories with tips
const SUGGESTIONS = [
  {
    category: "Wellness",
    icon: Heart,
    tips: [
      "How can I improve my sleep routine?",
      "What are some quick stress relief techniques?",
      "Help me create a mindfulness practice",
      "Tips for maintaining work-life balance"
    ]
  },
  {
    category: "Creativity",
    icon: Lightbulb,
    tips: [
      "Give me creative writing prompts",
      "How to overcome creative blocks?",
      "Inspire me with art project ideas",
      "Help me brainstorm new hobbies"
    ]
  },
  {
    category: "Music & Mood",
    icon: Music,
    tips: [
      "Create a playlist for my current mood",
      "What music helps with productivity?",
      "Suggest calming sounds for meditation",
      "Help me discover new artists"
    ]
  },
  {
    category: "Journaling",
    icon: MessageSquare,
    tips: [
      "Give me today's journaling prompt",
      "How to start a gratitude practice?",
      "Help me reflect on my goals",
      "What should I write about today?"
    ]
  }
];

const AIAssistantPage = () => {
  // State management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI wellness companion. I'm here to support your journey with personalized insights, creative inspiration, and thoughtful conversations. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
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
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindFlow AI</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Your Wellness Assistant</p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
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
        {/* Suggestions Sidebar */}
        <aside className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-30 w-80 bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out h-full overflow-hidden`}>
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI Suggestions
            </h2>
            <p className="text-sm text-gray-600 mt-1">Click any suggestion to get started</p>
          </div>
          
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-6 space-y-6">
              {SUGGESTIONS.map((category) => (
                <div key={category.category}>
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-gray-600" />
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    {category.tips.map((tip, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(tip)}
                        className="w-full text-left p-3 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <span className="group-hover:text-blue-700">{tip}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col bg-white">
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
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <Bot className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <Card className={`max-w-[80%] ${
                    message.type === "user"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-50 border-gray-200"
                  }`}>
                    <CardContent className="p-4">
                      <p className={`text-sm leading-relaxed ${
                        message.type === "user" ? "text-white" : "text-gray-800"
                      }`}>
                        {message.content}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.type === "user" ? "text-blue-100" : "text-gray-500"
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
                      <AvatarFallback className="bg-gray-300 text-gray-700">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about wellness, creativity, or inspiration..."
                    className="pr-12 resize-none min-h-[50px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleRecording}
                  className={`shrink-0 ${
                    isRecording 
                      ? "bg-red-100 text-red-600 hover:bg-red-200" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
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