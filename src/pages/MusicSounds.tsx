import { useState } from "react";
import { ArrowLeft, Heart, Music2, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock music tracks
const MUSIC_TRACKS = [
  { id: 1, title: "Calm Piano", artist: "Peaceful Sounds", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", mood: "calm", duration: "3:45" },
  { id: 2, title: "Focus Flow", artist: "Study Beats", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", mood: "focus", duration: "4:20" },
  { id: 3, title: "Happy Vibes", artist: "Upbeat Tunes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", mood: "happy", duration: "3:15" },
  { id: 4, title: "Meditation Wave", artist: "Zen Masters", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", mood: "calm", duration: "5:00" },
  { id: 5, title: "Energy Boost", artist: "Active Mix", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", mood: "happy", duration: "3:30" },
  { id: 6, title: "Deep Concentration", artist: "Focus Lab", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", mood: "focus", duration: "4:00" },
];

const PLAYLISTS = [
  { name: "Morning Motivation", tracks: [3, 5], emoji: "🌅" },
  { name: "Focus Zone", tracks: [2, 6], emoji: "🎯" },
  { name: "Evening Calm", tracks: [1, 4], emoji: "🌙" },
];

const MusicSounds = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("music_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [playingId, setPlayingId] = useState<number | null>(null);

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("music_favorites", JSON.stringify(updated));
    toast({
      title: favorites.includes(id) ? "Removed from favorites" : "Added to favorites",
    });
  };

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id);
  };

  const filteredTracks = selectedMood === "all"
    ? MUSIC_TRACKS
    : MUSIC_TRACKS.filter((track) => track.mood === selectedMood);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Music & Sounds
              </h1>
              <p className="text-sm text-muted-foreground">Find your perfect soundtrack</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Daily Playlists */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Daily Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLAYLISTS.map((playlist, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary/10 to-secondary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{playlist.emoji}</span>
                    {playlist.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{playlist.tracks.length} tracks</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mood Filter */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Mood-Based Recommendations</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedMood === "all" ? "default" : "outline"}
              onClick={() => setSelectedMood("all")}
            >
              All
            </Button>
            <Button
              variant={selectedMood === "calm" ? "default" : "outline"}
              onClick={() => setSelectedMood("calm")}
            >
              Calm
            </Button>
            <Button
              variant={selectedMood === "focus" ? "default" : "outline"}
              onClick={() => setSelectedMood("focus")}
            >
              Focus
            </Button>
            <Button
              variant={selectedMood === "happy" ? "default" : "outline"}
              onClick={() => setSelectedMood("happy")}
            >
              Happy
            </Button>
          </div>
        </div>

        {/* Tracks List */}
        <div className="space-y-3">
          {filteredTracks.map((track) => (
            <Card key={track.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0"
                    onClick={() => togglePlay(track.id)}
                  >
                    {playingId === track.id ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{track.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{track.mood}</Badge>
                    <span className="text-sm text-muted-foreground">{track.duration}</span>
                    <Button
                      size="icon"
                      variant={favorites.includes(track.id) ? "default" : "ghost"}
                      onClick={() => toggleFavorite(track.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(track.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                {playingId === track.id && (
                  <div className="mt-3">
                    <audio controls className="w-full" src={track.url} autoPlay>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Placeholder sections */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg text-center">
          <Music2 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">Upload your own tracks</p>
          <Button variant="outline" disabled>Coming Soon</Button>
        </div>

        <div className="mt-4 p-6 bg-muted/50 rounded-lg text-center">
          <p className="text-muted-foreground mb-2">Connect Spotify or YouTube</p>
          <Button variant="outline" disabled>Integration Coming Soon</Button>
        </div>
      </main>
    </div>
  );
};

export default MusicSounds;
