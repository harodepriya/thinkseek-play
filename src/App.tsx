import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AIAssistantPage from "./pages/AIAssistantPage";
import Auth from "./pages/Auth";
import InspirationBoard from "./pages/InspirationBoard";
import MusicSounds from "./pages/MusicSounds";
import Journaling from "./pages/Journaling";
import MoodTracker from "./pages/MoodTracker";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            MindScape
          </div>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={session ? <Navigate to="/" /> : <Auth />} />
            <Route path="/" element={session ? <Index /> : <Navigate to="/auth" />} />
            <Route path="/ai-assistant" element={session ? <AIAssistantPage /> : <Navigate to="/auth" />} />
            <Route path="/inspiration" element={session ? <InspirationBoard /> : <Navigate to="/auth" />} />
            <Route path="/music" element={session ? <MusicSounds /> : <Navigate to="/auth" />} />
            <Route path="/journaling" element={session ? <Journaling /> : <Navigate to="/auth" />} />
            <Route path="/mood" element={session ? <MoodTracker /> : <Navigate to="/auth" />} />
            <Route path="/goals" element={session ? <Goals /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={session ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/about" element={session ? <About /> : <Navigate to="/auth" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
