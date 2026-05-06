import { useState } from "react";
import { Lock, CheckCircle2, Play, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import AuthRequiredModal from "@/components/AuthRequiredModal";
import { ChapterPreview } from "@/pages/KitPlanning";

// ─── Static data ───────────────────────────────────────────────────────────────
const ICONS = ["🚗","💨","📐","🔧","⭐","🏰","🛞","📏","🍝","🚀","🖼️","⚡","🎠","🔩","🏗️","🌬️","⚖️","💪","☀️","🔭","⚡","🌉","🔄","⚙️","🎯","🤖","🌬️","🌁","✈️","🏆"];
const COLORS = ["#E53935","#1E88E5","#8E24AA","#D81B60","#FDD835","#43A047","#FB8C00","#00ACC1","#7CB342","#3949AB","#AB47BC","#FFB300","#EC407A","#E53935","#FF7043","#26A69A","#5C6BC0","#00897B","#FFA000","#7B1FA2","#C62828","#455A64","#6D4C41","#37474F","#D32F2F","#1976D2","#0097A7","#512DA8","#F57C00","#C8B900"];
const TITLES = [
  "Cart With Wheels","Aerodynamic Car","Sign Boards","Trebuchet","Challenge Ladder",
  "Suspension Car","Stable Tower","Rack & Pinion Lift","Collection Challenge","Car Jack",
  "Bear Trap","Pasta Maker","Merry-Go-Round","Spinning Top","Lock & Key",
  "Trundle Wheel","Zipline Ride","Dancing Robot","Digital Clock","Earth-Moon-Sun",
  "Find The Path","Foldable Scale","Balance Scale","Plowing Machine","Goalkeeper & Kicker",
  "Clock","First Circuit","Conductors & Insulators","Paper Plane","Balloon Rockets",
];

interface WheelChapter {
  id: number; title: string; icon: string; color: string;
  difficulty: "Easy" | "Medium" | "Hard";
  locked: boolean; completed: boolean;
}

interface Grade {
  id: number; label: string; color: string; icon: string;
  tagline: string; chapters: WheelChapter[];
}

function makeChapters(gradeId: number): WheelChapter[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: (gradeId - 1) * 30 + i + 1,
    title: TITLES[i],
    icon: ICONS[i],
    color: COLORS[i],
    difficulty: (["Easy","Medium","Hard"] as const)[Math.floor(i / 10)],
    completed: gradeId === 1 && i === 0,
    locked: gradeId > 1 ? i > 0 : i > 5,
  }));
}

const GRADES: Grade[] = [
  { id: 1, label: "Grade 1", color: "#E5243B", icon: "🎯", tagline: "Foundations",       chapters: makeChapters(1) },
  { id: 2, label: "Grade 2", color: "#DDA63A", icon: "🔧", tagline: "Building Basics",   chapters: makeChapters(2) },
  { id: 3, label: "Grade 3", color: "#4C9F38", icon: "⚙️", tagline: "Simple Machines",   chapters: makeChapters(3) },
  { id: 4, label: "Grade 4", color: "#C5192D", icon: "🚀", tagline: "Motion & Forces",   chapters: makeChapters(4) },
  { id: 5, label: "Grade 5", color: "#FF3A21", icon: "💡", tagline: "Energy Systems",    chapters: makeChapters(5) },
  { id: 6, label: "Grade 6", color: "#26BDE2", icon: "⚡", tagline: "Electricity",       chapters: makeChapters(6) },
  { id: 7, label: "Grade 7", color: "#FCC30B", icon: "🏗️", tagline: "Structures",        chapters: makeChapters(7) },
  { id: 8, label: "Grade 8", color: "#A21942", icon: "🤖", tagline: "Automation",        chapters: makeChapters(8) },
  { id: 9, label: "Grade 9", color: "#FD6925", icon: "🌟", tagline: "Advanced Projects", chapters: makeChapters(9) },
];

