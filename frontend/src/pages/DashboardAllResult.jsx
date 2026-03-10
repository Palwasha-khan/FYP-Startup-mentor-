import { useSelector } from "react-redux";
import DashboardLayout from "../components/dashboard/DashboardLayout"; 
import { useDeleteIdeaMutation, useGetideasQuery } from "@/redux/api/ideaApi";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Lightbulb, Plus, Target, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";

const DashboardAllResult = () => {

    const { user } = useSelector((state) => state.auth);
    const [deleteIdea] = useDeleteIdeaMutation();
    const { toast } = useToast();
    const { data, isLoading,error } = useGetideasQuery(user?._id, {
      skip: !user?._id,
    });

    const handleDelete = async (id, e) => {
      e.preventDefault(); // stop Link navigation
      e.stopPropagation();

      if (window.confirm("Are you sure you want to delete this idea?")) {
        try {
          await deleteIdea(id).unwrap();
            toast({
        title: "Idea Deleted",
        description: res.message || "Idea removed successfully",
      }); 
        } catch (error) {
          toast({
          title: "Error",
          description: "Failed to delete idea",
          variant: "destructive",
        });
        }
      }
    };
  return (
      <DashboardLayout> 
        <div className="max-w-6xl mx-auto space-y-6">
         <Card className="p-6 bg-gradient-to-br from-card via-card to-muted/20 border-border/50 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-button flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Previous Ideas
              </h2>
              <p className="text-muted-foreground">
                Track your submitted ideas
              </p>
            </div>
          </div>
          <Link to="/dashboard/submit-idea">
            <Button variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              New Idea
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {data?.data?.map((idea) => (
            <Link key={idea.id} to={`/dashboard/results/${idea._id}`}>
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 hover:border-purple-600/30 hover:bg-background/80 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-purple" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground group-hover:text-purple-800 transition-colors">
                        {idea.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {idea.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-cyan">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-bold">{idea.prediction?.innovationScore}%</span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">
                        {idea.status}
                      </span>
                    </div>
                      <button
                        onClick={(e) => handleDelete(idea._id, e)}
                        className="p-2 rounded-lg hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    
                    <ArrowRight className="w-5 h-5 text-gradient group-hover:text-purple transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
      </div>
       
      </DashboardLayout>  
    
  );
};

export default DashboardAllResult; 