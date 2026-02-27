import { useState } from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSubmitFeedbackMutation } from "@/redux/api/feedbackApi";

const DashboardFeedback = () => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();


  const [submitFeedback, { isLoading }] = useSubmitFeedbackMutation();

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await submitFeedback({ title, rating, message }).unwrap();

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback!",
    });

    setTitle("");
    setMessage("");
    setRating(0);

  } catch (error) {
    console.log("FULL ERROR:", error);
    toast({
      title: "Error",
      description: error?.data?.message || "Something went wrong",
    });
  }
};

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
              <MessageSquarePlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Submit Feedback
              </h2>
              <p className="text-muted-foreground">
                Help us improve your experience
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              placeholder="Brief summary of your feedback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border/50"
            />
          </div>

          {/* Feedback */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">
              Your Feedback
            </label>
            <Textarea
              placeholder="Share your thoughts, suggestions, or experience..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background/50 border-border/50 min-h-[150px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full gradient-button text-white font-semibold py-6"
          disabled={isLoading}
          >
            {isLoading ? "Submiting..." : "Submit Feedback ✨"}
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardFeedback;
