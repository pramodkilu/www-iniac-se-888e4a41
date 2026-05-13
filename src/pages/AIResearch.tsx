import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
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

// ── Main page ──────────────────────────────────────────────────────────────────
export default function AIResearch({ inline }: { inline?: boolean } = {}) {
  const navigate  = useNavigate();
  const goBack = useSafeBack("/");
  const location  = useLocation();
  const state     = (location.state ?? {}) as ResearchNavState;

  const { method, step, stepIdx, chapterId, chapterTitle } = state;

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

  // ── Run Claude Vision API ──────────────────────────────────────────────────
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

  // Auto-run Claude Vision on mount
  useEffect(() => {
    if (!capturedImage || !step) return;
    runVisionAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = computeStats(history);
  const apiHistory = history.filter(r => r.method === "api");

  // ── Chart data (Claude Vision only) ────────────────────────────────────────
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

        {/* ── Current check results ── */}
        {capturedImage && step && (
          <section>
            <h2 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Current Check</h2>

            {/* Side-by-side image comparison */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1.5">
                  3D Reference (from Build Guide)
                </p>
                <div className="rounded-xl overflow-hidden border-2 border-teal-400 bg-gray-50 relative" style={{ aspectRatio: "4/3" }}>
                  {referenceImage
                    ? <img src={referenceImage} alt="3D reference" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Viewing 3D model…</div>
                  }
                  <div className="absolute top-1.5 left-1.5 bg-teal-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">REFERENCE</div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide text-center mb-1.5">
                  Your Build (captured photo)
                </p>
                <div className="rounded-xl overflow-hidden border-2 border-orange-400 relative" style={{ aspectRatio: "4/3" }}>
                  <img src={capturedImage} alt="Your build" className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">YOUR BUILD</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <ResultPanel result={apiResult} label="☁️ Claude Vision API" accent="blue" loading={loadingApi} />
              {!apiResult && !loadingApi && (
                <button onClick={runVisionAPI}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Run Claude Vision
                </button>
              )}
            </div>
          </section>
        )}

        {/* ── Stat cards ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Total Checks" value={apiHistory.length} sub="Claude Vision API" color="text-gray-800" isCount />
            <StatCard label="Accuracy" value={stats.apiAcc} sub={`${apiHistory.length} checks`} color="text-blue-600" />
            <StatCard label="Avg Confidence" value={stats.apiConf} sub="Claude Vision" color="text-purple-600" />
          </div>
        </section>

        {/* ── Charts ── */}
        {apiHistory.length >= 2 && (
          <>
            {/* Confidence over time */}
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="text-[12px] font-bold text-gray-700 mb-3">Claude Vision Confidence Over Checks (last 20)</h3>
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
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔬</p>
            <p className="font-semibold text-gray-500 mb-1">No check history yet</p>
            <p className="text-[12px]">Take a photo in the Build Guide and run an AI check to see results here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
