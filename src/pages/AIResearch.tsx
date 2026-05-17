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

// ── Flowchart sub-components ───────────────────────────────────────────────────
const NODE_COLORS: Record<string, string> = {
  orange: "bg-orange-500 text-white",
  blue:   "bg-blue-500 text-white",
  purple: "bg-purple-500 text-white",
  green:  "bg-green-500 text-white",
  red:    "bg-red-500 text-white",
};

function FlowNode({ color, emoji, label, sub, wide }: {
  color: string; emoji: string; label: string; sub?: string; wide?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center rounded-xl px-3 py-2 shadow-sm gap-0.5
      ${NODE_COLORS[color] ?? "bg-gray-400 text-white"}
      ${wide ? "w-full max-w-xs" : "w-32"}
    `}>
      <span className="text-lg leading-none">{emoji}</span>
      <span className="text-[11px] font-bold leading-tight">{label}</span>
      {sub && <span className="text-[9px] opacity-80 leading-tight">{sub}</span>}
    </div>
  );
}

function FlowArrow({ dir }: { dir: "down" | "right" }) {
  return dir === "down"
    ? <div className="flex justify-center text-gray-300 text-lg leading-none select-none py-0.5">↓</div>
    : <div className="flex items-center text-gray-300 text-lg leading-none select-none px-0.5">→</div>;
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

  const comps = step ? step.components.flatMap(s => {
    const m = s.match(/^(.+?)\s*[xX×](\d+)$/);
    return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
  }) : [];

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

        {/* ── How It Works flowchart ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-4 uppercase tracking-wide">How AI Step Check Works</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            {/* Top row: 3 input nodes */}
            <div className="flex items-stretch justify-center gap-2 mb-1">
              <FlowNode color="orange" emoji="🧑‍🎓" label="Student Completes Build Step" />
              <FlowArrow dir="right" />
              <FlowNode color="blue" emoji="📐" label="3D Reference Snapshot Captured" sub="from StepViewer3D" />
              <FlowArrow dir="right" />
              <FlowNode color="orange" emoji="📷" label="Student Takes Photo of Build" sub="via camera" />
            </div>

            {/* Down arrow */}
            <div className="flex justify-center"><FlowArrow dir="down" /></div>

            {/* AI node — full width */}
            <div className="flex justify-center mb-1">
              <FlowNode color="purple" emoji="☁️" label="Gemini Vision Compares Both Images" sub="via Supabase Edge Function · verify-build-step (google/gemini-1.5-flash)" wide />
            </div>

            {/* Down arrow */}
            <div className="flex justify-center"><FlowArrow dir="down" /></div>

            {/* Decision diamond */}
            <div className="flex justify-center mb-1">
              <div className="flex flex-col items-center">
                <div className="w-28 h-12 bg-amber-400 text-gray-900 text-[11px] font-bold flex items-center justify-center text-center rounded-lg rotate-0 shadow-sm px-2">
                  ✅ Correct Build?
                </div>
              </div>
            </div>

            {/* Two outcome branches */}
            <div className="flex items-start justify-center gap-6 mt-1">
              {/* Pass branch */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Yes</div>
                <FlowArrow dir="down" />
                <FlowNode color="green" emoji="🎉" label="Step Verified" sub="Next Step Unlocked" />
                <div className="mt-2 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5 text-[10px] text-green-700 font-semibold text-center">
                  Saved to Supabase<br/>chapter_progress
                </div>
              </div>

              {/* Fail branch */}
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-bold text-red-500 uppercase tracking-wide">No</div>
                <FlowArrow dir="down" />
                <FlowNode color="red" emoji="🔧" label="Feedback Given" sub="Student fixes build" />
                <div className="mt-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-[10px] text-red-600 font-semibold text-center">
                  Missing components<br/>listed with tips
                </div>
                <div className="text-[10px] text-gray-400 mt-1">↩ loops back to photo</div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-5 pt-4 border-t border-gray-100">
              {[
                { color: "bg-orange-500", label: "Student action" },
                { color: "bg-blue-500",   label: "System capture" },
                { color: "bg-purple-500", label: "AI Vision (Gemini)" },
                { color: "bg-green-500",  label: "Pass" },
                { color: "bg-red-500",    label: "Fail / retry" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                  <span className="text-[10px] text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
