import { Link } from "react-router-dom";
import {
  Lightbulb,
  Clock,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDeleteIdeaMutation, useGetideasQuery } from "@/redux/api/ideaApi";
import { useSelector } from "react-redux";
import { Trash2 } from "lucide-react";
import { toast, useToast } from "@/hooks/use-toast";
const DashboardHome = () => {

  const { user } = useSelector((state) => state.auth);
  const [deleteIdea] = useDeleteIdeaMutation();
  const { toast } = useToast();
const { data, isLoading,error } = useGetideasQuery(user?._id, {
  skip: !user?._id,
});
const handleDelete = async (id, e) => {
  e.preventDefault();
  e.stopPropagation();

  if (window.confirm("Are you sure you want to delete this idea?")) {
    try {
      const res = await deleteIdea(id).unwrap();

      toast({
        title: "Idea Deleted",
        description: res?.message || "Idea removed successfully",
      });

    } catch (error) {
      console.log("DELETE ERROR:", error);

      toast({
        title: "Error",
        description: error?.data?.message || "Failed to delete idea",
        variant: "destructive",
      });
    }
  }
};
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Submit New Idea Card */}
        <Link to="/dashboard/submit-idea">
          <Card className="p-6 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 border-cyan-400/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500
 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Submit New Idea
                </h2>
                <p className="text-muted-foreground">
                  Start validating your next big thing
                </p>
              </div>
              <ArrowRight className="w-6 h-6 ml-auto text-muted-foreground group-hover:text-cyan-500 transition-colors" />
            </div>
          </Card>
        </Link>

        {/* Submit Feedback Card */}
        <Link to="/dashboard/feedback">
          <Card className="p-6 bg-gradient-to-br from-pink-400/10 to-purple-600/10 border-pink-500/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                  Submit Feedback
                </h2>
                <p className="text-muted-foreground">
                  Help us improve your experience
                </p>
              </div>
              <ArrowRight className="w-6 h-6 ml-auto text-muted-foreground group-hover:text-pink-500 transition-colors" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Previous Ideas Section */}
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
          {data?.data?.slice(0, 3).map((idea) => (
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
  );
};

export default DashboardHome;
