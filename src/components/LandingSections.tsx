import { useEffect, useRef, useState } from "react";
import Hero from "./Hero";
import RoboLigaSection from "./RoboLigaSection";
import ChapterWheel from "./ChapterWheel";

const SECTIONS = [
  { id: "sec-iniac",    label: "INIAC",    emoji: "🚀" },
  { id: "sec-sweskola", label: "SweSkola", emoji: "🏆" },
  { id: "sec-explore",  label: "Explore",  emoji: "🔭" },
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
    </>
  );
};

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
