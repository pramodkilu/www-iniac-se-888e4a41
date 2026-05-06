import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  chapters, chapterComponents, SDG_INFO, tr,
  type Chapter,
} from "@/data/chapters";
import Header from "@/components/Header";
import BuildGuide from "@/components/BuildGuide";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Wrench, Trophy, BarChart2, Map, Grid3x3, Package, ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import AIResearch from "@/pages/AIResearch";

// ─── Types ────────────────────────────────────────────────────────────────────
type MainTab     = "preview" | "components" | "sdg";
type PreviewTab  = "story" | "theory" | "build" | "challenge" | "research";
type MapSubTab   = "heatmap" | "by-chapter" | "by-component" | "totals";
type SDGSubTab   = "min-kit" | "sdg-map" | "sdg-coverage";

// ─── Character palette for dialogue ──────────────────────────────────────────
const CHAR: Record<string, { bg: string; ring: string; initial: string }> = {
  Laya:      { bg: "bg-purple-400", ring: "bg-purple-50",  initial: "L" },
  Kit:       { bg: "bg-rose-400",   ring: "bg-rose-50",    initial: "K" },
  Rob:       { bg: "bg-teal-500",   ring: "bg-teal-50",    initial: "R" },
  Narrator:  { bg: "bg-gray-400",   ring: "bg-gray-50",    initial: "N" },
};
const defaultChar = { bg: "bg-amber-400", ring: "bg-amber-50", initial: "?" };
function charStyle(name: string) { return CHAR[name] ?? { ...defaultChar, initial: name[0] }; }

// ─── Heatmap colour scale ─────────────────────────────────────────────────────
function heatCls(qty: number): string {
  if (qty === 0)  return "bg-gray-50";
  if (qty <= 2)   return "bg-teal-100 text-teal-800";
  if (qty <= 5)   return "bg-teal-300 text-teal-900";
  if (qty <= 10)  return "bg-teal-500 text-white";
  return                  "bg-teal-700 text-white";
}

// ─── Derived data helpers ─────────────────────────────────────────────────────

// All unique component codes, sorted by total usage
const ALL_CODES: string[] = (() => {
  const totals: Record<string, number> = {};
  Object.values(chapterComponents).forEach(comps =>
    Object.entries(comps).forEach(([code, qty]) => {
      totals[code] = (totals[code] ?? 0) + qty;
    })
  );
  return Object.keys(totals).sort((a, b) => (totals[b] ?? 0) - (totals[a] ?? 0));
})();

// Running-maximum kit for each chapter (min kit to cover chapters 1..N)
const KIT_CHART_DATA = chapters.map((_, idx) => {
  const N = idx + 1;
  const running: Record<string, number> = {};
  for (let i = 1; i <= N; i++) {
    Object.entries(chapterComponents[i] ?? {}).forEach(([code, qty]) => {
      running[code] = Math.max(running[code] ?? 0, qty);
    });
  }
  const unique = Object.values(running).filter(v => v > 0).length;
  const total  = Object.values(running).reduce((s, v) => s + v, 0);
  return { chapter: N, unique, total };
});

// SDG coverage: how many chapters include each goal
const SDG_COVERAGE: Record<number, number[]> = {};
chapters.forEach(ch => {
  ch.sdgs.forEach(g => {
    if (!SDG_COVERAGE[g]) SDG_COVERAGE[g] = [];
    SDG_COVERAGE[g].push(ch.id);
  });
});

