import { Link } from "react-router-dom";
import { GraduationCap, Users, Lightbulb, BookOpen, Building2, ArrowRight } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Schools & Teachers",
    link: "/education",
  },
  {
    icon: Users,
    title: "Students & Youth",
    link: "/education",
  },
  {
    icon: Lightbulb,
    title: "Startups & Innovators",
    link: "/innovation",
  },
  {
    icon: BookOpen,
    title: "Universities & Research",
    link: "/partners",
  },
  {
    icon: Building2,
    title: "Industry & Municipalities",
    link: "/partners",
  },
];

const WhoItsForSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Who It's For
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {audiences.map((audience, index) => (
            <Link 
              key={index}
              to={audience.link}
              className="group bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <audience.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {audience.title}
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
