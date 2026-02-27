import { Brain, MapPin, TrendingUp, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Advanced algorithms analyze your business model and market",
    gradient: "icon-blue",
  },
  {
    icon: MapPin,
    title: "Local Insights",
    description: "Location-based data to understand your market dynamics",
    gradient: "icon-cyan",
  },
  {
    icon: TrendingUp,
    title: "Success Prediction",
    description: "Data-driven forecasts of your startup's success",
    gradient: "icon-purple",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify potential risks and get actionable insights",
    gradient: "icon-teal",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            ✨ Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            <span className="text-secondary">Smart</span>{" "}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Startup Evaluation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Make informed decisions with our AI-powered platform built specifically for Pakistani entrepreneurs
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border/30 rounded-2xl group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
