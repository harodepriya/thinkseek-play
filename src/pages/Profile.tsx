import { useState, useEffect } from "react";
import { ArrowLeft, User, Moon, Sun, Globe, Bell, Lock, Link as LinkIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    theme: "light",
    language: "en",
    notifications: true,
    emailNotifications: false,
    privacyMode: false,
  });

  useEffect(() => {
    // Load user email from auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email || "");
    });

    // Load profile from localStorage
    const saved = localStorage.getItem("user_profile");
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    toast({ title: "Profile saved successfully!" });
  };

  const updateField = (field: string, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

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
                Profile & Settings
              </h1>
              <p className="text-sm text-muted-foreground">Manage your account</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Personal Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={profile.name}
                onChange={(e) => updateField("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={userEmail} disabled />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {profile.theme === "light" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <div>
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
                </div>
              </div>
              <Select value={profile.theme} onValueChange={(val) => updateField("theme", val)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Language</Label>
                <p className="text-sm text-muted-foreground">Select your language</p>
              </div>
              <Select value={profile.language} onValueChange={(val) => updateField("language", val)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive app notifications</p>
              </div>
              <Switch
                checked={profile.notifications}
                onCheckedChange={(val) => updateField("notifications", val)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Get updates via email</p>
              </div>
              <Switch
                checked={profile.emailNotifications}
                onCheckedChange={(val) => updateField("emailNotifications", val)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Private Mode</Label>
                <p className="text-sm text-muted-foreground">Hide your activity</p>
              </div>
              <Switch
                checked={profile.privacyMode}
                onCheckedChange={(val) => updateField("privacyMode", val)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Connected Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" disabled>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
              Connect Google Drive
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <img src="https://www.spotify.com/favicon.ico" alt="Spotify" className="h-4 w-4 mr-2" />
              Connect Spotify
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Integration coming soon
            </p>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={saveProfile} className="w-full">
          Save Changes
        </Button>
      </main>
    </div>
  );
};

export default Profile;
