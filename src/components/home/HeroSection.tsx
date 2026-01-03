import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Handshake, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 px-4" style={{ background: 'linear-gradient(135deg, hsl(15 85% 55%) 0%, hsl(5 70% 40%) 100%)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        <Sparkles className="absolute top-20 right-1/4 w-8 h-8 text-white/20 animate-pulse" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 animate-bounce-in">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-bold text-3xl">I</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg">
            INIAC
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 font-medium">
            Indo Nordic-Baltic Innovation Cluster
          </p>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed mt-4">
            Connecting schools, universities, startups, and industry across the Nordic-Baltic region and India through education, innovation, and applied technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button 
              asChild
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold"
            >
              <Link to="/education">
                <GraduationCap className="mr-2 h-5 w-5" />
                For Schools
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 text-lg px-8 py-6 rounded-full font-semibold"
            >
              <Link to="/partners">
                <Handshake className="mr-2 h-5 w-5" />
                For Partners
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
