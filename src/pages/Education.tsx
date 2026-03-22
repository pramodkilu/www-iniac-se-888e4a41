import Header from "@/components/Header";
import { GraduationCap, Globe, Heart, Sparkles, BookOpen, Users, Lightbulb, TreePine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import sipsFramework from "@/assets/sips-curriculum-framework.png";
import sweskolaLogo from "@/assets/sweskola-logo.png";

const pillars = [
  {
    number: "01",
    title: "How We Express Ourselves",
    focus: "Creative expression – creativity through language, art, music, and movement.",
    skills: "Artistic expression, motor skills, sensory exploration.",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
  },
  {
    number: "02",
    title: "How the World Works",
    focus: "Exploring the world around us – natural phenomena, basic scientific principles, exploration through play.",
    skills: "Scientific thinking, curiosity, problem-solving.",
    icon: Lightbulb,
    color: "bg-secondary/10 text-secondary",
  },
  {
    number: "03",
    title: "How We Organize Ourselves",
    focus: "Organizing our communities – understanding community, roles, responsibilities, and problem-solving.",
    skills: "Teamwork, responsibility, organization.",
    icon: Users,
    color: "bg-accent/10 text-accent-foreground",
  },
  {
    number: "04",
    title: "Where We Are in Place and Time",
    focus: "Our place in the world and in time – understanding time, orientation in time (past/present), family, local/global communities.",
    skills: "Observation, inquiry, creative thinking.",
    icon: Globe,
    color: "bg-success/10 text-success",
  },
  {
    number: "05",
    title: "Sharing the Planet",
    focus: "Caring for our planet – environment, sustainability, and empathy toward living things.",
    skills: "Environmental awareness, empathy, sustainable practices.",
    icon: TreePine,
    color: "bg-secondary/10 text-secondary",
  },
  {
    number: "06",
    title: "Who We Are",
    focus: "Understanding ourselves – self-awareness, cultural identity, respect for diversity, personal and social development.",
    skills: "Communication, social skills, emotional awareness.",
    icon: Heart,
    color: "bg-primary/10 text-primary",
  },
];

const Education = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Hero */}
        <section
          className="relative py-20 md:py-28 px-6 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, hsl(220 30% 18%) 0%, hsl(200 40% 25%) 50%, hsl(180 45% 30%) 100%)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto max-w-5xl relative z-10 text-center space-y-6">
            <img
              src={sweskolaLogo}
              alt="SweSkola logo"
              className="w-24 h-24 md:w-32 md:h-32 mx-auto drop-shadow-2xl"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Swedish International<br />PYP School
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              A Vision Rooted in Nordic Values, Brought to Life by INIAC
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-20 px-6">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-7 h-7 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">About SIPS</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              The <strong className="text-foreground">Swedish International PYP School (SIPS)</strong> is a
              flagship educational initiative started by{" "}
              <strong className="text-foreground">
                INIAC (Indo-Nordic Innovation & Acceleration Cluster)
              </strong>{" "}
              in 2019. INIAC was founded to foster cross-border collaboration between India and the
              Nordic countries in the fields of innovation, education, and entrepreneurship.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Through years of working with Nordic partners, INIAC recognized a growing demand for
              early childhood and primary education models that focus on{" "}
              <strong className="text-foreground">
                creativity, well-being, independence, and holistic development
              </strong>
              —hallmarks of the Swedish education system.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 px-6 bg-muted/50">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
              <TreePine className="w-4 h-4" />
              A New Chapter in Global Learning
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Mission</h2>
            <blockquote className="text-xl md:text-2xl italic text-muted-foreground max-w-3xl mx-auto leading-relaxed border-l-4 border-primary pl-6 text-left">
              "To nurture lifelong learners through joyful inquiry, cultural openness, and a
              globally inspired yet locally rooted education system."
            </blockquote>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              With SIPS, INIAC is not just starting a school—it is building a{" "}
              <strong className="text-foreground">movement</strong> that redefines what it means to
              grow, learn, and thrive in a globalized world.
            </p>
          </div>
        </section>

        {/* Curriculum Framework Image */}
        <section className="py-16 md:py-20 px-6">
          <div className="container mx-auto max-w-5xl space-y-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              The Pillars of Our Curriculum
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our PYP framework is built on six transdisciplinary themes that guide inquiry-based learning.
            </p>
            <img
              src={sipsFramework}
              alt="SIPS Curriculum Framework – 6 pillars of the PYP programme"
              className="w-full max-w-4xl mx-auto rounded-2xl shadow-xl"
            />
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="py-16 px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pillars.map((pillar) => (
                <Card
                  key={pillar.number}
                  className="border-none shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${pillar.color}`}
                      >
                        <pillar.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">
                        {pillar.number}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Focus:</strong> {pillar.focus}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Skills:</strong> {pillar.skills}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center">
          <div className="container mx-auto max-w-3xl space-y-6">
            <GraduationCap className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-3xl font-bold text-foreground">
              Interested in SIPS for Your Child?
            </h2>
            <p className="text-muted-foreground text-lg">
              Join a community that values creativity, curiosity, and global citizenship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="rounded-full px-8">
                  Get Started
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Education;
