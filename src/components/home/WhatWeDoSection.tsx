import { Brain, Rocket, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Education & Robotics",
    description: "STEM, robotics, teacher training, school innovation programs",
    color: "from-secondary to-secondary/70",
  },
  {
    icon: Rocket,
    title: "Innovation & Startups",
    description: "Startup soft-landing, pilots, industry collaboration",
    color: "from-primary to-primary/70",
  },
  {
    icon: Globe,
    title: "Cross-Border Collaboration",
    description: "India ↔ Nordic-Baltic knowledge and talent exchange",
    color: "from-accent to-accent/70",
  },
];

const WhatWeDoSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          What INIAC Does
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Building bridges between education, innovation, and industry
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-card rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-border"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
