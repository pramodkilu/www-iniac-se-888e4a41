import { Button } from "@/components/ui/button";
import { Rocket, Wrench, Brain, Sparkles, Cog, GraduationCap, Eye, Gamepad2, Trophy, Users, BarChart3 } from "lucide-react";
import characterLaya from "@/assets/character-laya.png";
import characterKit from "@/assets/character-kit.png";
import characterRobb from "@/assets/character-robb.png";

const Hero = () => {
  return (
    <>
      {/* Main Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4" style={{ background: 'linear-gradient(135deg, hsl(15 85% 55%) 0%, hsl(5 70% 40%) 100%)' }}>
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
          <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 animate-bounce-in">
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
      </section>

      {/* Platform Features Section */}
      <section className="py-16 md:py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-primary mb-3 uppercase">
              Our Platform
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Building the Future Innovators
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Robotics education should not depend on expensive labs or expert teachers. 
              INIAC makes robotics accessible for every school.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: AI-Guided Learning */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Guided Missions</h3>
              <p className="text-muted-foreground text-sm">
                Interactive learning missions powered by AI that adapt to each student's pace and skill level.
              </p>
            </div>

            {/* Feature 2: AR Build Assistance */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AR Build Guidance</h3>
              <p className="text-muted-foreground text-sm">
                Augmented reality overlays that help students assemble robots with step-by-step visual instructions.
              </p>
            </div>

            {/* Feature 3: VR Simulation Labs */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">VR Simulation Labs</h3>
              <p className="text-muted-foreground text-sm">
                Immersive virtual reality environments where students test and experiment with robotics concepts.
              </p>
            </div>

            {/* Feature 4: Robo League */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2">Robo League Competitions</h3>
              <p className="text-muted-foreground text-sm">
                City-level robotics competitions that motivate students through challenges and real achievements.
              </p>
            </div>

            {/* Feature 5: Teacher Dashboard */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-success/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-success" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teacher Dashboard</h3>
              <p className="text-muted-foreground text-sm">
                Track student progress, manage lessons, and view analytics—no robotics expertise required.
              </p>
            </div>

            {/* Feature 6: Ready-to-Use Modules */}
            <div className="bg-card border rounded-2xl p-6 hover:shadow-lg transition-shadow group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ready-to-Use Lessons</h3>
              <p className="text-muted-foreground text-sm">
                Curriculum-aligned lesson modules that any teacher can deliver without specialized training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">9</div>
              <div className="text-sm text-muted-foreground mt-1">Grade Levels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">270</div>
              <div className="text-sm text-muted-foreground mt-1">STEM Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">AI+AR+VR</div>
              <div className="text-sm text-muted-foreground mt-1">Technologies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground mt-1">Learning Fun</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
