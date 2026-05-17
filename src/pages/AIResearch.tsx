import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { type VerifyResult } from "@/hooks/useComponentDetector";
import { getCheckHistory, saveCheckRecord, clearCheckHistory, computeStats, type CheckRecord } from "@/hooks/useCheckHistory";
import { CheckCircle2, XCircle, ChevronLeft, Trash2, Sparkles } from "lucide-react";
import { useSafeBack } from "@/lib/safeBack";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ResearchNavState {
  method: "api" | "model" | "both";
  step: { title: { en: string }; components: string[] } | null;
  stepIdx: number;
  chapterId: string;
  chapterTitle: string;
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, isCount }: { label: string; value: string | number | null; sub?: string; color: string; isCount?: boolean }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value ?? "—"}{typeof value === "number" && value !== null && !isCount ? "%" : ""}</p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

// ── Result panel ───────────────────────────────────────────────────────────────
function ResultPanel({ result, label, accent, loading }: {
  result: VerifyResult | null; label: string; accent: "blue" | "orange"; loading: boolean;
}) {
  const a = accent === "blue"
    ? { border: "border-blue-200", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-400" }
    : { border: "border-orange-200", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700", bar: "bg-orange-400" };

  return (
    <div className={`border ${a.border} ${a.bg} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${a.badge}`}>{label}</span>
        {loading
          ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-60" />
          : result
            ? <span className={`text-sm font-bold ${result.correct ? "text-green-600" : "text-red-500"}`}>
                {result.correct ? "✓ Correct" : "✗ Needs fix"}
              </span>
            : <span className="text-xs text-gray-400">Not run yet</span>
        }
      </div>

      {loading && (
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-2">
          <p className="text-[12px] text-gray-700 leading-snug">{result.feedback}</p>
          {result.tip && <p className="text-[11px] text-orange-600">{result.tip}</p>}
          <div className="flex flex-wrap gap-1">
            {result.found.map(c => (
              <span key={c} className="font-mono text-[10px] bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">✓ {c}</span>
            ))}
            {result.missing.map(c => (
              <span key={c} className="font-mono text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">✗ {c}</span>
            ))}
          </div>
          {result.confidence > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-gray-200">
                <div className={`h-full ${a.bar} rounded-full`} style={{ width: `${Math.round(result.confidence * 100)}%` }} />
              </div>
              <span className="text-[10px] text-gray-500">{Math.round(result.confidence * 100)}% confidence</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Pipeline helpers — 8-step visual AI verification flow ─────────────────────

const PIPELINE_ACCENT: Record<string, { border: string; badge: string; num: string }> = {
  orange: { border: "border-orange-200",  badge: "bg-orange-500 text-white",   num: "bg-orange-500 text-white" },
  teal:   { border: "border-teal-200",    badge: "bg-teal-600 text-white",     num: "bg-teal-600 text-white" },
  blue:   { border: "border-blue-200",    badge: "bg-blue-500 text-white",     num: "bg-blue-500 text-white" },
  indigo: { border: "border-indigo-200",  badge: "bg-indigo-600 text-white",   num: "bg-indigo-600 text-white" },
  purple: { border: "border-purple-200",  badge: "bg-purple-600 text-white",   num: "bg-purple-600 text-white" },
  green:  { border: "border-green-200",   badge: "bg-green-600 text-white",    num: "bg-green-600 text-white" },
  gray:   { border: "border-gray-200",    badge: "bg-gray-400 text-white",     num: "bg-gray-400 text-white" },
};

function PipelineCard({ num, title, source, accent, children }: {
  num: number; title: string; source: string; accent: string; children: React.ReactNode;
}) {
  const a = PIPELINE_ACCENT[accent] ?? PIPELINE_ACCENT.gray;
  return (
    <div className={`bg-white border ${a.border} rounded-2xl overflow-hidden shadow-sm`}>
      {/* Card header */}
      <div className={`flex items-start gap-3 px-4 py-3 border-b ${a.border} bg-gray-50`}>
        <span className={`shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${a.num}`}>
          {num}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-gray-800 leading-tight">{title}</p>
          <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">{source}</p>
        </div>
      </div>
      {/* Card body */}
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function DownConnector() {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5 select-none">
      <div className="w-px h-3 bg-gray-300" />
      <div className="text-gray-300 text-sm leading-none">▼</div>
      <div className="w-px h-3 bg-gray-300" />
    </div>
  );
}

function ImagePlaceholder({ text, icon, small }: { text: string; icon: string; small?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-gray-400 ${small ? "h-full py-2" : "py-6"}`}>
      <span className={small ? "text-xl" : "text-3xl"}>{icon}</span>
      <p className={`text-center leading-snug ${small ? "text-[9px] px-1" : "text-[11px] px-4"}`}>{text}</p>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AIResearch({ inline }: { inline?: boolean } = {}) {
  const goBack = useSafeBack("/");
  const location  = useLocation();
  const state     = (location.state ?? {}) as ResearchNavState;

  const { step, stepIdx, chapterId, chapterTitle } = state;

  const [apiResult,  setApiResult]  = useState<VerifyResult | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [history,    setHistory]    = useState<CheckRecord[]>(() => getCheckHistory());
  const [capturedImage]  = useState<string | null>(() => sessionStorage.getItem("blix_captured_image"));
  const [referenceImage] = useState<string | null>(() => sessionStorage.getItem("blix_reference_image"));

  // blix_step_pieces holds the CUMULATIVE component list written by BuildGuide
  // (all steps 0..stepIdx summed). Falls back to current-step comps when absent.
  const [piecesRaw] = useState<string | null>(() => sessionStorage.getItem("blix_step_pieces"));

  const comps = step ? step.components.flatMap(s => {
    const m = s.match(/^(.+?)\s*[xX×](\d+)$/);
    return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
  }) : [];

  // Cumulative pieces — what was actually sent to Gemini as the pieces list
  const cumulativePieces: { code: string; qty: number }[] = (() => {
    if (!piecesRaw) return comps;
    try {
      return (JSON.parse(piecesRaw) as string[]).flatMap(s => {
        const m = s.match(/^(.+?)\s*[×x](\d+)$/);
        return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
      });
    } catch { return comps; }
  })();

  const refreshHistory = () => setHistory(getCheckHistory());

  // ── Run AI vision check via verify-build-step edge function ─────────────────
  // Backend model: google/gemini-1.5-flash via Lovable AI Gateway.
  // NOT Claude — do not label this as Claude Vision in UI or thesis.
  const runVisionAPI = useCallback(async () => {
    if (!capturedImage || !step) return;
    setLoadingApi(true);
    const t0 = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke("verify-build-step", {
        body: {
          imageBase64: capturedImage,
          referenceBase64: referenceImage ?? undefined,
          stepInstruction: step.title.en,
          stepNumber: (stepIdx ?? 0) + 1,
          pieces: comps.map(c => `${c.code} ×${c.qty}`),
          chapterTitle: chapterTitle ?? "BLIX Build Guide",
        },
      });
      if (error) throw error;
      const r = data as {
        status: string; confidence: number;
        found: string[]; missing: string[];
        feedback: string; tip: string;
      };
      const result: VerifyResult = {
        correct: r.status === "correct",
        // Use the actual component-level found/missing from the AI response
        found:   Array.isArray(r.found)   ? r.found   : (r.status === "correct" ? comps.map(c => c.code) : []),
        missing: Array.isArray(r.missing) ? r.missing : (r.status !== "correct" ? comps.map(c => c.code) : []),
        feedback: r.feedback, tip: r.tip, confidence: r.confidence, source: "api",
      };
      setApiResult(result);
      saveCheckRecord({
        chapterId: chapterId ?? "unknown", chapterTitle: chapterTitle ?? "",
        stepIdx: stepIdx ?? 0, stepTitle: step.title.en,
        method: "api", correct: result.correct, confidence: result.confidence,
        found: result.found, missing: result.missing, source: "api",
        responseMs: Date.now() - t0,
      });
    } catch {
      setApiResult({ correct: false, found: [], missing: comps.map(c => c.code), feedback: "API error.", tip: "Check connection.", confidence: 0, source: "mock" });
    }
    setLoadingApi(false);
    refreshHistory();
  }, [capturedImage, step, stepIdx, chapterId, chapterTitle]);

  // Auto-run AI vision check on mount (Gemini via verify-build-step)
  useEffect(() => {
    if (!capturedImage || !step) return;
    runVisionAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = computeStats(history);
  const apiHistory = history.filter(r => r.method === "api");

  // ── Chart data (AI Vision checks only) ─────────────────────────────────────
  const confidenceData = [...apiHistory].reverse().slice(-20).map((r, i) => ({
    check: i + 1,
    "Confidence %": Math.round(r.confidence * 100),
  }));

  const perStepData = Object.entries(
    apiHistory.reduce<Record<string, { total: number; ok: number }>>(
      (acc, r) => {
        const k = `Step ${r.stepIdx + 1}`;
        if (!acc[k]) acc[k] = { total: 0, ok: 0 };
        acc[k].total++;
        if (r.correct) acc[k].ok++;
        return acc;
      }, {}
    )
  ).map(([step, v]) => ({
    step,
    "Accuracy %": Math.round(v.ok / v.total * 100),
  }));

  return (
    <div className={inline ? "bg-gray-50" : "min-h-screen bg-gray-50"}>
      {/* Header — hidden when embedded inline */}
      {!inline && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={goBack} aria-label="Back"
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-[15px] text-gray-900">🔬 AI Model Research</h1>
              {step && <p className="text-[11px] text-gray-500">Step {(stepIdx ?? 0) + 1}: {step.title.en}</p>}
            </div>
            <button onClick={() => { clearCheckHistory(); refreshHistory(); }}
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
              <Trash2 className="w-3.5 h-3.5" /> Clear history
            </button>
          </div>
        </div>
      )}

      {/* Inline toolbar — shown when embedded */}
      {inline && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-[12px] font-bold text-gray-600 flex items-center gap-1.5">
            🔬 AI Model Research <span className="text-gray-400 font-normal">— performance analytics</span>
          </p>
          <button onClick={() => { clearCheckHistory(); refreshHistory(); }}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
      )}

      <div className={inline ? "px-4 py-3 space-y-4 max-w-5xl" : "container mx-auto px-4 py-6 space-y-6 max-w-5xl"}>

        {/* ── Image comparison — always shown when a photo exists ── */}
        {capturedImage && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Current Check</h2>
              {step && (
                <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  Step {(stepIdx ?? 0) + 1}: {step.title.en}
                </span>
              )}
            </div>

            {/* Side-by-side image comparison — large */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Reference */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wide text-center flex items-center justify-center gap-1">
                  📐 3D Reference
                </p>
                <div className="relative rounded-2xl overflow-hidden border-2 border-teal-400 bg-gray-100 shadow-sm" style={{ height: 280 }}>
                  {referenceImage ? (
                    <img
                      src={referenceImage}
                      alt="3D reference model"
                      className="w-full h-full object-contain bg-white"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                      <span className="text-3xl">📐</span>
                      <span className="text-[11px]">No reference captured yet</span>
                      <span className="text-[10px] text-gray-300">Open Build Guide to generate one</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    REFERENCE
                  </div>
                </div>
              </div>

              {/* Captured photo */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wide text-center flex items-center justify-center gap-1">
                  📷 Your Build
                </p>
                <div className="relative rounded-2xl overflow-hidden border-2 border-orange-400 shadow-sm" style={{ height: 280 }}>
                  <img
                    src={capturedImage}
                    alt="Your captured build"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    YOUR BUILD
                  </div>
                </div>
              </div>
            </div>

            {/* AI Vision result + action */}
            <div className="space-y-2">
              <ResultPanel result={apiResult} label="☁️ AI Vision (Gemini via Lovable)" accent="blue" loading={loadingApi} />
              {!apiResult && !loadingApi && step && (
                <button onClick={runVisionAPI}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Sparkles className="w-4 h-4" /> Verify with AI Vision
                </button>
              )}
              {!step && (
                <div className="text-center text-[11px] text-gray-400 py-2">
                  Navigate from the Build Guide to verify this photo against a step.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Stat cards ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Total Checks" value={apiHistory.length} sub="AI Vision API" color="text-gray-800" isCount />
            <StatCard label="Accuracy" value={stats.apiAcc} sub={`${apiHistory.length} checks`} color="text-blue-600" />
            <StatCard label="Avg Confidence" value={stats.apiConf} sub="AI Vision" color="text-purple-600" />
          </div>
        </section>

        {/* ── Charts ── */}
        {apiHistory.length >= 2 && (
          <>
            {/* Confidence over time */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="text-[12px] font-bold text-gray-700 mb-3">AI Vision Confidence Over Checks (last 20)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="check" tick={{ fontSize: 10 }} label={{ value: "Check #", position: "insideBottom", offset: -2, fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="Confidence %" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Per-step accuracy */}
            {perStepData.length >= 2 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="text-[12px] font-bold text-gray-700 mb-3">Accuracy by Build Step</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={perStepData} barSize={24}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="step" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Bar dataKey="Accuracy %" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}

        {/* ── Check history table ── */}
        {history.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Check History</h2>
              <span className="text-[11px] text-gray-400">{history.length} records</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {["Step", "Method", "Verdict", "Confidence", "Time", "Date"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {history.slice(0, 30).map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 font-mono text-gray-700">
                          <div>{r.chapterTitle?.slice(0, 12)}</div>
                          <div className="text-gray-400">Step {r.stepIdx + 1}</div>
                        </td>
                        <td className="px-3 py-2">
                          {r.method === "api"
                            ? <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">☁️ Vision</span>
                            : <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-semibold">🤖 Demo COCO-SSD / Local Model</span>
                          }
                        </td>
                        <td className="px-3 py-2">
                          {r.correct
                            ? <span className="flex items-center gap-1 text-green-600 font-semibold"><CheckCircle2 className="w-3 h-3" /> Pass</span>
                            : <span className="flex items-center gap-1 text-red-500 font-semibold"><XCircle className="w-3 h-3" /> Fail</span>
                          }
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${r.correct ? "bg-green-400" : "bg-orange-400"}`}
                                style={{ width: `${Math.round(r.confidence * 100)}%` }} />
                            </div>
                            <span className="text-gray-500">{Math.round(r.confidence * 100)}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-gray-400">
                          {r.responseMs ? `${r.responseMs}ms` : "—"}
                        </td>
                        <td className="px-3 py-2 text-gray-400">
                          {new Date(r.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {history.length === 0 && !capturedImage && (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">🔬</p>
            <p className="font-semibold text-gray-500 mb-1">No check history yet</p>
            <p className="text-[12px]">Take a photo in the Build Guide and run an AI check to see results here.</p>
          </div>
        )}

        {/* ── AI Step Check Pipeline — 8-step visual execution trace ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-1 uppercase tracking-wide">AI Step Check Pipeline</h2>
          <p className="text-[11px] text-gray-400 mb-4">
            Step-by-step execution trace — live images and data from the current check.
          </p>

          <div className="space-y-1.5">

            {/* ① Active Step Card */}
            <PipelineCard num={1} title="Active Build Step" source="chapter.build.steps[stepIdx]" accent="orange">
              {step ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      📖 {chapterTitle ?? "—"}
                    </span>
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Step {(stepIdx ?? 0) + 1}
                    </span>
                  </div>
                  <p className="text-[13px] font-semibold text-gray-800">{step.title.en}</p>
                  <div className="flex flex-wrap gap-1">
                    {cumulativePieces.map((c, i) => (
                      <span key={i} className="font-mono text-[10px] bg-orange-50 border border-orange-200 text-orange-700 px-1.5 py-0.5 rounded-full font-semibold">
                        {c.code} ×{c.qty}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    {cumulativePieces.length} cumulative part{cumulativePieces.length !== 1 ? "s" : ""} — all components assembled up to this step
                  </p>
                </div>
              ) : (
                <p className="text-[12px] text-gray-400 italic">No step active — navigate here from the Build Guide.</p>
              )}
            </PipelineCard>

            <DownConnector />

            {/* ② Generated 3D Reference Image */}
            <PipelineCard num={2} title="Generated Procedural 3D Reference" source="renderStepReferenceImage(cumulativeComps, stepLabel)" accent="teal">
              <p className="text-[10px] text-gray-500 mb-2">
                Dynamically rendered from the cumulative component list using Gallery-quality Three.js buildObject geometry.
                Changes on every step. Not a textbook image.
              </p>
              {referenceImage ? (
                <div className="relative rounded-xl overflow-hidden border border-teal-200 bg-white" style={{ maxHeight: 220 }}>
                  <img src={referenceImage} alt="Generated 3D reference" className="w-full object-contain" style={{ maxHeight: 220 }} />
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    PROCEDURAL 3D RENDER
                  </div>
                </div>
              ) : (
                <ImagePlaceholder text="No 3D reference yet — run AI Step Check from the Build Guide first." icon="📐" />
              )}
            </PipelineCard>

            <DownConnector />

            {/* ③ Student Captured Photo */}
            <PipelineCard num={3} title="Student Real Build Photo" source="sessionStorage · blix_captured_image" accent="orange">
              <p className="text-[10px] text-gray-500 mb-2">
                Live camera capture from the student's device in BuildGuide. JPEG encoded, passed as imageBase64.
              </p>
              {capturedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-orange-200" style={{ maxHeight: 220 }}>
                  <img src={capturedImage} alt="Student build photo" className="w-full object-cover" style={{ maxHeight: 220 }} />
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    STUDENT PHOTO
                  </div>
                </div>
              ) : (
                <ImagePlaceholder text="No captured image yet — run AI Step Check first." icon="📷" />
              )}
            </PipelineCard>

            <DownConnector />

            {/* ④ AI Input Package */}
            <PipelineCard num={4} title="AI Input Package" source="sent to verify-build-step as JSON body" accent="blue">
              <p className="text-[10px] text-gray-500 mb-3">
                Both images + cumulative pieces list + step instruction sent together as the Gemini prompt payload.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-teal-600 uppercase">referenceBase64</p>
                  <div className="rounded-lg overflow-hidden border border-teal-100 bg-gray-50" style={{ height: 100 }}>
                    {referenceImage
                      ? <img src={referenceImage} alt="ref" className="w-full h-full object-contain" />
                      : <ImagePlaceholder text="—" icon="📐" small />}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-orange-500 uppercase">imageBase64</p>
                  <div className="rounded-lg overflow-hidden border border-orange-100 bg-gray-50" style={{ height: 100 }}>
                    {capturedImage
                      ? <img src={capturedImage} alt="photo" className="w-full h-full object-cover" />
                      : <ImagePlaceholder text="—" icon="📷" small />}
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">pieces (blix_step_pieces)</p>
                <div className="flex flex-wrap gap-1">
                  {cumulativePieces.length > 0 ? cumulativePieces.map((c, i) => (
                    <span key={i} className="font-mono text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {c.code} ×{c.qty}
                    </span>
                  )) : (
                    <span className="text-[10px] text-gray-400 italic">No pieces loaded — run AI check first</span>
                  )}
                </div>
              </div>
            </PipelineCard>

            <DownConnector />

            {/* ⑤ Supabase Edge Function */}
            <PipelineCard num={5} title="Supabase Edge Function" source="supabase/functions/verify-build-step/index.ts" accent="indigo">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-xl shrink-0">⚡</div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800 font-mono">verify-build-step</p>
                  <p className="text-[10px] text-gray-500">Deno runtime · Supabase hosted · CORS enabled</p>
                  <p className="text-[10px] text-gray-400">Receives JSON body → constructs prompt → calls AI gateway → returns structured JSON</p>
                </div>
              </div>
            </PipelineCard>

            <DownConnector />

            {/* ⑥ Gemini / Lovable Gateway */}
            <PipelineCard num={6} title="Gemini 1.5 Flash via Lovable AI Gateway" source="POST https://ai.gateway.lovable.dev/v1/chat/completions" accent="purple">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl shrink-0">☁️</div>
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-gray-800">google/gemini-1.5-flash</p>
                  <p className="text-[10px] text-gray-500">OpenAI-compatible API · multimodal · tool/function calling</p>
                  <p className="text-[10px] text-gray-400">Auth: LOVABLE_API_KEY · Tool: verify_step → structured JSON output</p>
                  <p className="text-[10px] font-semibold text-purple-600">Not Claude. Not OpenAI. Gemini via Lovable Gateway.</p>
                </div>
              </div>
            </PipelineCard>

            <DownConnector />

            {/* ⑦ AI Result */}
            <PipelineCard num={7} title="AI Verification Result" source="verify_step tool response → { status, confidence, found, missing, feedback, tip }" accent="green">
              {loadingApi ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px]">Gemini is analysing the build…</span>
                </div>
              ) : apiResult ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${apiResult.correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {apiResult.correct ? "✓ Correct" : "✗ Needs fix"}
                    </span>
                    <span className="text-[12px] font-semibold text-gray-700">
                      Confidence: {Math.round((apiResult.confidence ?? 0) * 100)}%
                    </span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                      <div className={`h-full rounded-full transition-all ${apiResult.correct ? "bg-green-400" : "bg-orange-400"}`}
                        style={{ width: `${Math.round((apiResult.confidence ?? 0) * 100)}%` }} />
                    </div>
                  </div>
                  {apiResult.found?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Found ✓</p>
                      <div className="flex flex-wrap gap-1">
                        {apiResult.found.map((c, i) => (
                          <span key={i} className="font-mono text-[10px] bg-green-50 border border-green-200 text-green-700 px-1.5 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {apiResult.missing?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-red-500 uppercase mb-1">Missing ✗</p>
                      <div className="flex flex-wrap gap-1">
                        {apiResult.missing.map((c, i) => (
                          <span key={i} className="font-mono text-[10px] bg-red-50 border border-red-200 text-red-600 px-1.5 py-0.5 rounded-full">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {apiResult.feedback && (
                    <p className="text-[12px] text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                      💬 {apiResult.feedback}
                    </p>
                  )}
                  {apiResult.tip && !apiResult.correct && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                      💡 {apiResult.tip}
                    </p>
                  )}
                </div>
              ) : (
                <ImagePlaceholder text="Result will appear here after running AI Vision check." icon="🔬" />
              )}
            </PipelineCard>

            <DownConnector />

            {/* ⑧ Progress Save / Unlock */}
            <PipelineCard num={8} title="Progress Save & Step Unlock" source="Supabase · chapter_progress table" accent={apiResult?.correct ? "green" : "gray"}>
              {apiResult ? (
                <div className="space-y-2">
                  {[
                    { ok: apiResult.correct, text: "Saved to chapter_progress (Supabase)" },
                    { ok: apiResult.correct, text: `Step ${(stepIdx ?? 0) + 2} unlocked` },
                    { ok: apiResult.correct, text: "AR overlay mode available for this step" },
                  ].map(({ ok, text }, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[12px] font-semibold ${ok ? "text-green-700" : "text-gray-400"}`}>
                      <span>{ok ? "✓" : "○"}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                  {!apiResult.correct && (
                    <p className="text-[11px] text-gray-400 mt-1 italic">↩ Student retakes photo after fixing the build</p>
                  )}
                </div>
              ) : (
                <ImagePlaceholder text="Unlock status shown after AI result." icon="🔓" />
              )}
            </PipelineCard>

          </div>
        </section>
      </div>
    </div>
  );
}
