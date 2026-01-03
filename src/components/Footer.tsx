import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">I</span>
              </div>
              <span className="font-bold text-lg">INIAC</span>
            </div>
            <p className="text-sm text-background/70">
              A non-profit innovation initiative
            </p>
            <p className="text-xs text-background/50">
              Operating in the Nordic-Baltic region
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/about" className="text-background/70 hover:text-background transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-background/70 hover:text-background transition-colors">
              Contact
            </Link>
            <Link to="/privacy" className="text-background/70 hover:text-background transition-colors">
              Privacy Policy
            </Link>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-sm text-background/70">
              contact@iniac.org
            </p>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} INIAC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
