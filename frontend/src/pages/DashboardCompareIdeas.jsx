import { useState, useEffect } from "react";
import { 
  Scale, TrendingUp, X, Loader2, MessageSquare, ThumbsDown, Star, AlertTriangle 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useGetideasQuery } from "@/redux/api/ideaApi";

export default function DashboardCompareIdeas() {
  const { data: response, isLoading } = useGetideasQuery();
  const [selectedIds, setSelectedIds] = useState([]);

  const allIdeas = response?.data || [];

  useEffect(() => {
    if (allIdeas.length >= 2 && selectedIds.length === 0) {
      setSelectedIds([allIdeas[0]._id, allIdeas[1]._id]);
    }
  }, [allIdeas, selectedIds]);

  // Helper for dynamic risk calculation
  const getRisk = (prob) => {
    if (prob >= 75) return { label: "Low", css: "bg-green-500/10 text-green-600" };
    if (prob >= 50) return { label: "Medium", css: "bg-yellow-500/10 text-yellow-600" };
    return { label: "High", css: "bg-red-500/10 text-red-600" };
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generating Comparison...</p>
      </div>
    </DashboardLayout>
  );

  const selectedIdeas = allIdeas
    .filter(idea => selectedIds.includes(idea._id))
    .map(idea => {
      const prob = idea.prediction?.viabilityScore || 0;
      return {
        id: idea._id,
        name: idea.title,
        category: idea.category,
        probability: prob,
        rating: idea.prediction?.averageRating || 0,
        positive: idea.prediction?.positiveComments || 0,
        negative: idea.prediction?.negativeComments || 0,
        risk: getRisk(prob)
      };
    });

  const availableIdeas = allIdeas.filter(idea => !selectedIds.includes(idea._id));

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        <Card className="p-6 border-border/50 bg-card/50 backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-4 items-center">
              <Scale className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Idea Matrix</h2>
                <p className="text-sm text-muted-foreground">Calculated risk and performance comparison</p>
              </div>
            </div>

            {availableIdeas.length > 0 && selectedIds.length < 4 && (
              <Select onValueChange={(id) => setSelectedIds([...selectedIds, id])}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Add idea to compare" />
                </SelectTrigger>
                <SelectContent>
                  {availableIdeas.map(idea => (
                    <SelectItem key={idea._id} value={idea._id}>{idea.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        {selectedIdeas.length >= 2 ? (
          <Card className="overflow-hidden border-border/50 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-center border-collapse">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="p-6 text-left text-xs font-bold uppercase text-muted-foreground tracking-widest">Key Metrics</th>
                    {selectedIdeas.map((idea) => (
                      <th key={idea.id} className="p-6 min-w-[200px]">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base">{idea.name}</span>
                            {selectedIds.length > 2 && (
                              <X 
                                className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-red-500 transition-colors" 
                                onClick={() => setSelectedIds(selectedIds.filter(id => id !== idea.id))}
                              />
                            )}
                          </div>
                          <Badge variant="secondary" className="text-[9px] h-4 px-1 uppercase">{idea.category}</Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {/* Derived Risk Level */}
                  <tr className="bg-muted/10">
                    <td className="p-6 text-left font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Derived Risk
                    </td>
                    {selectedIdeas.map(idea => (
                      <td key={idea.id} className="p-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${idea.risk.css}`}>
                          {idea.risk.label} Risk
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Probability */}
                  <tr>
                    <td className="p-6 text-left font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500"/> Success Probability
                    </td>
                    {selectedIdeas.map(idea => (
                      <td key={idea.id} className="p-6 text-2xl font-black text-green-600 italic">
                        {idea.probability}%
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="p-6 text-left font-medium flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500"/> AI Avg Rating
                    </td>
                    {selectedIdeas.map(idea => (
                      <td key={idea.id} className="p-6 text-2xl font-bold">
                        {idea.rating}<span className="text-sm text-muted-foreground font-normal">/5</span>
                      </td>
                    ))}
                  </tr>

                  {/* Feedback */}
                  <tr>
                    <td className="p-6 text-left font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-500"/> Positive Feedback
                    </td>
                    {selectedIdeas.map(idea => (
                      <td key={idea.id} className="p-6 text-xl font-semibold">{idea.positive}</td>
                    ))}
                  </tr>

                  <tr>
                    <td className="p-6 text-left font-medium flex items-center gap-2 text-red-500">
                      <ThumbsDown className="w-4 h-4"/> Critical Points
                    </td>
                    {selectedIdeas.map(idea => (
                      <td key={idea.id} className="p-6 text-xl font-semibold text-red-500">{idea.negative}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="py-24 text-center border-2 border-dashed rounded-3xl bg-muted/20">
             <Scale className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
             <p className="text-muted-foreground font-medium">Please add at least 2 ideas to view the comparison matrix.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}