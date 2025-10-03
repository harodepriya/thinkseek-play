import { useState } from "react";
import { ArrowLeft, Heart, Plus, Search, Share2, Grid3x3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock inspiration images with moods
const INSPIRATION_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", mood: "calm", title: "Mountain Peace" },
  { id: 2, url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", mood: "happy", title: "Beach Vibes" },
  { id: 3, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", mood: "motivation", title: "Forest Path" },
  { id: 4, url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400", mood: "calm", title: "Night Sky" },
  { id: 5, url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400", mood: "motivation", title: "Nature Trail" },
  { id: 6, url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400", mood: "calm", title: "Lake View" },
  { id: 7, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400", mood: "happy", title: "Sunset Hills" },
  { id: 8, url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400", mood: "motivation", title: "Adventure" },
];

const InspirationBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("inspiration_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [boards, setBoards] = useState<{ name: string; images: number[] }[]>(() => {
    const saved = localStorage.getItem("inspiration_boards");
    return saved ? JSON.parse(saved) : [{ name: "Relaxation", images: [] }, { name: "Motivation", images: [] }];
  });
  const [newBoardName, setNewBoardName] = useState("");

  const toggleFavorite = (id: number) => {
    const updated = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem("inspiration_favorites", JSON.stringify(updated));
    toast({
      title: favorites.includes(id) ? "Removed from favorites" : "Added to favorites",
    });
  };

  const addBoard = () => {
    if (!newBoardName.trim()) return;
    const updated = [...boards, { name: newBoardName, images: [] }];
    setBoards(updated);
    localStorage.setItem("inspiration_boards", JSON.stringify(updated));
    setNewBoardName("");
    toast({ title: `Board "${newBoardName}" created` });
  };

  const addToBoard = (boardIndex: number, imageId: number) => {
    const updated = [...boards];
    if (!updated[boardIndex].images.includes(imageId)) {
      updated[boardIndex].images.push(imageId);
      setBoards(updated);
      localStorage.setItem("inspiration_boards", JSON.stringify(updated));
      toast({ title: `Added to ${updated[boardIndex].name}` });
    }
  };

  const filteredImages = INSPIRATION_IMAGES.filter((img) =>
    img.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 backdrop-blur-xl bg-card/80">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Inspiration Board
                </h1>
                <p className="text-sm text-muted-foreground">Curate your visual inspiration</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Board
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background">
                <DialogHeader>
                  <DialogTitle>Create New Board</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input
                    placeholder="Board name..."
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addBoard()}
                  />
                  <Button onClick={addBoard}>Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by mood or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Boards Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            Your Boards
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {boards.map((board, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{board.name}</h3>
                  <p className="text-sm text-muted-foreground">{board.images.length} images</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Inspiration Grid */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">
            {searchQuery ? "Search Results" : "All Inspiration"}
          </h2>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="break-inside-avoid group relative overflow-hidden">
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="text-white font-medium">{image.title}</h3>
                    <Badge variant="secondary" className="mt-1">{image.mood}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant={favorites.includes(image.id) ? "default" : "secondary"}
                      onClick={() => toggleFavorite(image.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(image.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="secondary">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-background">
                        <DialogHeader>
                          <DialogTitle>Add to Board</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                          {boards.map((board, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => addToBoard(idx, image.id)}
                            >
                              {board.name}
                            </Button>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No images found matching "{searchQuery}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InspirationBoard;
