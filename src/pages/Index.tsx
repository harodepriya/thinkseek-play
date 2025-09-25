import { Header } from "@/components/dashboard/Header";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { InspirationBoard } from "@/components/dashboard/InspirationBoard";
import { MusicSection } from "@/components/dashboard/MusicSection";
import { JournalingPanel } from "@/components/dashboard/JournalingPanel";
import { MoodTracker } from "@/components/dashboard/MoodTracker";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - AI Assistant */}
          <div className="lg:col-span-4">
            <AIAssistant />
          </div>

          {/* Center Column - Inspiration Board */}
          <div className="lg:col-span-5">
            <InspirationBoard />
          </div>

          {/* Right Column - Music & Mood */}
          <div className="lg:col-span-3 space-y-6">
            <MusicSection />
            <MoodTracker />
          </div>
        </div>

        {/* Bottom Section - Journaling */}
        <div className="mt-8">
          <JournalingPanel />
        </div>
      </main>
    </div>
  );
};

export default Index;