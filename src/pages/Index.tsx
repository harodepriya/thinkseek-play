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
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    title: "Inspiration Board",
    description: "Curate visual inspiration and mood boards",
    icon: Image,
    path: "/inspiration",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Music & Sounds",
    description: "Discover mood-based playlists",
    icon: Music,
    path: "/music",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    title: "Journaling & Notes",
    description: "Express your thoughts and feelings",
    icon: BookOpen,
    path: "/journaling",
    gradient: "from-orange-500/10 to-yellow-500/10",
  },
  {
    title: "Mood & Wellness",
    description: "Track your emotional journey",
    icon: Heart,
    path: "/mood",
    gradient: "from-red-500/10 to-rose-500/10",
  },
  {
    title: "Goals & Challenges",
    description: "Build habits and achieve goals",
    icon: Target,
    path: "/goals",
    gradient: "from-indigo-500/10 to-blue-500/10",
  },
  {
    title: "Profile & Settings",
    description: "Manage your account preferences",
    icon: User,
    path: "/profile",
    gradient: "from-slate-500/10 to-gray-500/10",
  },
  {
    title: "About & Help",
    description: "Get support and information",
    icon: Info,
    path: "/about",
    gradient: "from-teal-500/10 to-cyan-500/10",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-hero bg-clip-text text-transparent">
            Welcome to MindScape
          </h1>
          <p className="text-muted-foreground text-lg">
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
                className={`group cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${feature.gradient} border-2 hover:border-primary/50`}
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                  <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <p className="text-sm text-muted-foreground">Features to Explore</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-secondary/5 to-tertiary/5">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-secondary mb-2">∞</div>
              <p className="text-sm text-muted-foreground">Possibilities for Growth</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-tertiary/5 to-primary/5">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-tertiary mb-2">24/7</div>
              <p className="text-sm text-muted-foreground">AI Assistance Available</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;