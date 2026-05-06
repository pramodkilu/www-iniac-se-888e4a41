import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "./Hero";
import RoboLigaSection from "./RoboLigaSection";
import ChapterWheel from "./ChapterWheel";

const SECTIONS = [
  { id: "sec-iniac",       label: "INIAC",       emoji: "🚀" },
  { id: "sec-sweskola",    label: "SweSkola",    emoji: "🏆" },
  { id: "sec-explore",     label: "Explore",     emoji: "🔭" },
  { id: "sec-kitplanning", label: "EDU Kit Planning", emoji: "🧰" },
] as const;

const LandingSections = () => {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const observedRefs = useRef<Record<string, IntersectionObserver>>({});

  // Track which section crosses the 40% viewport mark
  useEffect(() => {
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observedRefs.current[id] = obs;
    });
    return () => {
      Object.values(observedRefs.current).forEach(o => o.disconnect());
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* ── Sticky section jump-nav ─────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b border-border/60 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-center gap-1 py-2">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                active === s.id
                  ? "bg-primary text-primary-foreground shadow-md scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Section 1: INIAC Hero ───────────────────────────────────── */}
      <section id="sec-iniac">
        <Hero />
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <SectionDivider from="from-orange-600" to="to-background" label="SweSkola Robotics League" />

      {/* ── Section 2: SweSkola / RoboLiga ─────────────────────────── */}
      <section id="sec-sweskola">
        <RoboLigaSection />
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <SectionDivider from="from-background" to="to-background" label="Chapter Explorer" />

      {/* ── Section 3: Chapter Wheel ────────────────────────────────── */}
      <section id="sec-explore">
        <ChapterWheel />
      </section>

      {/* ── Divider ────────────────────────────────────────────────── */}
      <SectionDivider from="from-background" to="to-background" label="EDU Kit Planning" />

      {/* ── Section 4: Kit Planning teaser ─────────────────────────── */}
      <section id="sec-kitplanning">
        <KitPlanningTeaser />
      </section>
    </>
  );
};

// ── Kit Planning teaser ───────────────────────────────────────────────────────
function KitPlanningTeaser() {
  const navigate = useNavigate();
  const features = [
    {
      emoji: "📖",
      title: "Chapter Preview",
      desc: "Browse all 30 STEM chapters, read the story, theory, and build steps before you start.",
    },
    {
      emoji: "🗺️",
      title: "Component Heatmap",
      desc: "See which kit parts appear most across chapters — plan what you need before each session.",
    },
    {
      emoji: "🌍",
      title: "SDG Alignment",
      desc: "Explore which UN Sustainable Development Goals each chapter connects to.",
    },
    {
      emoji: "🔧",
      title: "3D Build Guide",
      desc: "Interactive 3D viewer with AI step check and AR marker overlay for every build step.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase">
          🧰 EDU Kit Planning
        </span>
        <h2 className="text-3xl font-bold text-foreground mb-3">
          Plan your build. Explore your kit.
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
          Everything you need before touching a single piece — chapter previews, component maps,
          SDG goals, and a 3D build guide with AI step verification.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {features.map((f) => (
          <div key={f.title}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md hover:border-orange-200 transition-all duration-200 group cursor-pointer"
            onClick={() => navigate("/kit-planning")}
          >
            <div className="text-2xl mb-3">{f.emoji}</div>
            <h3 className="font-bold text-[14px] text-foreground mb-1 group-hover:text-orange-600 transition-colors">
              {f.title}
            </h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/kit-planning")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full text-sm flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105"
        >
          🧰 Open EDU Kit Planning Explorer →
        </button>
      </div>
    </div>
  );
}

// Small decorative divider between sections
function SectionDivider({ from, to, label }: { from: string; to: string; label: string }) {
  return (
    <div className={`relative py-0 bg-gradient-to-b ${from} ${to}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-background border border-border text-muted-foreground text-xs font-semibold px-4 py-1 rounded-full tracking-wide shadow">
          {label}
        </span>
      </div>
      <div className="h-8" />
    </div>
  );
}

export default LandingSections;
