import { Button } from "@/components/ui/button";
import { Rocket, Wrench, Brain, Sparkles, Cog } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-24 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        {/* Floating icons */}
        <Cog className="absolute top-20 right-1/4 w-8 h-8 text-white/20 animate-spin" style={{ animationDuration: '8s' }} />
        <Sparkles className="absolute bottom-1/3 left-20 w-6 h-6 text-white/25 animate-bounce" />
        <Wrench className="absolute top-1/2 right-16 w-6 h-6 text-white/20 animate-pulse" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 animate-bounce-in">
          {/* Logo/Icon Section */}
          <div className="flex items-center gap-4 mb-2">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Wrench className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
              BLIX STEM Learning
            </h1>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Brain className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl font-medium drop-shadow">
            Build, Learn, and Explore with 30 Amazing STEM Projects!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 text-lg px-8 py-6 rounded-full font-semibold"
            >
              Meet Our Characters
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-2xl">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-transform border border-white/20 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-white">30</div>
              <div className="text-white/80 font-medium mt-1">Projects</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-transform border border-white/20 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-white">7</div>
              <div className="text-white/80 font-medium mt-1">Languages</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 hover:scale-105 transition-transform border border-white/20 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-white">∞</div>
              <div className="text-white/80 font-medium mt-1">Fun!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
