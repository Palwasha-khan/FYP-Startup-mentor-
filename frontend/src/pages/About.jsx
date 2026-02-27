import { Rocket, Target, Lightbulb, TrendingUp, Users, Award, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import LandingLayout from "@/components/landing/LandingLayout";

const features = [
  {
    icon: Lightbulb,
    title: "Idea Validation",
    description: "Validate your startup ideas with AI-powered analysis and market insights.",
    gradient: "icon-blue",
  },
  {
    icon: Target,
    title: "Risk Assessment",
    description: "Identify potential risks and challenges before they become problems.",
    gradient: "icon-purple",
  },
  {
    icon: TrendingUp,
    title: "Growth Insights",
    description: "Get data-driven suggestions to accelerate your startup's growth.",
    gradient: "icon-cyan",
  },
];

const team = [
  { name: "AI Analysis", icon: Zap, description: "Advanced algorithms analyze your business model" },
  { name: "Expert Guidance", icon: Users, description: "Built on insights from successful entrepreneurs" },
  { name: "Proven Results", icon: Award, description: "Trusted by hundreds of startups" },
];

const About = () => {
  return (
    <LandingLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Card */}
        <Card className="p-10 bg-white border-border/30 shadow-2xl text-center mb-10 rounded-3xl">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl gradient-primary   mx-auto mb-8 flex items-center justify-center shadow-xl">
            <Rocket className="w-12 h-12 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-600 bg-clip-text text-transparent">
              About Start Up Mentor
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
            Empowering entrepreneurs to transform innovative ideas into successful ventures through structured guidance and data-driven insights
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 bg-gradient-to-r from-purple/5 via-pink/5 to-cyan/5 rounded-2xl p-8">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">1000+</div>
              <div className="text-muted-foreground text-sm mt-1">Ideas Validated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">500+</div>
              <div className="text-muted-foreground text-sm mt-1">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-accent-500 bg-clip-text text-transparent">4.9</div>
              <div className="text-muted-foreground text-sm mt-1">User Rating</div>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 bg-white border-border/30 shadow-xl text-center rounded-2xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className={`w-16 h-16 rounded-2xl ${feature.gradient} mx-auto mb-5 flex items-center justify-center shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Why Choose Us */}
        <Card className="p-10 bg-gradient-to-br from-purple/5 via-pink/5 to-cyan/5 border-border/30 rounded-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              Why Choose Us
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-white shadow-lg mx-auto mb-4 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-foreground">{item.name}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </LandingLayout>
  );
};

export default About;
