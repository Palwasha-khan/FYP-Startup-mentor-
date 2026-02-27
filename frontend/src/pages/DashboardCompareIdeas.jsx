import { useState } from "react";
import {
  Scale,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

 
const sampleIdeas = [
  {
    id: 1,
    name: "AI Health Assistant",
    category: "Healthcare",
    viability: 85,
    marketFit: 78,
    innovation: 92,
    riskLevel: "Medium",
    successProbability: 75,
  },
  {
    id: 2,
    name: "EdTech Platform",
    category: "Education",
    viability: 72,
    marketFit: 88,
    innovation: 65,
    riskLevel: "Low",
    successProbability: 82,
  },
  {
    id: 3,
    name: "FinTech Wallet",
    category: "Finance",
    viability: 68,
    marketFit: 70,
    innovation: 75,
    riskLevel: "High",
    successProbability: 58,
  },
];

/* -------------------- HELPERS -------------------- */
const getRiskColor = (risk) => {
  if (risk === "Low") return "bg-green-500/10 text-green-500";
  if (risk === "Medium") return "bg-yellow-500/10 text-yellow-500";
  return "bg-red-500/10 text-red-500";
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

/* -------------------- COMPONENT -------------------- */
export default function DashboardCompareIdeas() {
  const [selectedIdeas, setSelectedIdeas] = useState([
    sampleIdeas[0],
    sampleIdeas[1],
  ]);

  const availableIdeas = sampleIdeas.filter(
    (idea) => !selectedIdeas.some((s) => s.id === idea.id)
  );

  const addIdea = (id) => {
    const idea = sampleIdeas.find((i) => i.id === Number(id));
    if (idea && selectedIdeas.length < 4) {
      setSelectedIdeas([...selectedIdeas, idea]);
    }
  };

  const removeIdea = (id) => {
    if (selectedIdeas.length > 2) {
      setSelectedIdeas(selectedIdeas.filter((i) => i.id !== id));
    }
  };

  const bestIdea = selectedIdeas.reduce((a, b) =>
    b.successProbability > a.successProbability ? b : a
  );

  const lowestRiskIdea = selectedIdeas.reduce((a, b) => {
    const order = { Low: 1, Medium: 2, High: 3 };
    return order[b.riskLevel] < order[a.riskLevel] ? b : a;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <Card className="p-6 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 border-cyan-400/20">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Compare Ideas
                </h2>
                <p className="text-muted-foreground">
                  Analyze and compare startup ideas side by side ⚖️
                </p>
              </div>
            </div>

            {availableIdeas.length > 0 && selectedIdeas.length < 4 && (
              <Select onValueChange={addIdea}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add idea" />
                </SelectTrigger>
                <SelectContent>
                  {availableIdeas.map((idea) => (
                    <SelectItem key={idea.id} value={String(idea.id)}>
                      {idea.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </Card>

        {/* QUICK INSIGHTS */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-green-500/10 border-green-500/20">
            <div className="flex gap-3 items-center">
              <TrendingUp className="text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Highest Success Probability
                </p>
                <p className="font-bold">
                  {bestIdea.name} ({bestIdea.successProbability}%)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-cyan-400/10 border-cyan-400/20">
            <div className="flex gap-3 items-center">
              <CheckCircle className="text-cyan-500" />
              <div>
                <p className="text-sm text-muted-foreground">Lowest Risk</p>
                <p className="font-bold">
                  {lowestRiskIdea.name} ({lowestRiskIdea.riskLevel})
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* COMPARISON TABLE */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left">Metric</th>
                  {selectedIdeas.map((idea) => (
                    <th key={idea.id} className="p-4">
                      <div className="flex justify-center gap-2 items-center">
                        {idea.name}
                        {selectedIdeas.length > 2 && (
                          <button onClick={() => removeIdea(idea.id)}>
                            <X className="w-4 h-4 text-muted-foreground hover:text-red-500" />
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {idea.category}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {[
                  ["Viability", "viability"],
                  ["Market Fit", "marketFit"],
                  ["Innovation", "innovation"],
                  ["Success Probability", "successProbability"],
                ].map(([label, key]) => (
                  <tr key={key}>
                    <td className="p-4 text-left font-medium">{label}</td>
                    {selectedIdeas.map((idea) => (
                      <td key={idea.id} className="p-4">
                        <span
                          className={`text-2xl font-bold ${getScoreColor(
                            idea[key]
                          )}`}
                        >
                          {idea[key]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="p-4 text-left font-medium flex gap-2 items-center">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Level
                  </td>
                  {selectedIdeas.map((idea) => (
                    <td key={idea.id} className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(
                          idea.riskLevel
                        )}`}
                      >
                        {idea.riskLevel}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* RECOMMENDATION */}
        <Card className="p-6 bg-purple-500/10 border-purple-500/20">
          <h3 className="font-bold flex gap-2 items-center">
            <CheckCircle className="text-purple-500" />
            Our Recommendation
          </h3>
          <p className="mt-2 text-muted-foreground">
            <strong>{bestIdea.name}</strong> has the highest success probability (
            {bestIdea.successProbability}%). If you prefer lower risk, consider{" "}
            <strong>{lowestRiskIdea.name}</strong> which has a{" "}
            {lowestRiskIdea.riskLevel.toLowerCase()} risk profile.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
