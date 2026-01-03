import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bot, Users, Rocket, Calendar, ArrowRight } from "lucide-react";

const programs = [
  {
    icon: Bot,
    title: "Robotics & STEM Programs for Schools",
  },
  {
    icon: Users,
    title: "Teacher Training & Capacity Building",
  },
  {
    icon: Rocket,
    title: "Startup & Innovation Sprints",
  },
  {
    icon: Calendar,
    title: "Innovation Challenges & Events",
  },
];

const ProgramsSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Our Programs
        </h2>

        <div className="space-y-4">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 bg-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-border group hover:border-primary/30"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <program.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground flex-grow">
                {program.title}
              </h3>
              <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/programs">
              View Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
