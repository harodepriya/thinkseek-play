import { Header } from "@/components/dashboard/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  MessageCircle, 
  Image, 
  Music, 
  BookOpen, 
  Heart, 
  Target, 
  User, 
  Info,
  ArrowRight
} from "lucide-react";

const FEATURE_CARDS = [
  {
    title: "AI Assistant",
    description: "Chat with your AI wellness companion",
    icon: MessageCircle,
    path: "/ai-assistant",
  },
  {
    title: "Inspiration Board",
    description: "Curate visual inspiration and mood boards",
    icon: Image,
    path: "/inspiration",
  },
  {
    title: "Music & Sounds",
    description: "Discover mood-based playlists",
    icon: Music,
    path: "/music",
  },
  {
    title: "Journaling & Notes",
    description: "Express your thoughts and feelings",
    icon: BookOpen,
    path: "/journaling",
  },
  {
    title: "Mood & Wellness",
    description: "Track your emotional journey",
    icon: Heart,
    path: "/mood",
  },
  {
    title: "Goals & Challenges",
    description: "Build habits and achieve goals",
    icon: Target,
    path: "/goals",
  },
  {
    title: "Profile & Settings",
    description: "Manage your account preferences",
    icon: User,
    path: "/profile",
  },
  {
    title: "About & Help",
    description: "Get support and information",
    icon: Info,
    path: "/about",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground">
            Welcome to MindScape
          </h1>
          <div className="h-1 w-32 mx-auto bg-primary rounded-full"></div>
          <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto">
            Your complete wellness companion for mental health and personal growth
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURE_CARDS.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.path}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 bg-card"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-xl mt-4 font-bold text-foreground">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center border-2 bg-card">
            <CardContent className="pt-6">
              <div className="text-5xl font-extrabold text-primary mb-2">8</div>
              <p className="text-sm font-semibold text-foreground">Features to Explore</p>
            </CardContent>
          </Card>
          <Card className="text-center border-2 bg-card">
            <CardContent className="pt-6">
              <div className="text-5xl font-extrabold text-secondary mb-2">∞</div>
              <p className="text-sm font-semibold text-foreground">Possibilities for Growth</p>
            </CardContent>
          </Card>
          <Card className="text-center border-2 bg-card">
            <CardContent className="pt-6">
              <div className="text-5xl font-extrabold text-tertiary mb-2">24/7</div>
              <p className="text-sm font-semibold text-foreground">AI Assistance Available</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;