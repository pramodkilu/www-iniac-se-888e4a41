import { GraduationCap, BookOpen, Building2, Landmark } from "lucide-react";

const partners = [
  { icon: GraduationCap, label: "Schools" },
  { icon: BookOpen, label: "Universities" },
  { icon: Building2, label: "Industry Partners" },
  { icon: Landmark, label: "Municipalities" },
];

const TrustSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl text-center">
        <p className="text-muted-foreground mb-8">
          Trusted by partners across the Nordic-Baltic region
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              <partner.icon className="w-5 h-5" />
              <span className="font-medium">{partner.label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground italic">
          A non-profit innovation initiative operating in the Nordic-Baltic region.
        </p>
      </div>
    </section>
  );
};

export default TrustSection;
