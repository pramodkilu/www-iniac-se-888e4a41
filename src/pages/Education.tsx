import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Bot, 
  Users, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Wrench,
  Heart
} from "lucide-react";

const ageGroups = [
  { grade: "Grades 1-3", age: "Ages 6-9", focus: "Basic STEM concepts, simple robotics" },
  { grade: "Grades 4-6", age: "Ages 9-12", focus: "Intermediate projects, coding basics" },
  { grade: "Grades 7-9", age: "Ages 12-15", focus: "Advanced robotics, problem-solving" },
];

const offerings = [
  { icon: BookOpen, title: "Structured Curriculum", desc: "Age-appropriate STEM learning materials" },
  { icon: Wrench, title: "Robotics Kits", desc: "Hands-on building and programming tools" },
  { icon: Users, title: "Teacher Training", desc: "Professional development programs" },
  { icon: Shield, title: "Safe & Structured", desc: "Non-profit, child-safe environment" },
];

const Education = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, hsl(180 65% 45%) 0%, hsl(180 65% 35%) 100%)' }}>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Education & Schools
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Bringing hands-on STEM and robotics education to schools across the Nordic-Baltic region
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What We Offer to Schools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerings.map((item, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-md border border-border text-center">
                  <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Age Groups */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Programs by Age Group
            </h2>
            <div className="space-y-4">
              {ageGroups.map((group, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-sm border border-border flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <span className="inline-block bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-semibold text-sm">
                      {group.grade}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-muted-foreground text-sm mb-1">{group.age}</p>
                    <p className="text-foreground font-medium">{group.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Safe, Structured, Non-Profit
            </h2>
            <p className="text-muted-foreground mb-8">
              INIAC is a non-profit initiative focused on providing quality STEM education. 
              We prioritize child safety, structured learning environments, and transparent operations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Child-safe environment", "Trained educators", "Transparent operations", "No commercial agenda"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-secondary">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-secondary-foreground mb-4">
              Bring INIAC to Your School
            </h2>
            <p className="text-secondary-foreground/80 mb-8">
              Contact us to learn more about our programs and how we can collaborate.
            </p>
            <Button asChild size="lg" className="rounded-full bg-white text-secondary hover:bg-white/90">
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

export default Education;
