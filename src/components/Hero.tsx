import { Button } from "@/components/ui/button";
import { Rocket, Wrench, Brain, Sparkles, Cog, GraduationCap } from "lucide-react";
import characterLaya from "@/assets/character-laya.png";
import characterKit from "@/assets/character-kit.png";
import characterRobb from "@/assets/character-robb.png";
import learningThroughPlay from "@/assets/learning-through-play.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col" style={{ background: 'linear-gradient(135deg, hsl(15 85% 55%) 0%, hsl(5 70% 40%) 100%)' }}>
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

      <div className="container mx-auto max-w-6xl relative z-10 flex-1 flex items-center py-12 md:py-16 px-6 md:px-8">
        <div className="flex flex-col items-center text-center space-y-5 md:space-y-6 w-full animate-bounce-in">
          {/* INIAC Badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <Brain className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-sm">AI + AR/VR Robotics Learning Platform</span>
          </div>
          
          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
              INIAC
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-medium max-w-3xl drop-shadow">
              Robotics for Every School
            </p>
          </div>
          
          <p className="text-base md:text-lg text-white/85 max-w-2xl leading-relaxed">
            INIAC combines <strong>AI + AR + VR</strong> to make robotics easy, fun, and scalable. 
            With Blix robotics kits and guided learning, students build real robots, learn through 
            immersive simulations, and compete in Robo League challenges.
          </p>

          {/* Character illustrations */}
          <div className="flex items-end justify-center gap-4 md:gap-8 mt-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterLaya} 
                alt="Laya - curious engineer" 
                className="relative w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Laya
              </span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterRobb} 
                alt="Robb - friendly robot helper" 
                className="relative w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Robb
              </span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all"></div>
              <img 
                src={characterKit} 
                alt="Kit - adventurous builder" 
                className="relative w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300 hover:-translate-y-2"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-white font-bold text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Kit
              </span>
            </div>
          </div>

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
              <GraduationCap className="mr-2 h-5 w-5" />
              For Schools
            </Button>
          </div>

          {/* Powered by badge */}
          <div className="mt-6 flex items-center gap-3 text-white/80 text-sm">
            <span>Powered by</span>
            <div className="flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full">
              <Wrench className="w-4 h-4" />
              <span className="font-bold tracking-wide">Blix Robotics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Through Play Banner */}
      <div className="w-full mt-auto">
        <img 
          src={learningThroughPlay} 
          alt="Experience Learning Through Play" 
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default Hero;
