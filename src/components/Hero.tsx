import { Button } from "@/components/ui/button";
import { Rocket, Wrench, Brain } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center space-y-8 animate-bounce-in">
          <div className="flex items-center gap-4">
            <Wrench className="w-16 h-16 text-card animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold text-card">
              BLIX STEM Learning
            </h1>
            <Brain className="w-16 h-16 text-card animate-pulse" />
          </div>
          
          <p className="text-xl md:text-2xl text-card max-w-2xl font-medium">
            Build, Learn, and Explore with 30 Amazing STEM Projects!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              size="lg" 
              className="bg-card text-primary hover:bg-card/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-card/10 backdrop-blur-sm text-card border-card hover:bg-card/20 text-lg px-8 py-6 rounded-full"
            >
              Meet Our Characters
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-12 w-full max-w-2xl">
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-card">30</div>
              <div className="text-card/90 font-medium">Projects</div>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-card">7</div>
              <div className="text-card/90 font-medium">Languages</div>
            </div>
            <div className="bg-card/10 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold text-card">∞</div>
              <div className="text-card/90 font-medium">Fun!</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-card/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-card/20 rounded-full blur-xl animate-pulse"></div>
    </section>
  );
};

export default Hero;
