import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";
import Header from "@/components/Header";

const PAGE_META: Record<string, { title: string; subtitle: string; icon: string }> = {
  "/innovation": {
    title: "Innovation & Startups",
    subtitle: "Discover how INIAC fuels the next generation of student entrepreneurs and tech innovators.",
    icon: "🚀",
  },
  "/partners": {
    title: "Our Partners",
    subtitle: "INIAC collaborates with schools, universities, and industry leaders across the Nordic region.",
    icon: "🤝",
  },
  "/about": {
    title: "About INIAC",
    subtitle: "Learn about our mission to make AI and robotics education accessible to every student.",
    icon: "🌍",
  },
  "/contact": {
    title: "Contact Us",
    subtitle: "Get in touch with the INIAC team for partnerships, press, or platform enquiries.",
    icon: "✉️",
  },
};

const ComingSoon = () => {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? {
    title: "Coming Soon",
    subtitle: "This page is under construction.",
    icon: "🔧",
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="text-7xl mb-6">{meta.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{meta.title}</h1>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">{meta.subtitle}</p>
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-semibold px-4 py-2 rounded-full mb-10">
            <Rocket className="w-4 h-4" />
            Page launching soon
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
              <Link to="/education">Explore INIAC</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