// ─── Grade Wheel (radial ring) ─────────────────────────────────────────────────
function GradeWheel({
  onSelect,
}: {
  onSelect: (g: Grade) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const segCount   = GRADES.length;
  const outerR     = 195;
  const innerR     = 100;
  const iconR      = 152;
  const gap        = 0.035; // radians gap between segments

  const arc = (start: number, end: number, iR: number, oR: number) => {
    const s1 = { x: Math.cos(start) * oR, y: Math.sin(start) * oR };
    const e1 = { x: Math.cos(end)   * oR, y: Math.sin(end)   * oR };
    const s2 = { x: Math.cos(end)   * iR, y: Math.sin(end)   * iR };
    const e2 = { x: Math.cos(start) * iR, y: Math.sin(start) * iR };
    const large = end - start > Math.PI ? 1 : 0;
    return `M${s1.x},${s1.y} A${oR},${oR} 0 ${large} 1 ${e1.x},${e1.y} L${s2.x},${s2.y} A${iR},${iR} 0 ${large} 0 ${e2.x},${e2.y}Z`;
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full">
      {/* Wheel */}
      <div className="relative flex-shrink-0" style={{ width: 440, height: 440 }}>
        <svg width="440" height="440" viewBox="-220 -220 440 440" className="block">
          <defs>
            {GRADES.map(g => (
              <radialGradient key={`rg-${g.id}`} id={`rg-${g.id}`} cx="50%" cy="50%">
                <stop offset="0%" stopColor={g.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={g.color} stopOpacity="1" />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Outer decorative ring */}
          <circle r="210" fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.4" />

          {GRADES.map((g, i) => {
            const seg   = (2 * Math.PI) / segCount;
            const start = i * seg - Math.PI / 2 + gap / 2;
            const end   = (i + 1) * seg - Math.PI / 2 - gap / 2;
            const mid   = (start + end) / 2;
            const isHov = hovered === g.id;
            const push  = isHov ? 10 : 0;
            const tx    = Math.cos(mid) * push;
            const ty    = Math.sin(mid) * push;

            return (
              <g
                key={g.id}
                onClick={() => onSelect(g)}
                onMouseEnter={() => setHovered(g.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                transform={`translate(${tx},${ty})`}
              >
                {/* Glow halo */}
                {isHov && (
                  <path
                    d={arc(start, end, innerR - 4, outerR + 12)}
                    fill={g.color}
                    opacity="0.25"
                    filter="url(#glow)"
                  />
                )}
                {/* Segment */}
                <path
                  d={arc(start, end, innerR, outerR)}
                  fill={`url(#rg-${g.id})`}
                  stroke="hsl(var(--background))"
                  strokeWidth="3"
                  style={{ opacity: isHov ? 1 : 0.88, transition: "opacity 0.2s" }}
                />
                {/* Grade number */}
                <text
                  x={Math.cos(mid) * iconR}
                  y={Math.sin(mid) * iconR - 10}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize="13" fontWeight="800"
                  style={{ pointerEvents: "none", letterSpacing: 0.5 }}
                >
                  G{g.id}
                </text>
                {/* Icon */}
                <text
                  x={Math.cos(mid) * iconR}
                  y={Math.sin(mid) * iconR + 11}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="18" style={{ pointerEvents: "none" }}
                >
                  {g.icon}
                </text>
              </g>
            );
          })}

          {/* Center hub */}
          <circle r={innerR - 6} fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
          {hovered !== null ? (() => {
            const g = GRADES.find(x => x.id === hovered)!;
            return (
              <>
                <circle r="78" fill={g.color} opacity="0.12" />
                <text x="0" y="-22" textAnchor="middle" fill={g.color} fontSize="26" fontWeight="900">{g.icon}</text>
                <text x="0" y="8" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="13" fontWeight="700">{g.label}</text>
                <text x="0" y="28" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">{g.tagline}</text>
              </>
            );
          })() : (
            <>
              <text x="0" y="-16" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="20" fontWeight="900">BLIX</text>
              <text x="0" y="6"  textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">9 Grades</text>
              <text x="0" y="22" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">270 Projects</text>
            </>
          )}
        </svg>
      </div>

      {/* Grade list panel */}
      <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
        {GRADES.map(g => (
          <button
            key={g.id}
            onClick={() => onSelect(g)}
            onMouseEnter={() => setHovered(g.id)}
            onMouseLeave={() => setHovered(null)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
              hovered === g.id
                ? "shadow-md scale-[1.02] bg-card border-transparent"
                : "bg-card/60 border-border/50 hover:bg-card"
            }`}
            style={{ borderLeft: hovered === g.id ? `4px solid ${g.color}` : undefined }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: g.color }}>
              {g.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-foreground">{g.label}</p>
              <p className="text-[11px] text-muted-foreground">{g.tagline} · 30 chapters</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chapter Grid ──────────────────────────────────────────────────────────────
function ChapterGrid({
  grade,
  selectedId,
  onSelect,
  onBack,
}: {
  grade: Grade;
  selectedId: number | null;
  onSelect: (ch: WheelChapter) => void;
  onBack: () => void;
}) {
  const cols = 6;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-full border border-border hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" /> All Grades
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: grade.color }}>
            {grade.icon}
          </div>
          <div>
            <p className="font-bold text-lg leading-tight" style={{ color: grade.color }}>{grade.label} — {grade.tagline}</p>
            <p className="text-xs text-muted-foreground">30 chapters · click to preview</p>
          </div>
        </div>
      </div>

      {/* Grid of chapter circles */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {grade.chapters.map((ch, i) => {
          const isSelected = selectedId === ch.id;
          const isMilestone = (i + 1) % 10 === 0;
          return (
            <button
              key={ch.id}
              onClick={() => !ch.locked && onSelect(ch)}
              title={ch.title}
              className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all duration-200 group ${
                isSelected
                  ? "scale-110 shadow-lg"
                  : ch.locked
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:scale-105 hover:shadow-md cursor-pointer"
              }`}
              style={{
                background: ch.locked ? "hsl(var(--muted))" : `${ch.color}18`,
                borderColor: isSelected ? ch.color : ch.locked ? "hsl(var(--border))" : `${ch.color}55`,
                boxShadow: isSelected ? `0 0 0 3px ${ch.color}44, 0 4px 16px ${ch.color}33` : undefined,
              }}
            >
              {/* Chapter number */}
              <span className="text-[11px] font-black leading-none mb-0.5" style={{ color: ch.locked ? "hsl(var(--muted-foreground))" : ch.color }}>
                {i + 1}
              </span>
              {/* Icon */}
              <span className="text-lg leading-none">
                {ch.locked ? "🔒" : ch.icon}
              </span>
              {/* Completed badge */}
              {ch.completed && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              {/* Milestone star */}
              {isMilestone && !ch.locked && (
                <span className="absolute -top-1 -left-1 text-[10px]">⭐</span>
              )}
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-card border border-border rounded-lg px-2 py-1 text-[10px] font-semibold text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-md pointer-events-none">
                {ch.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Completed</span>
        <span className="flex items-center gap-1.5"><span>⭐</span> Milestone (Ch 10, 20, 30)</span>
        <span className="flex items-center gap-1.5"><span>🔒</span> Locked</span>
      </div>
    </div>
  );
}

// ─── Chapter detail panel ──────────────────────────────────────────────────────
function ChapterDetail({ chapter, grade, onClose }: {
  chapter: WheelChapter; grade: Grade; onClose: () => void;
}) {
  // For Grade 1 we have full real data — show rich preview
  if (grade.id === 1) {
    return (
      <div className="w-full mt-6 border border-border rounded-2xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-lg">{chapter.icon}</span>
            <span className="font-bold text-sm">Chapter {chapter.id}: {chapter.title}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold" style={{ background: grade.color }}>
              {grade.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={`/chapter/${chapter.id}`}>
              <Button size="sm" className="h-7 text-[11px] gap-1">
                <Play className="w-3 h-3" /> Open Full View
              </Button>
            </Link>
            <button onClick={onClose} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted text-xs">✕</button>
          </div>
        </div>
        <ChapterPreview defaultChapterId={chapter.id} />
      </div>
    );
  }

  // Other grades — simple card
  return (
    <div className="w-full max-w-sm mt-6 mx-auto bg-card border border-border rounded-2xl p-6 shadow-lg relative">
      <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted text-xs">✕</button>
      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4" style={{ background: chapter.color }}>
        {chapter.locked ? "🔒" : chapter.icon}
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Chapter {chapter.id} · {grade.label}</p>
      <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: chapter.color }}>{chapter.difficulty}</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">{grade.tagline}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
        Full content for {grade.label} chapters is coming soon. Grade 1 is fully available now!
      </p>
      {chapter.locked ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Complete earlier chapters to unlock
        </div>
      ) : (
        <Link to={`/chapter/${chapter.id}`}>
          <Button className="w-full gap-2">
            <Play className="w-4 h-4" /> Start Chapter
          </Button>
        </Link>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
const ChapterWheel = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedGrade,   setSelectedGrade]   = useState<Grade | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<WheelChapter | null>(null);
  const [showAuthModal,   setShowAuthModal]   = useState(false);
  const [pendingGrade,    setPendingGrade]    = useState<Grade | null>(null);

  const handleGradeSelect = (grade: Grade) => {
    if (!user && !authLoading) {
      setPendingGrade(grade);
      setShowAuthModal(true);
      return;
    }
    setSelectedGrade(grade);
    setSelectedChapter(null);
  };

  const handleAuthSuccess = () => {
    if (pendingGrade) { setSelectedGrade(pendingGrade); setPendingGrade(null); }
  };

  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-muted/20">
      <div className="container mx-auto max-w-7xl">

        {/* Page header */}
        {!selectedGrade && (
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Choose Your Learning Path</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Explore 9 Grade Levels</h2>
            <p className="text-sm text-muted-foreground">30 hands-on STEM projects per grade · 270 total chapters</p>
          </div>
        )}

        {/* Grade wheel */}
        {!selectedGrade && (
          <GradeWheel onSelect={handleGradeSelect} />
        )}

        {/* Chapter grid + detail */}
        {selectedGrade && (
          <div>
            <ChapterGrid
              grade={selectedGrade}
              selectedId={selectedChapter?.id ?? null}
              onSelect={setSelectedChapter}
              onBack={() => { setSelectedGrade(null); setSelectedChapter(null); }}
            />

            {selectedChapter && (
              <ChapterDetail
                chapter={selectedChapter}
                grade={selectedGrade}
                onClose={() => setSelectedChapter(null)}
              />
            )}
          </div>
        )}
      </div>

      <AuthRequiredModal
        open={showAuthModal}
        onOpenChange={(open) => { setShowAuthModal(open); if (!open) { handleAuthSuccess(); setPendingGrade(null); } }}
        gradeLabel={pendingGrade?.label}
      />
    </section>
  );
};

export default ChapterWheel;
