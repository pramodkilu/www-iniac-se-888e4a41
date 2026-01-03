import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Handshake, Mail } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, hsl(15 85% 55%) 0%, hsl(5 70% 40%) 100%)' }}>
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Want to collaborate with INIAC?
        </h2>
        <p className="text-white/80 text-lg mb-10">
          Join our growing network of schools, universities, startups, and industry partners.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold"
          >
            <Link to="/partners">
              <Handshake className="mr-2 h-5 w-5" />
              Partner with Us
            </Link>
          </Button>
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white/20 hover:border-white/60 text-lg px-8 py-6 rounded-full font-semibold"
          >
            <Link to="/contact">
              <Mail className="mr-2 h-5 w-5" />
              Contact INIAC
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
