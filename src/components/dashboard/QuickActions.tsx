import { 
  MessageCircle, 
  Heart, 
  Music, 
  FileText, 
  Camera, 
  Mic,
  TrendingUp,
  Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const QuickActions = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Quick Action",
      description: `${action} feature coming soon!`,
    });
  };

  const actions = [
    {
      icon: Heart,
      label: "Log Mood",
      gradient: "bg-gradient-secondary",
      onClick: () => handleAction("Mood logging"),
    },
    {
      icon: FileText,
      label: "Quick Journal",
      gradient: "bg-gradient-primary",
      onClick: () => handleAction("Quick journaling"),
    },
    {
      icon: Music,
      label: "Play Mood Music",
      gradient: "bg-gradient-tertiary",
      onClick: () => handleAction("Mood-based music"),
    },
    {
      icon: MessageCircle,
      label: "Chat with AI",
      gradient: "bg-gradient-primary",
      onClick: () => handleAction("AI chat"),
    },
    {
      icon: Camera,
      label: "Add Memory",
      gradient: "bg-gradient-secondary",
      onClick: () => handleAction("Memory capture"),
    },
    {
      icon: Mic,
      label: "Voice Note",
      gradient: "bg-gradient-tertiary",
      onClick: () => handleAction("Voice recording"),
    },
    {
      icon: TrendingUp,
      label: "View Insights",
      gradient: "bg-gradient-primary",
      onClick: () => handleAction("Wellness insights"),
    },
    {
      icon: Sparkles,
      label: "Get Inspired",
      gradient: "bg-gradient-secondary",
      onClick: () => handleAction("Inspiration suggestions"),
    },
  ];

  return (
    <div className="bg-gradient-surface rounded-xl p-6 border border-border shadow-medium">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-hero p-1.5 rounded-lg">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="flex flex-col items-center gap-2 h-auto p-4 hover:bg-surface-hover transition-all duration-300 group"
              onClick={action.onClick}
            >
              <div className={`${action.gradient} p-3 rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300 group-hover:scale-105`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};