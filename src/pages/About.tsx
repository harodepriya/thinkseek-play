import { ArrowLeft, Mail, FileText, Shield, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FAQs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption to protect your data. Your information is stored securely and is never shared with third parties without your consent.",
  },
  {
    question: "Can I export my journal entries?",
    answer: "Yes! Go to the Journaling page and click the Export button to download your entries as a JSON file.",
  },
  {
    question: "How do I delete my account?",
    answer: "To delete your account, please contact our support team through the Contact Support form below.",
  },
  {
    question: "What features are coming soon?",
    answer: "We're working on Spotify integration, community challenges, file uploads for journals, and more! Stay tuned for updates.",
  },
];

const About = () => {
  const navigate = useNavigate();

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
                About & Help
              </h1>
              <p className="text-sm text-muted-foreground">Get support and information</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {/* App Info */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About MindScape
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-medium">MindScape v1.0.0</p>
            <p className="text-muted-foreground">
              Your AI-powered wellness companion for mental health, inspiration, and personal growth.
              Track your moods, set goals, journal your thoughts, and discover curated content to support your journey.
            </p>
            <div className="pt-4 space-y-1 text-sm text-muted-foreground">
              <p>Created with ❤️ by the MindScape Team</p>
              <p>© 2025 MindScape. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {FAQs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What do you need help with?" disabled />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Describe your issue or question..."
                  rows={5}
                  disabled
                />
              </div>
              <Button className="w-full" disabled>
                Send Message (Coming Soon)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                This is a placeholder form. For now, please email support@mindscape.app
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Terms & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Terms & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                We value your privacy and are committed to protecting your personal data. All information stored locally
                in your browser is encrypted and not shared with third parties. For detailed information, please review
                our full privacy policy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Terms of Service</h3>
              <p className="text-sm text-muted-foreground">
                By using MindScape, you agree to our terms of service. This includes responsible use of all features,
                respecting community guidelines, and understanding that the AI assistant provides informational content
                only and is not a substitute for professional medical advice.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" disabled>
                View Full Privacy Policy
              </Button>
              <Button variant="outline" size="sm" disabled>
                View Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;
