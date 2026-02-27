import { Rocket, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="gradient-hero min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-24 relative overflow-hidden">
      {/* Colorful animated dots background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Pink dots */}
        <div className="absolute top-[10%] left-[5%] w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
        <div className="absolute top-[25%] left-[15%] w-2 h-2 bg-pink-300 rounded-full animate-ping" />
        <div className="absolute top-[60%] left-[8%] w-4 h-4 bg-pink-500 rounded-full animate-bounce" />
        <div className="absolute top-[80%] left-[20%] w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500" />
        
        {/* Purple dots */}
        <div className="absolute top-[15%] left-[30%] w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300" />
        <div className="absolute top-[40%] left-[5%] w-3 h-3 bg-purple-300 rounded-full animate-ping delay-700" />
        <div className="absolute top-[70%] left-[35%] w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200" />
        
        {/* Cyan dots */}
        <div className="absolute top-[20%] right-[10%] w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-500" />
        <div className="absolute top-[45%] right-[5%] w-2 h-2 bg-cyan-300 rounded-full animate-pulse delay-100" />
        <div className="absolute top-[75%] right-[15%] w-4 h-4 bg-cyan-500 rounded-full animate-ping delay-800" />
        
        {/* Yellow/Gold dots */}
        <div className="absolute top-[30%] right-[25%] w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-400" />
        <div className="absolute top-[55%] right-[30%] w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-600" />
        <div className="absolute top-[85%] right-[40%] w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-300" />
        
        {/* White dots scattered */}
        <div className="absolute top-[12%] left-[50%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-[35%] left-[70%] w-2 h-2 bg-white/80 rounded-full animate-bounce delay-200" />
        <div className="absolute top-[65%] left-[60%] w-1.5 h-1.5 bg-white rounded-full animate-ping delay-500" />
        <div className="absolute top-[90%] left-[45%] w-2 h-2 bg-white/70 rounded-full animate-pulse delay-700" />
        
        {/* Additional colorful dots */}
        <div className="absolute top-[5%] left-[80%] w-2 h-2 bg-rose-400 rounded-full animate-bounce" />
        <div className="absolute top-[50%] left-[2%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse delay-400" />
        <div className="absolute top-[95%] left-[75%] w-2 h-2 bg-teal-400 rounded-full animate-ping delay-600" />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl" />
      
      {/* Badge */}
      <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm mb-6 shadow-xl">
        <Rocket className="w-4 h-4" />
        AI-Powered Startup Analysis
        <Sparkles className="w-4 h-4" />
      </div>
      
      {/* Main heading - more compact */}
      <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-3xl leading-tight tracking-tight">
        Turn Your Ideas Into{" "}
        <span className="gradient-text">Successful Startups</span>
      </h1>
      
      {/* Subtitle - more compact */}
      <p className="relative z-10 text-base md:text-lg text-white/90 max-w-lg mb-8 leading-relaxed">
        AI-powered insights to evaluate, predict success, and make data-driven decisions.
      </p>

      {/* Trust indicators */}
      <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-white/80 text-sm">
          <CheckCircle2 className="w-4 h-4 text-success" />
          Free to start
        </div>
        <div className="flex items-center gap-1.5 text-white/80 text-sm">
          <CheckCircle2 className="w-4 h-4 text-success" />
          No credit card
        </div>
        <div className="flex items-center gap-1.5 text-white/80 text-sm">
          <CheckCircle2 className="w-4 h-4 text-success" />
          500+ users
        </div>
      </div>
      
      {/* CTA Buttons */}
      <div className="relative z-10 flex flex-col sm:flex-row gap-3">
        <Link to="/auth">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Link to="/about">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1 border-0"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;