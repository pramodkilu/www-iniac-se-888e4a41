import { Brain, Eye, Gamepad2, Trophy, BarChart3, Users } from "lucide-react";

const PlatformFeatures = () => {
  return (
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
  );
};

export default PlatformFeatures;
