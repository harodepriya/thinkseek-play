import { useState } from "react";
import { Play, Pause, Heart, SkipForward, SkipBack, Music, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

interface Track {
  id: string;
  title: string;
  artist: string;
  mood: string;
  duration: string;
  isPlaying: boolean;
  isFavorited: boolean;
}

interface Playlist {
  id: string;
  name: string;
  mood: string;
  tracks: number;
  image: string;
}

export const MusicSection = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>({
    id: "1",
    title: "Peaceful Morning",
    artist: "Ambient Collective",
    mood: "calm",
    duration: "3:42",
    isPlaying: false,
    isFavorited: true,
  });

  const [playlists] = useState<Playlist[]>([
    {
      id: "1",
      name: "Focus Deep",
      mood: "productive",
      tracks: 24,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
    },
    {
      id: "2",
      name: "Chill Vibes",
      mood: "relaxed",
      tracks: 18,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
    },
    {
      id: "3",
      name: "Energy Boost",
      mood: "energetic",
      tracks: 32,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop",
    },
  ]);

  const [volume, setVolume] = useState([75]);
  const [progress] = useState(65);

  const togglePlayback = () => {
    if (currentTrack) {
      setCurrentTrack({
        ...currentTrack,
        isPlaying: !currentTrack.isPlaying,
      });
    }
  };

  const toggleFavorite = () => {
    if (currentTrack) {
      setCurrentTrack({
        ...currentTrack,
        isFavorited: !currentTrack.isFavorited,
      });
    }
  };

  return (
    <Card className="bg-gradient-surface border-border shadow-medium">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-gradient-tertiary p-1.5 rounded-lg">
            <Music className="h-4 w-4 text-tertiary-foreground" />
          </div>
          Music & Mood
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Track */}
        {currentTrack && (
          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-tertiary rounded-lg flex items-center justify-center">
                <Music className="h-6 w-6 text-tertiary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{currentTrack.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {currentTrack.mood}
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <Progress value={progress} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>2:25</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                onClick={togglePlayback}
                className="bg-gradient-primary h-10 w-10 rounded-full"
              >
                {currentTrack.isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2"
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    currentTrack.isFavorited ? "fill-current text-red-500" : ""
                  }`}
                />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8 text-right">{volume[0]}</span>
            </div>
          </div>
        )}

        {/* Recommended Playlists */}
        <div>
          <h3 className="font-medium text-sm mb-3">Daily Recommendations</h3>
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover cursor-pointer transition-colors group"
              >
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {playlist.tracks} tracks · {playlist.mood}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};