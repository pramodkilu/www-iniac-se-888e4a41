import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Bot, Brain, Eye, Cpu, Layers, Rocket, GraduationCap,
  Wrench, Globe, Zap, Target, Users, CheckCircle, ArrowRight,
  Cog, Monitor, Smartphone, School, BookOpen
} from "lucide-react";
import robotteknikLogo from "@/assets/robotteknik-logo.png";
import aiarvionLogo from "@/assets/sweskola-robo-aiarvion-logo.png";

const Programs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 px-6"
          style={{ background: 'linear-gradient(135deg, hsl(210 60% 12%) 0%, hsl(220 50% 18%) 50%, hsl(210 40% 15%) 100%)' }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Layers className="w-4 h-4 text-orange-400" />
              <span className="text-white/90 text-sm font-medium">One Integrated System</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Programs</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12">
              Physical robots, AI intelligence, and AR visualisation come together to create 
              measurable, scalable learning experiences. This is not a lab simulation or a demo project.
            </p>

            {/* Two Product Logos */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/40 transition-all hover:bg-white/10">
                  <img src={aiarvionLogo} alt="SweSkolaRobo AIARVION™" className="h-28 md:h-36 object-contain" />
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <div className="w-16 h-px bg-gradient-to-r from-blue-400 to-orange-400" />
                <Zap className="w-6 h-6 text-orange-400 mx-2" />
                <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-yellow-400" />
              </div>
              <div className="group">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-yellow-400/40 transition-all hover:bg-white/10">
                  <img src={robotteknikLogo} alt="Robotteknik" className="h-28 md:h-36 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrated System Overview */}
        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Two Products. One Ecosystem.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Designed, tested, and deployed in real educational environments — not demos.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* AIARVION Card */}
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card group hover:shadow-2xl transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700" />
                <div className="p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-7 h-7 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">SweSkolaRobo AIARVION™</h3>
                      <p className="text-blue-500 font-medium text-sm mt-1">AI & AR Powered Robotics Learning Platform</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    The intelligence layer that powers the entire learning experience. AIARVION combines 
                    artificial intelligence with augmented reality to transform how students interact with 
                    robotics — from guided assembly to real-time physics simulation.
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: Eye, text: "AR-guided robot assembly & 3D visualisation" },
                      { icon: Brain, text: "AI-powered component recognition via camera" },
                      { icon: Monitor, text: "Real-time physics simulation & testing" },
                      { icon: Cpu, text: "Adaptive learning paths based on student progress" },
                      { icon: Globe, text: "Cloud-connected analytics dashboard" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <item.icon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-foreground/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Robotteknik Card */}
              <div className="relative rounded-3xl overflow-hidden border border-border bg-card group hover:shadow-2xl transition-all">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
                <div className="p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-7 h-7 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Robotteknik</h3>
                      <p className="text-yellow-600 font-medium text-sm mt-1">Physical Robotics Kits & Hardware</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    The physical foundation — real robots built by real students. Robotteknik provides 
                    the curriculum-aligned hardware kits that bring STEM concepts to life through 
                    hands-on construction, programming, and competition.
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: Wrench, text: "Grade-specific robotics kits (Grades 1–9)" },
                      { icon: Cog, text: "Modular components: motors, sensors, gears, frames" },
                      { icon: Smartphone, text: "Bluetooth-enabled for app-controlled builds" },
                      { icon: Target, text: "Competition-ready for SweSkola RoboLeague" },
                      { icon: School, text: "Teacher training & classroom deployment guides" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <item.icon className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                        <span className="text-foreground/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How They Work Together */}
        <section className="py-16 md:py-24 px-6"
          style={{ background: 'linear-gradient(180deg, hsl(var(--muted)) 0%, hsl(var(--background)) 100%)' }}
        >
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                The Learning Loop
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A hybrid digital-physical interaction cycle that repeats every chapter — building real competency, not just awareness.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Watch", desc: "Animated story chapters with voice-over introduce concepts through narrative", icon: Monitor, color: "text-blue-500", bg: "bg-blue-500/10" },
                { step: "02", title: "Interact", desc: "Drag-and-place mechanics, quizzes, and AI-guided exploration in the app", icon: Smartphone, color: "text-purple-500", bg: "bg-purple-500/10" },
                { step: "03", title: "Build", desc: "Physical robot construction guided by 3D models and AR overlays", icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10" },
                { step: "04", title: "Verify", desc: "AI camera recognition scans your build and confirms component placement", icon: Eye, color: "text-green-500", bg: "bg-green-500/10" },
                { step: "05", title: "Simulate", desc: "Physics simulations test friction, gears, circuits, and aerodynamics", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                { step: "06", title: "Compete & Level Up", desc: "Earn XP, unlock missions, and compete in SweSkola RoboLeague", icon: Rocket, color: "text-red-500", bg: "bg-red-500/10" },
              ].map((item) => (
                <div key={item.step} className="relative bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all group">
                  <span className="absolute top-4 right-4 text-4xl font-black text-muted/30 group-hover:text-primary/20 transition-colors">{item.step}</span>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Students Gain */}
        <section className="py-16 md:py-24 px-6 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Real Skills. Real Deployment.
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  Students at INIAC build systems that are designed, tested, and deployed in real 
                  educational environments — gaining hands-on experience in robotics, AI, AR, and 
                  platform engineering with international exposure.
                </p>

                <div className="space-y-4">
                  {[
                    "Robotics design & physical assembly",
                    "AI model interaction & prompt engineering",
                    "Augmented Reality development & 3D modelling",
                    "Platform engineering & cloud analytics",
                    "Competition strategy & team collaboration",
                    "International exposure across Nordic-India corridor",
                  ].map((skill, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: "9", label: "Grade Levels", sub: "Grades 1–9 covered" },
                  { number: "6", label: "Learning Domains", sub: "Watch → Compete cycle" },
                  { number: "2", label: "Products", sub: "AIARVION + Robotteknik" },
                  { number: "∞", label: "Possibilities", sub: "Real-world deployment" },
                ].map((stat, i) => (
                  <div key={i} className="bg-card rounded-2xl p-6 border border-border text-center hover:border-primary/30 transition-all">
                    <div className="text-4xl font-black text-primary mb-1">{stat.number}</div>
                    <div className="font-semibold text-foreground text-sm">{stat.label}</div>
                    <div className="text-muted-foreground text-xs mt-1">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20 px-6"
          style={{ background: 'linear-gradient(135deg, hsl(15 85% 55%) 0%, hsl(5 70% 40%) 100%)' }}
        >
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Bring INIAC to Your School?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              From robotics kits to AI-powered platforms — deploy a complete STEM ecosystem in your classroom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl">
                <Link to="/curriculum">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View Full Curriculum
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold shadow-xl">
                <Link to="/education">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  For Schools
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-2 border-white/40 hover:bg-white/20 rounded-full px-8 py-6 text-lg font-semibold">
                <Link to="/roboliga/register">
                  <Users className="mr-2 h-5 w-5" />
                  Join RoboLeague
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Programs;
