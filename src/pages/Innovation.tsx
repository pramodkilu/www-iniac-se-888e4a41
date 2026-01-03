import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Plane, 
  Handshake, 
  Globe, 
  ArrowRight,
  Building2,
  Lightbulb,
  Target
} from "lucide-react";

const services = [
  { 
    icon: Plane, 
    title: "Soft-Landing Programs", 
    desc: "Support for startups entering Nordic-Baltic or Indian markets" 
  },
  { 
    icon: Target, 
    title: "Pilot Projects", 
    desc: "Test and validate your solutions with local partners" 
  },
  { 
    icon: Building2, 
    title: "Industry Collaboration", 
    desc: "Connect with established companies for partnerships" 
  },
  { 
    icon: Globe, 
    title: "Market Access", 
    desc: "Navigate regulatory and business environments" 
  },
];

const Innovation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(15 85% 45%) 100%)' }}>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Innovation & Startups
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Building the bridge between India and the Nordic-Baltic startup ecosystem
            </p>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((item, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 shadow-md border border-border flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* India-Europe Bridge */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border text-center">
              <div className="flex justify-center gap-4 mb-6">
                <span className="text-4xl">🇮🇳</span>
                <Handshake className="w-10 h-10 text-primary" />
                <span className="text-4xl">🇪🇺</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                India–Europe Innovation Bridge
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                INIAC facilitates cross-border collaboration, helping startups and innovators 
                navigate both markets, find partners, and scale their solutions internationally.
              </p>
            </div>
          </div>
        </section>

        {/* Why Nordic-Baltic */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <Lightbulb className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why the Nordic-Baltic Region?
            </h2>
            <p className="text-muted-foreground mb-6">
              The Nordic-Baltic region offers a unique innovation ecosystem with strong digital infrastructure, 
              supportive policies, and access to EU markets. It is an ideal testbed for scaling solutions globally.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4" style={{ background: 'linear-gradient(135deg, hsl(25 95% 53%) 0%, hsl(15 85% 45%) 100%)' }}>
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Innovate Together?
            </h2>
            <p className="text-white/80 mb-8">
              Connect with INIAC to explore collaboration opportunities.
            </p>
            <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
              <Link to="/contact">
                Get in Touch
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

export default Innovation;
