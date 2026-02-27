import { Button } from "@/components/ui/button";
import { Target, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="gradient-cta py-24 px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-button text-white text-sm font-medium mb-8 shadow-xl">
          <Target className="w-4 h-4" />
          GET STARTED TODAY
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ready to Validate Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Startup Idea?
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Join hundreds of Pakistani entrepreneurs making smarter business decisions with AI-powered insights
        </p>

        {/* CTA Button */}
        <Link to="/auth">
          <Button
            size="lg"
            className="gradient-button text-white px-12 py-7 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
          >
            🚀 Start Your Free Evaluation
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
