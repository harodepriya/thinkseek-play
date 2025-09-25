import { useState } from "react";
import { Search, Heart, Plus, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Pin {
  id: string;
  title: string;
  image: string;
  mood: string;
  isFavorited: boolean;
  tags: string[];
}

export const InspirationBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMood, setSelectedMood] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pins, setPins] = useState<Pin[]>([
    {
      id: "1",
      title: "Serene Mountain Landscape",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      mood: "calm",
      isFavorited: true,
      tags: ["nature", "mountains", "peaceful"],
    },
    {
      id: "2",
      title: "Creative Workspace Setup",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      mood: "productive",
      isFavorited: false,
      tags: ["workspace", "creative", "minimal"],
    },
    {
      id: "3",
      title: "Vibrant City Lights",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop",
      mood: "energetic",
      isFavorited: true,
      tags: ["city", "lights", "vibrant"],
    },
    {
      id: "4",
      title: "Cozy Reading Nook",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      mood: "cozy",
      isFavorited: false,
      tags: ["reading", "cozy", "books"],
    },
    {
      id: "5",
      title: "Ocean Waves at Sunset",
      image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=300&fit=crop",
      mood: "peaceful",
      isFavorited: true,
      tags: ["ocean", "sunset", "peaceful"],
    },
    {
      id: "6",
      title: "Modern Art Gallery",
      image: "https://images.unsplash.com/photo-1544967882-6abaa22015da?w=400&h=300&fit=crop",
      mood: "inspiring",
      isFavorited: false,
      tags: ["art", "gallery", "modern"],
    },
  ]);

  const moods = ["all", "calm", "energetic", "peaceful", "productive", "cozy", "inspiring"];

  const filteredPins = pins.filter((pin) => {
    const matchesSearch = pin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMood = selectedMood === "all" || pin.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const toggleFavorite = (pinId: string) => {
    setPins(pins.map(pin => 
      pin.id === pinId ? { ...pin, isFavorited: !pin.isFavorited } : pin
    ));
  };

  return (
    <Card className="h-[600px] flex flex-col bg-gradient-surface border-border shadow-medium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="bg-gradient-secondary p-1.5 rounded-lg">
              <Grid className="h-4 w-4 text-secondary-foreground" />
            </div>
            Inspiration Board
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button size="icon" className="bg-gradient-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Search and Filters */}
        <div className="px-6 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by mood or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Pins Grid */}
        <div className="flex-1 px-6 pb-6 overflow-y-auto">
          <div className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}>
            {filteredPins.map((pin) => (
              <div
                key={pin.id}
                className="group relative bg-surface rounded-xl overflow-hidden hover:shadow-medium transition-all duration-300 animate-fade-in"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={pin.image}
                    alt={pin.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 backdrop-blur-sm text-white hover:bg-black/40"
                      onClick={() => toggleFavorite(pin.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          pin.isFavorited ? "fill-current text-red-500" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-2 line-clamp-2">{pin.title}</h3>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {pin.mood}
                    </Badge>
                    <div className="flex gap-1">
                      {pin.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};