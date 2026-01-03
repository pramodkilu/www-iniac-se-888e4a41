import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Landmark,
  ArrowRight,
  Handshake
} from "lucide-react";

const partnerCategories = [
  { 
    icon: GraduationCap, 
    title: "Schools & Education", 
    desc: "Primary and secondary schools implementing STEM and robotics programs",
    examples: "Schools across Sweden, Latvia, Lithuania, Estonia, and India"
  },
  { 
    icon: BookOpen, 
    title: "Universities & Research", 
    desc: "Higher education institutions collaborating on research and talent development",
    examples: "University partnerships for innovation and knowledge exchange"
  },
  { 
    icon: Building2, 
    title: "Industry & Sponsors", 
    desc: "Companies supporting education and innovation initiatives",
    examples: "Technology companies, educational suppliers, innovation leaders"
  },
  { 
    icon: Landmark, 
    title: "Public Sector", 
    desc: "Municipalities and government bodies supporting regional development",
    examples: "Municipal education departments, regional development agencies"
  },
];

const Partners = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, hsl(230 35% 25%) 0%, hsl(230 35% 15%) 100%)' }}>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Partners
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              INIAC works as a neutral, non-profit collaboration platform
            </p>
          </div>
        </section>

        {/* Partner Categories */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <div className="space-y-6">
              {partnerCategories.map((category, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 md:p-8 shadow-md border border-border">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{category.title}</h3>
                      <p className="text-muted-foreground mb-3">{category.desc}</p>
                      <p className="text-sm text-muted-foreground/70 italic">{category.examples}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration Platform */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              A Neutral Collaboration Platform
            </h2>
            <p className="text-muted-foreground mb-8">
              INIAC operates as a non-profit initiative, bringing together diverse stakeholders 
              without commercial bias. We facilitate connections, share resources, and build 
              partnerships that benefit all participants.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Become a Partner
            </h2>
            <p className="text-muted-foreground mb-8">
              Join our network and collaborate with schools, universities, startups, and industry leaders.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contact">
                Partner with Us
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

export default Partners;
