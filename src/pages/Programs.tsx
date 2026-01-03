import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Users, 
  Rocket, 
  Calendar,
  ArrowRight,
  Clock,
  Target
} from "lucide-react";

const programs = [
  { 
    icon: Bot, 
    title: "Robotics League", 
    desc: "Competitive robotics programs for schools with tournaments and challenges",
    duration: "Academic year",
    audience: "Schools & Students"
  },
  { 
    icon: Users, 
    title: "Teacher Training", 
    desc: "Professional development in STEM pedagogy and robotics instruction",
    duration: "2-5 days",
    audience: "Educators"
  },
  { 
    icon: Rocket, 
    title: "Startup Sprint", 
    desc: "Intensive programs for startups looking to enter new markets",
    duration: "4-8 weeks",
    audience: "Startups"
  },
  { 
    icon: Calendar, 
    title: "Innovation Workshops", 
    desc: "Hands-on sessions focused on problem-solving and ideation",
    duration: "1-3 days",
    audience: "All"
  },
];

const Programs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-accent/20 to-accent/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Programs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From robotics education to startup acceleration, explore our range of programs
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <program.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{program.title}</h3>
                      <p className="text-muted-foreground text-sm">{program.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {program.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {program.audience}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Interested in Our Programs?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us to learn more about specific programs and how to participate.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
