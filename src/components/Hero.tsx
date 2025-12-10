import { Button } from "@/components/ui/button";
import { Rocket, Wrench, Brain, Sparkles, Cog } from "lucide-react";
import characterLaya from "@/assets/character-laya.png";
import characterKit from "@/assets/character-kit.png";
import characterRobb from "@/assets/character-robb.png";

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

          {/* Character illustrations */}
          <div className="flex items-end justify-center gap-4 md:gap-8 mt-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterLaya} 
                alt="Laya - curious engineer" 
                className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Laya
              </span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterRobb} 
                alt="Robb - friendly robot helper" 
                className="relative w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Robb
              </span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterKit} 
                alt="Kit - adventurous builder" 
                className="relative w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-white font-bold text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Kit
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
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