// ─── Shared Tabs UI ───────────────────────────────────────────────────────────
function TabBar<T extends string>({
  tabs, active, onChange, small,
}: { tabs: { id: T; label: string; icon?: React.ReactNode }[]; active: T; onChange: (t: T) => void; small?: boolean }) {
  return (
    <div className={`inline-flex flex-wrap gap-1 bg-muted/50 rounded-lg p-1 ${small ? "text-xs" : "text-sm"}`}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
            active === t.id ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.icon}{t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Chapter Preview ──────────────────────────────────────────────────────────
function ChapterPreview() {
  const [sel, setSel] = useState<Chapter>(chapters[0]);
  const [tab, setTab] = useState<PreviewTab>("story");

  const selIdx = chapters.findIndex(c => c.id === sel.id);
  const goPrev = () => { if (selIdx > 0) setSel(chapters[selIdx - 1]); };
  const goNext = () => { if (selIdx < chapters.length - 1) setSel(chapters[selIdx + 1]); };

  // Chapters that have full step data
  const hasSteps = (ch: Chapter) => ch.build.steps.length > 0;

  return (
    <div className="flex gap-0 border border-border rounded-xl overflow-hidden bg-card" style={{ minHeight: 560 }}>
      {/* Left: chapter list — clicking a chapter NEVER resets the active tab */}
      <div className="w-56 flex-shrink-0 border-r border-border overflow-y-auto bg-muted/20">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            onClick={() => setSel(ch)}
            className={`w-full text-left px-3 py-2.5 text-sm border-b border-border/50 transition-colors flex items-start gap-2 ${
              sel.id === ch.id ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted/50 text-muted-foreground"
            } ${ch.isCheckpoint ? "italic" : ""}`}
          >
            <span className="shrink-0 text-xs text-muted-foreground w-5 mt-0.5">{i + 1}.</span>
            <span className="leading-tight flex-1">{tr(ch.title, "en")}</span>
            {/* Dot shows chapters with full 3D build data */}
            {hasSteps(ch) && (
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5" title="Has 3D build steps" />
            )}
          </button>
        ))}
      </div>

      {/* Right: detail */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-border flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">
              Chapter {sel.id} of {chapters.length}{sel.isCheckpoint ? " · Checkpoint" : ""}
              {hasSteps(sel) && <span className="ml-2 text-orange-500 font-semibold">● Full 3D build</span>}
            </p>
            <h2 className="text-2xl font-bold text-foreground leading-tight">{tr(sel.title, "en")}</h2>
            <p className="text-sm text-muted-foreground">{tr(sel.subtitle, "en")}</p>
          </div>
          {/* Prev / Next chapter arrows */}
          <div className="flex gap-1 shrink-0 pt-1">
            <button onClick={goPrev} disabled={selIdx === 0}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={goNext} disabled={selIdx === chapters.length - 1}
              className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="px-6 pt-3 pb-2 border-b border-border">
          <TabBar
            tabs={[
              { id: "story",     label: "Story",       icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: "theory",    label: "Theory",      icon: <Lightbulb className="w-3.5 h-3.5" /> },
              { id: "build",     label: "Build",       icon: <Wrench className="w-3.5 h-3.5" /> },
              { id: "challenge", label: "Challenge",   icon: <Trophy className="w-3.5 h-3.5" /> },
              { id: "research",  label: "AI Research", icon: <FlaskConical className="w-3.5 h-3.5" /> },
            ]}
            active={tab}
            onChange={(t) => setTab(t)}
          />
        </div>

        {/* Tab content — Build + Research get full width, others stay padded */}
        <div className={`flex-1 overflow-y-auto ${tab === "build" || tab === "research" ? "p-0" : "px-6 py-4"}`}>
          {tab === "story" && (
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm italic text-muted-foreground leading-relaxed">{tr(sel.story.intro, "en")}</p>
              {sel.story.dialogue.length > 0 ? (
                <>
                  {sel.story.dialogue.map((line, i) => {
                    const s = charStyle(line.speaker);
                    const isNarrator = line.speaker === "Narrator";
                    if (isNarrator) return (
                      <p key={i} className="text-sm italic text-muted-foreground text-center py-1">
                        {tr(line.text, "en")}
                      </p>
                    );
                    return (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl ${s.ring}`}>
                        <div className={`w-8 h-8 rounded-full ${s.bg} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                          {s.initial}
                        </div>
                        <p className="text-sm leading-relaxed pt-1">{tr(line.text, "en")}</p>
                      </div>
                    );
                  })}
                  {sel.story.conclusion && (
                    <p className="text-sm italic text-muted-foreground text-center border-t border-border pt-3 mt-2">
                      {tr(sel.story.conclusion, "en")}
                    </p>
                  )}
                </>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="py-6 text-center text-sm text-muted-foreground">
                    Full story dialogue coming soon for this chapter.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {tab === "theory" && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Concept</p>
                <p className="font-semibold text-foreground">{tr(sel.theory.concept, "en")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tr(sel.theory.explanation, "en")}</p>
              </div>
              {sel.theory.realWorldExamples.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Real-world examples</p>
                  <ul className="space-y-1">
                    {sel.theory.realWorldExamples.map((ex, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-0.5">•</span>{tr(ex, "en")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {sel.theory.newWords.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">New words</p>
                  <div className="flex flex-wrap gap-2">
                    {sel.theory.newWords.map((w, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-muted text-sm font-medium">{tr(w, "en")}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {sel.sdgs.map(g => (
                  <span key={g} className="text-[11px] px-2 py-0.5 rounded-full text-white font-semibold"
                    style={{ background: SDG_INFO[g]?.color }}>
                    SDG {g}: {SDG_INFO[g]?.en}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tab === "build" && (
            <div className="w-full">
              <BuildGuide chapter={sel} />
            </div>
          )}

          {tab === "challenge" && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <p className="font-semibold text-foreground">{tr(sel.challenge.title, "en")}</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{tr(sel.challenge.description, "en")}</p>
                {sel.challenge.hint && (
                  <div className="mt-3 pt-3 border-t border-amber-500/20">
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      <span className="font-semibold">Hint: </span>{tr(sel.challenge.hint, "en")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "research" && (
            <AIResearch />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Component Heatmap ────────────────────────────────────────────────────────
function ComponentMap() {
  const [sub, setSub] = useState<MapSubTab>("heatmap");
  const [selChapter, setSelChapter] = useState(1);
  const [selCode, setSelCode] = useState(ALL_CODES[0] ?? "");

  // Chapters that actually have component data
  const activeChapters = chapters.filter(ch => Object.keys(chapterComponents[ch.id] ?? {}).length > 0);

  // Kit totals (sum across all chapters)
  const kitTotals = useMemo(() => {
    const t: Record<string, number> = {};
    Object.values(chapterComponents).forEach(comps =>
      Object.entries(comps).forEach(([code, qty]) => {
        t[code] = (t[code] ?? 0) + qty;
      })
    );
    return t;
  }, []);

  return (
    <div className="space-y-4">
      <TabBar
        tabs={[
          { id: "heatmap",      label: "Heatmap",       icon: <Grid3x3 className="w-3.5 h-3.5" /> },
          { id: "by-chapter",   label: "By chapter",    icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: "by-component", label: "By component",  icon: <Package className="w-3.5 h-3.5" /> },
          { id: "totals",       label: "Kit totals",    icon: <BarChart2 className="w-3.5 h-3.5" /> },
        ]}
        active={sub}
        onChange={(t) => setSub(t)}
        small
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Cell intensity = quantity used:</span>
        {[["0", "bg-gray-100"], ["1–2", "bg-teal-100"], ["3–5", "bg-teal-300"], ["6–10", "bg-teal-500"], ["11+", "bg-teal-700"]].map(([label, cls]) => (
          <span key={label} className="flex items-center gap-1">
            <span className={`w-5 h-5 rounded ${cls} border border-border inline-block`} />
            {label}
          </span>
        ))}
      </div>

      {sub === "heatmap" && (
        <div className="overflow-auto rounded-xl border border-border">
          <table className="text-xs border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-muted px-3 py-2 text-left font-semibold min-w-[160px] border-b border-r border-border">
                  Chapter
                </th>
                {ALL_CODES.map(code => (
                  <th key={code}
                    className="px-1 py-1 text-center font-mono text-[10px] text-muted-foreground border-b border-border bg-muted whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", height: 80, minWidth: 28 }}>
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chapters.map(ch => {
                const comps = chapterComponents[ch.id] ?? {};
                return (
                  <tr key={ch.id} className="hover:bg-muted/30">
                    <td className="sticky left-0 bg-background border-r border-b border-border px-3 py-1.5 font-medium text-foreground truncate max-w-[160px]">
                      {ch.id}. {tr(ch.title, "en")}
                    </td>
                    {ALL_CODES.map(code => {
                      const qty = comps[code] ?? 0;
                      return (
                        <td key={code}
                          className={`border-b border-border text-center font-semibold ${heatCls(qty)}`}
                          style={{ minWidth: 28, height: 30 }}>
                          {qty > 0 ? qty : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sub === "by-chapter" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {chapters.filter(ch => !ch.isCheckpoint || Object.keys(chapterComponents[ch.id] ?? {}).length > 0).map(ch => (
              <button key={ch.id}
                onClick={() => setSelChapter(ch.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selChapter === ch.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {ch.id}. {tr(ch.title, "en")}
              </button>
            ))}
          </div>
          <div>
            {Object.keys(chapterComponents[selChapter] ?? {}).length === 0 ? (
              <p className="text-sm text-muted-foreground">No component data for this chapter.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(chapterComponents[selChapter] ?? {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([code, qty]) => (
                    <div key={code} className={`rounded-lg p-3 text-center ${heatCls(qty)} border border-border`}>
                      <p className="font-mono text-xs font-bold">{code}</p>
                      <p className="text-2xl font-bold mt-1">×{qty}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {sub === "by-component" && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {ALL_CODES.map(code => (
              <button key={code}
                onClick={() => setSelCode(code)}
                className={`px-2 py-1 rounded text-xs font-mono font-medium transition-colors ${
                  selCode === code ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}>
                {code}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {chapters
              .filter(ch => (chapterComponents[ch.id]?.[selCode] ?? 0) > 0)
              .map(ch => {
                const qty = chapterComponents[ch.id]?.[selCode] ?? 0;
                return (
                  <div key={ch.id} className={`rounded-lg p-3 border border-border ${heatCls(qty)}`}>
                    <p className="text-[11px] font-medium leading-tight">{ch.id}. {tr(ch.title, "en")}</p>
                    <p className="text-xl font-bold mt-1">×{qty}</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {sub === "totals" && (
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Cumulative component usage across all 30 chapters — useful for kit ordering.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
            {Object.entries(kitTotals)
              .sort((a, b) => b[1] - a[1])
              .map(([code, total]) => (
                <div key={code} className={`rounded-lg p-3 text-center border border-border ${heatCls(total)}`}>
                  <p className="font-mono text-xs font-bold">{code}</p>
                  <p className="text-2xl font-bold mt-1">{total}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">total uses</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SDG + Kit Planning ───────────────────────────────────────────────────────
function KitSDG() {
  const [sub, setSub] = useState<SDGSubTab>("min-kit");

  return (
    <div className="space-y-4">
      <TabBar
        tabs={[
          { id: "min-kit",      label: "Min kit by chapter", icon: <Package className="w-3.5 h-3.5" /> },
          { id: "sdg-map",      label: "SDG mapping",         icon: <Map className="w-3.5 h-3.5" /> },
          { id: "sdg-coverage", label: "SDG coverage",        icon: <BarChart2 className="w-3.5 h-3.5" /> },
        ]}
        active={sub}
        onChange={(t) => setSub(t)}
        small
      />

      {sub === "min-kit" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The minimum kit a child needs to complete chapters 1 through N.
            Numbers are running maxima — once a chapter needs 12× CT2, the kit always includes at least 12× CT2 thereafter.
          </p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={KIT_CHART_DATA} margin={{ top: 5, right: 32, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="chapter" label={{ value: "After completing chapter…", position: "insideBottom", offset: -2, fontSize: 11 }} tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left"  tickCount={7} tick={{ fontSize: 11 }} domain={[0, 55]} label={{ value: "Unique pieces", angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tickCount={7} tick={{ fontSize: 11, fill: "#059669" }} domain={[0, 230]} label={{ value: "Total qty", angle: 90, position: "insideRight", offset: 10, fontSize: 11, fill: "#059669" }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(val, name) => [val, name === "unique" ? "Unique pieces in kit" : "Total piece count in kit"]}
                  labelFormatter={l => `After chapter ${l}`}
                />
                <Legend formatter={v => v === "unique" ? "Unique pieces in kit" : "Total piece count in kit"} />
                <Line yAxisId="left"  type="stepAfter" dataKey="unique" stroke="#7c3aed" strokeWidth={2} dot={{ r: 3, fill: "#7c3aed" }} activeDot={{ r: 5 }} />
                <Line yAxisId="right" type="stepAfter" dataKey="total"  stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: "#059669" }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {sub === "sdg-map" && (
        <div className="overflow-auto rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground w-8">#</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Chapter</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">SDG Goals</th>
                <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Lgr22</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chapters.map(ch => (
                <tr key={ch.id} className={`hover:bg-muted/30 ${ch.isCheckpoint ? "bg-orange-50/40 dark:bg-orange-950/10" : ""}`}>
                  <td className="px-3 py-2 text-muted-foreground">{ch.id}</td>
                  <td className="px-3 py-2 font-medium text-foreground">{tr(ch.title, "en")}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {ch.sdgs.map(g => (
                        <span key={g}
                          className="text-[10px] px-1.5 py-0.5 rounded-full text-white font-semibold"
                          style={{ background: SDG_INFO[g]?.color }}>
                          {g}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground max-w-xs truncate">
                    {ch.lgr22.rawSpreadsheet}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === "sdg-coverage" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            How many of the 30 chapters address each UN Sustainable Development Goal.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {Object.entries(SDG_INFO).map(([key, info]) => {
              const goalNum = Number(key);
              const chList = SDG_COVERAGE[goalNum] ?? [];
              return (
                <div key={key}
                  className="rounded-xl p-4 text-white flex flex-col gap-1"
                  style={{ background: info.color }}>
                  <span className="text-xs font-bold opacity-80">SDG {goalNum}</span>
                  <span className="text-sm font-semibold leading-tight">{info.en}</span>
                  <span className="text-2xl font-bold mt-auto">{chList.length}</span>
                  <span className="text-[10px] opacity-80">{chList.length === 1 ? "chapter" : "chapters"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const KitPlanning = () => {
  const [main, setMain] = useState<MainTab>("preview");

  const mainTabs = [
    { id: "preview" as MainTab,    label: "Chapter Preview",       icon: <BookOpen className="w-4 h-4" /> },
    { id: "components" as MainTab, label: "Chapter ↔ Component Map", icon: <Grid3x3 className="w-4 h-4" /> },
    { id: "sdg" as MainTab,        label: "SDG & Kit Planning",    icon: <Map className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <p className="text-sm text-slate-400 mb-1">Grade 1 Junior · Blix Adventures · {chapters.length} chapters</p>
          <h1 className="text-4xl font-bold mb-2">
            Interactive Curriculum{" "}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Explorer</span>
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Preview every chapter, map which kit components each session uses, and track SDG + Lgr22 alignment across all 30 sessions.
          </p>
        </div>
      </section>

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-20 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 max-w-5xl">
          <TabBar tabs={mainTabs} active={main} onChange={(t) => setMain(t)} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {main === "preview"    && <ChapterPreview />}
        {main === "components" && <ComponentMap />}
        {main === "sdg"        && <KitSDG />}
      </main>
    </div>
  );
};

export default KitPlanning;
