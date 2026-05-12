import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800 py-10 px-6">
    <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-destructive flex items-center justify-center">
          <span className="text-white font-bold text-sm">I</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">INIAC</span>
      </div>

      {/* Links */}
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
        <Link to="/programs"   className="hover:text-white transition-colors">Programs</Link>
        <Link to="/curriculum" className="hover:text-white transition-colors">Curriculum</Link>
        <Link to="/about"      className="hover:text-white transition-colors">About</Link>
        <Link to="/contact"    className="hover:text-white transition-colors">Contact</Link>
      </nav>

      {/* Copy */}
      <p className="text-slate-500 text-xs">
        © {new Date().getFullYear()} INIAC. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
