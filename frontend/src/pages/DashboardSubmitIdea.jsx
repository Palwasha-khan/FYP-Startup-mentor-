import { useState } from "react";
import { Lightbulb, Target, MapPin, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitIdeaMutation } from "@/redux/api/ideaApi";
import { useToast } from "@/hooks/use-toast"; 

const categories = [
  'Technology', 'Health', 'Education', 'Finance','Food', 'Other'
];

const DashboardSubmitIdea = () => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [funding, setFunding] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  
   const [submitidea, { isLoading }] =  useSubmitIdeaMutation();
  
   const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await submitidea({ title,category, location, description,funding }).unwrap();
  
      toast({
        title: "Idea Submitted",
        description: "here's your Idea Prediction",
      });
  
       navigate(`/dashboard/results/${response.idea._id}`);
  
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
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                Submit Your Idea
              </h2>
              <p className="text-muted-foreground">
                Transform your vision into reality ✨
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Idea Title
            </label>
             <Input
                placeholder="Your's Startup Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background/50 border-border/50"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Target className="w-4 h-4 text-pink-500" />
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background/50 border-border/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 text-cyan-500" />
                Location
              </label>
              <Input
                placeholder="e.g., San Francisco, Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background/50 border-border/50"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Idea Funding
            </label>
             <Input
                placeholder="Your's Startup Funding"
                value={funding}
                onChange={(e) => setFunding(e.target.value)}
                className="bg-background/50 border-border/50"
              />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Idea Description
            </label>
            <Textarea
              placeholder="Describe your innovative startup idea in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/50 border-border/50 min-h-[200px]"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full gradient-button text-white font-semibold py-6"
            disabled={isLoading}
            >
            {isLoading ? "Analyzing..." : "Analyze My Idea ✨"}🚀 
          </Button>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardSubmitIdea;
