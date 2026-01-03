import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Target, 
  Eye, 
  Globe, 
  Heart,
  Shield,
  Users
} from "lucide-react";

const values = [
  { icon: Heart, title: "Non-Profit Mission", desc: "Driven by impact, not profit" },
  { icon: Shield, title: "Transparency", desc: "Open and accountable operations" },
  { icon: Users, title: "Collaboration", desc: "Building bridges, not barriers" },
  { icon: Globe, title: "Inclusivity", desc: "Welcoming diverse perspectives" },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-16">
        {/* Hero */}
        <section className="py-20 px-4 bg-gradient-to-br from-muted to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              About INIAC
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Indo Nordic-Baltic Innovation Cluster
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To connect schools, universities, startups, and industry across the Nordic-Baltic region 
                  and India, fostering innovation through education, collaboration, and applied technology.
                </p>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  A world where knowledge flows freely across borders, where young people are empowered 
                  with STEM skills, and where innovation bridges cultures and economies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Indo Nordic-Baltic Means */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-3xl text-center">
            <Globe className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              What "Indo Nordic-Baltic" Means
            </h2>
            <p className="text-muted-foreground mb-6">
              INIAC bridges two dynamic regions: <strong>India</strong>, with its vast talent pool and 
              growing innovation ecosystem, and the <strong>Nordic-Baltic</strong> countries (Sweden, Finland, 
              Norway, Denmark, Iceland, Estonia, Latvia, Lithuania), known for their advanced digital 
              infrastructure, sustainability focus, and collaborative culture.
            </p>
            <p className="text-muted-foreground">
              Together, we create opportunities for knowledge exchange, market access, and collaborative innovation.
            </p>
          </div>
        </section>

        {/* Non-Profit Status */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Non-Profit Initiative
            </h2>
            <p className="text-muted-foreground mb-8">
              INIAC operates as a non-profit organization, ensuring that our focus remains on creating 
              impact rather than generating profit. All resources are reinvested into our programs and partnerships.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-foreground mb-12">
              Our Values
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-card shadow-md flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Origin */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground italic">
              INIAC originated in Sweden and operates across the Nordic-Baltic region.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
