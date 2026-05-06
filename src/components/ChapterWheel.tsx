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

// ─── Roadmap ───────────────────────────────────────────────────────────────────
// Snake-path board-game style map. 5 rows × 6 chapters each.
// Odd rows run left→right, even rows run right→left.

const ROW_SIZE = 6;
const TERRAINS = ["🌲","🌸","⛰️","🌊","🌴","🏡","🌻","🦋","🍄","🌈"];

function RoadMap({
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
  // Split 30 chapters into 5 rows of 6
  const rows: WheelChapter[][] = [];
  for (let r = 0; r < 5; r++) {
    rows.push(grade.chapters.slice(r * ROW_SIZE, (r + 1) * ROW_SIZE));
  }

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
            <p className="font-bold text-lg leading-tight" style={{ color: grade.color }}>
              {grade.label} — {grade.tagline}
            </p>
            <p className="text-xs text-muted-foreground">30 chapters · tap a stop to explore</p>
          </div>
        </div>
      </div>

      {/* Roadmap board */}
      <div
        className="relative w-full rounded-3xl overflow-hidden p-4 md:p-6"
        style={{
          background: `linear-gradient(160deg, ${grade.color}12 0%, ${grade.color}06 50%, hsl(var(--muted)/0.4) 100%)`,
          border: `2px solid ${grade.color}30`,
        }}
      >
        {/* Scattered terrain decorations */}
        {TERRAINS.map((t, i) => (
          <span
            key={i}
            className="absolute pointer-events-none select-none opacity-20 text-xl"
            style={{
              top:  `${8 + (i * 17) % 85}%`,
              left: `${3 + (i * 23 + 11) % 94}%`,
              fontSize: 14 + (i % 3) * 4,
            }}
          >
            {t}
          </span>
        ))}

        {/* START banner */}
        <div className="flex justify-start mb-2 ml-1">
          <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow">
            🏁 START
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-0">
          {rows.map((row, rowIdx) => {
            const goRight = rowIdx % 2 === 0; // even rows L→R, odd rows R→L
            const display  = goRight ? row : [...row].reverse();
            const isLast   = rowIdx === rows.length - 1;

            return (
              <div key={rowIdx}>
                {/* Chapter row */}
                <div className="flex items-center gap-0">
                  {display.map((ch, colIdx) => {
                    const chIdx       = rowIdx * ROW_SIZE + (goRight ? colIdx : ROW_SIZE - 1 - colIdx);
                    const isSelected  = selectedId === ch.id;
                    const isMilestone = (chIdx + 1) % 10 === 0;
                    const isLastInRow = colIdx === display.length - 1;

                    return (
                      <div key={ch.id} className="flex items-center flex-1 min-w-0">
                        {/* Chapter node */}
                        <button
                          onClick={() => !ch.locked && onSelect(ch)}
                          disabled={ch.locked}
                          className={`relative flex flex-col items-center justify-center shrink-0 transition-all duration-200 group
                            ${isSelected ? "scale-125 z-10" : ch.locked ? "opacity-50 cursor-not-allowed" : "hover:scale-110 hover:z-10 cursor-pointer"}`}
                          style={{ width: 64, height: 64 }}
                        >
                          {/* Outer glow ring for selected */}
                          {isSelected && (
                            <span
                              className="absolute inset-0 rounded-full animate-ping"
                              style={{ background: ch.color, opacity: 0.3 }}
                            />
                          )}

                          {/* Main circle */}
                          <span
                            className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full shadow-md border-[3px]"
                            style={{
                              background: ch.locked
                                ? "hsl(var(--muted))"
                                : ch.completed
                                ? "#22c55e"
                                : isSelected
                                ? ch.color
                                : `${ch.color}dd`,
                              borderColor: isSelected ? "#FFD700" : "white",
                              boxShadow: isSelected ? `0 0 0 3px ${ch.color}66, 0 4px 12px ${ch.color}55` : "0 2px 8px rgba(0,0,0,0.18)",
                            }}
                          >
                            {/* Milestone crown */}
                            {isMilestone && !ch.locked && (
                              <span className="absolute -top-3 text-base leading-none">👑</span>
                            )}
                            {/* Completed checkmark */}
                            {ch.completed && !isSelected && (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            )}
                            {/* Icon or lock */}
                            {(!ch.completed || isSelected) && (
                              <span className="text-base leading-none">{ch.locked ? "🔒" : ch.icon}</span>
                            )}
                          </span>

                          {/* Chapter number label below */}
                          <span
                            className="mt-1 text-[9px] font-black leading-none"
                            style={{ color: ch.locked ? "hsl(var(--muted-foreground))" : ch.color }}
                          >
                            {chIdx + 1}
                          </span>

                          {/* Tooltip on hover */}
                          <div
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-card border border-border rounded-lg px-2 py-1 text-[10px] font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none"
                            style={{ color: ch.color }}
                          >
                            {ch.title}
                          </div>
                        </button>

                        {/* Horizontal connector (not after last in row) */}
                        {!isLastInRow && (
                          <div className="flex-1 relative h-3 mx-0.5" style={{ minWidth: 8 }}>
                            {/* Road track */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full"
                              style={{
                                background: ch.locked
                                  ? "hsl(var(--border))"
                                  : ch.completed
                                  ? "#22c55e"
                                  : `${grade.color}60`,
                              }}
                            />
                            {/* Dashed center line */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-full"
                              style={{
                                height: 1,
                                background: `repeating-linear-gradient(90deg, white 0, white 4px, transparent 4px, transparent 9px)`,
                                opacity: ch.locked ? 0 : 0.5,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* U-turn connector between rows (not after last row) */}
                {!isLast && (
                  <div className="flex" style={{ height: 36 }}>
                    {/* Road curves to the opposite side */}
                    <div className="flex-1" />
                    <div
                      className="flex items-center justify-center"
                      style={{ width: 64, flexShrink: 0 }}
                    >
                      {/* Vertical connector on the turn side */}
                      <div
                        className="w-2 h-full rounded-full"
                        style={{
                          marginLeft: goRight ? "auto" : 0,
                          marginRight: goRight ? 0 : "auto",
                          background: `${grade.color}50`,
                        }}
                      />
                    </div>
                    {goRight ? null : <div className="flex-1" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FINISH banner */}
        <div className={`flex mt-2 ${rows.length % 2 === 0 ? "justify-start ml-1" : "justify-end mr-1"}`}>
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-[11px] font-black px-3 py-1 rounded-full shadow">
            🏆 FINISH
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border/30 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Completed</span>
          <span className="flex items-center gap-1">👑 Milestone checkpoint</span>
          <span className="flex items-center gap-1">🔒 Locked</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full border-2 border-yellow-400 inline-block" /> Selected</span>
        </div>
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
            <RoadMap
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
