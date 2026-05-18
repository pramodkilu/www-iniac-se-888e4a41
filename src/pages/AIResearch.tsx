import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ScatterChart, Scatter, Cell,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { type VerifyResult, useComponentDetector, verifyComponents } from "@/hooks/useComponentDetector";
import {
  getCheckHistory, saveCheckRecord, clearCheckHistory, computeStats, type CheckRecord,
  exportHistoryJSON, exportHistoryCSV,
} from "@/hooks/useCheckHistory";
import { computeStepComplexity } from "@/lib/stepComplexity";
import { renderStepReferenceImage } from "@/components/ThreeDGallery";
import { CheckCircle2, XCircle, ChevronLeft, Trash2, Sparkles, Download, FlaskConical, Bug } from "lucide-react";
import { useSafeBack } from "@/lib/safeBack";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface ResearchNavState {
  method: "api" | "model" | "both";
  step: { title: { en: string }; components: string[] } | null;
  stepIdx: number;
  chapterId: string;
  chapterTitle: string;
}

interface CurrentCheck {
  chapterId: string;
  chapterTitle: string;
  stepIdx: number;
  stepTitle: string;
  cumulativePieces: { code: string; qty: number }[];
  capturedImage: string;
  referenceImage: string | null;
  createdAt: string;
}

// ── Read unified current-check from sessionStorage ────────────────────────────
// BuildGuide writes "blix_current_check" before navigating here.
// Falls back to scattered individual keys + location.state for backward compat.
function readCurrentCheck(state: Partial<ResearchNavState>): CurrentCheck | null {
  // Try unified key first
  try {
    const raw = sessionStorage.getItem("blix_current_check");
    if (raw) {
      const parsed = JSON.parse(raw) as CurrentCheck;
      if (parsed.capturedImage && parsed.chapterId) return parsed;
    }
  } catch { /* continue to fallback */ }

  // Fallback: reconstruct from scattered keys + location.state
  const capturedImage = sessionStorage.getItem("blix_captured_image");
  if (!capturedImage) return null;

  const { step, stepIdx, chapterId, chapterTitle } = state;
  const piecesRaw = sessionStorage.getItem("blix_step_pieces");
  const comps: { code: string; qty: number }[] = step
    ? step.components.flatMap(s => {
        const m = s.match(/^(.+?)\s*[xX×](\d+)$/);
        return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
      })
    : [];
  const cumulativePieces: { code: string; qty: number }[] = (() => {
    if (!piecesRaw) return comps;
    try {
      return (JSON.parse(piecesRaw) as string[]).flatMap(s => {
        const m = s.match(/^(.+?)\s*[×x](\d+)$/);
        return m ? [{ code: m[1].trim(), qty: parseInt(m[2]) }] : [{ code: s.trim(), qty: 1 }];
      });
    } catch { return comps; }
  })();

  return {
    chapterId: chapterId ?? "unknown",
    chapterTitle: chapterTitle ?? "Unknown Chapter",
    stepIdx: stepIdx ?? 0,
    stepTitle: step?.title.en ?? `Step ${(stepIdx ?? 0) + 1}`,
    cumulativePieces,
    capturedImage,
    referenceImage: sessionStorage.getItem("blix_reference_image"),
    createdAt: new Date().toISOString(),
  };
}

const SESSION_KEYS = ["blix_current_check", "blix_captured_image", "blix_reference_image", "blix_step_pieces"];

// ── UI helpers ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color, isCount }: {
  label: string; value: string | number | null; sub?: string; color: string; isCount?: boolean;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-1">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide font-semibold">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>
        {value ?? "—"}{typeof value === "number" && value !== null && !isCount ? "%" : ""}
      </p>
      {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

function ResultPanel({ result, label, accent, loading, error }: {
  result: VerifyResult | null; label: string; accent: "blue" | "orange"; loading: boolean; error?: string | null;
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
            : error
              ? <span className="text-xs text-red-500 font-semibold">Error</span>
              : <span className="text-xs text-gray-400">Not run yet</span>
        }
      </div>
      {loading && (
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      )}
      {error && !loading && !result && (
        <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
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
      <div className={`flex items-start gap-3 px-4 py-3 border-b ${a.border} bg-gray-50`}>
        <span className={`shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${a.num}`}>
          {num}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-gray-800 leading-tight">{title}</p>
          <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">{source}</p>
        </div>
      </div>
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
  const location = useLocation();
  const state = (location.state ?? {}) as Partial<ResearchNavState>;

  // ── Single source of truth: currentCheck from sessionStorage ─────────────
  const [currentCheck, setCurrentCheck] = useState<CurrentCheck | null>(() => readCurrentCheck(state));

  // Derived flat values — always from currentCheck
  const capturedImage    = currentCheck?.capturedImage    ?? null;
  const cumulativePieces = currentCheck?.cumulativePieces ?? [];
  const stepIdx          = currentCheck?.stepIdx          ?? 0;
  const stepTitle        = currentCheck?.stepTitle        ?? "";
  const chapterId        = currentCheck?.chapterId        ?? "";
  const chapterTitle     = currentCheck?.chapterTitle     ?? "";

  // Reference image — starts from currentCheck, may be regenerated
  const [referenceImage, setReferenceImage] = useState<string | null>(
    currentCheck?.referenceImage ?? null
  );

  // ── Result state ─────────────────────────────────────────────────────────
  const [apiResult,  setApiResult]  = useState<VerifyResult | null>(null);
  const [tfResult,   setTfResult]   = useState<VerifyResult | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [loadingTf,  setLoadingTf]  = useState(false);
  const [apiError,   setApiError]   = useState<string | null>(null);
  const [researchMode, setResearchMode] = useState(false);
  const [showDebug,    setShowDebug]    = useState(false);
  const [history,    setHistory]    = useState<CheckRecord[]>(() => getCheckHistory());

  const { status: detectorStatus, mode: detectorMode, detect } = useComponentDetector();
  const complexity = computeStepComplexity(cumulativePieces);

  const refreshHistory = useCallback(() => setHistory(getCheckHistory()), []);

  // ── Regenerate reference image on mount if missing ────────────────────────
  useEffect(() => {
    if (referenceImage || !currentCheck || cumulativePieces.length === 0) return;
    const regen = renderStepReferenceImage(
      cumulativePieces,
      `Step ${stepIdx + 1}${stepTitle ? " — " + stepTitle : ""}`
    );
    if (regen) {
      setReferenceImage(regen);
      sessionStorage.setItem("blix_reference_image", regen);
      const updated = { ...currentCheck, referenceImage: regen };
      sessionStorage.setItem("blix_current_check", JSON.stringify(updated));
      setCurrentCheck(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────
  const canRunGemini = !!(capturedImage && cumulativePieces.length > 0 && stepTitle);
  const missingItems = [
    !capturedImage               && "captured image",
    cumulativePieces.length === 0 && "cumulative pieces",
    !stepTitle                   && "step metadata",
  ].filter(Boolean) as string[];

  // ── Run Gemini multimodal check ───────────────────────────────────────────
  const runVisionAPI = useCallback(async () => {
    if (!canRunGemini || !capturedImage) return;
    setLoadingApi(true);
    setApiError(null);
    const t0 = Date.now();
    try {
      const { data, error } = await supabase.functions.invoke("verify-build-step", {
        body: {
          imageBase64: capturedImage,
          referenceBase64: referenceImage ?? undefined,
          stepInstruction: stepTitle,
          stepNumber: stepIdx + 1,
          pieces: cumulativePieces.map(c => `${c.code} ×${c.qty}`),
          chapterTitle: chapterTitle || "BLIX Build Guide",
        },
      });
      if (error) throw error;
      const r = data as {
        status: string; confidence: number;
        found: string[]; missing: string[];
        feedback: string; tip: string;
      };
      if ((r as any)?.error) throw new Error((r as any).error);
      const result: VerifyResult = {
        correct: r.status === "correct",
        found:   Array.isArray(r.found)   ? r.found   : (r.status === "correct" ? cumulativePieces.map(c => c.code) : []),
        missing: Array.isArray(r.missing) ? r.missing : (r.status !== "correct" ? cumulativePieces.map(c => c.code) : []),
        feedback: r.feedback, tip: r.tip, confidence: r.confidence, source: "api",
      };
      const latencyMs = Date.now() - t0;
      setApiResult(result);
      saveCheckRecord({
        chapterId, chapterTitle,
        stepIdx, stepTitle,
        method: "api", correct: result.correct, confidence: result.confidence,
        found: result.found, missing: result.missing, source: "api",
        responseMs: latencyMs,
        cumulativeCount: cumulativePieces.reduce((s, c) => s + c.qty, 0),
        uniqueTypes: cumulativePieces.length,
        stepComplexity: complexity.score,
        referenceType: referenceImage ? "procedural-3d" : "none",
        geminiStatus: r.status as "correct" | "incorrect" | "needs_review",
        geminiConfidence: r.confidence,
        geminiFound: result.found,
        geminiMissing: result.missing,
        geminiMs: latencyMs,
      });
      refreshHistory();
    } catch (e: any) {
      // API errors are NOT saved to history — only real model responses are recorded
      setApiError(e?.message || "Gemini API call failed. Check your connection and try again.");
    }
    setLoadingApi(false);
  }, [canRunGemini, capturedImage, referenceImage, stepTitle, stepIdx, cumulativePieces, chapterId, chapterTitle, complexity.score, refreshHistory]);

  // ── Run TF.js browser-side detection ─────────────────────────────────────
  const runTFCheck = useCallback(async () => {
    if (!capturedImage || detectorStatus !== "ready") return;
    setLoadingTf(true);
    const t0 = Date.now();
    try {
      const img = new Image();
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = rej;
        img.src = capturedImage;
      });
      const detected = await detect(img);
      const result = verifyComponents(detected, cumulativePieces, detectorMode);
      const latencyMs = Date.now() - t0;
      setTfResult(result);

      let agreementScore: number | undefined;
      if (apiResult) {
        const allCodes = new Set([...cumulativePieces.map(c => c.code)]);
        let agreed = 0;
        allCodes.forEach(code => {
          if (apiResult.found.includes(code) === result.found.includes(code)) agreed++;
        });
        agreementScore = allCodes.size > 0 ? agreed / allCodes.size : 0;
      }

      saveCheckRecord({
        chapterId, chapterTitle,
        stepIdx, stepTitle,
        method: "model", correct: result.correct, confidence: result.confidence,
        found: result.found, missing: result.missing, source: result.source,
        responseMs: latencyMs,
        cumulativeCount: cumulativePieces.reduce((s, c) => s + c.qty, 0),
        uniqueTypes: cumulativePieces.length,
        stepComplexity: complexity.score,
        referenceType: referenceImage ? "procedural-3d" : "none",
        tfStatus: result.correct ? "correct" : "incorrect",
        tfConfidence: result.confidence,
        tfFound: result.found,
        tfMissing: result.missing,
        tfMs: latencyMs,
        tfMode: detectorMode,
        agreementScore,
      });
      refreshHistory();
    } catch (e) {
      console.error("[TF check]", e);
      setTfResult({ correct: false, found: [], missing: cumulativePieces.map(c => c.code), feedback: "TF inference failed.", tip: "", confidence: 0, source: "mock" });
    }
    setLoadingTf(false);
  }, [capturedImage, detectorStatus, detectorMode, detect, cumulativePieces, apiResult, chapterId, chapterTitle, stepIdx, stepTitle, complexity.score, referenceImage, refreshHistory]);

  // ── Auto-run Gemini on mount when check is ready ──────────────────────────
  useEffect(() => {
    if (canRunGemini) runVisionAPI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally once on mount

  // ── Clear actions ─────────────────────────────────────────────────────────
  const clearHistory = () => {
    clearCheckHistory();
    setHistory([]);
    // Don't clear current check results — user may still want to see the active result
  };

  const clearCurrentCheckFn = () => {
    SESSION_KEYS.forEach(k => sessionStorage.removeItem(k));
    setCurrentCheck(null);
    setReferenceImage(null);
    setApiResult(null);
    setTfResult(null);
    setApiError(null);
  };

  const clearAll = () => {
    clearCheckHistory();
    setHistory([]);
    SESSION_KEYS.forEach(k => sessionStorage.removeItem(k));
    setCurrentCheck(null);
    setReferenceImage(null);
    setApiResult(null);
    setTfResult(null);
    setApiError(null);
  };

  // ── Chart data ─────────────────────────────────────────────────────────────
  const stats = computeStats(history);
  const apiHistory = history.filter(r => r.method === "api");

  const confidenceData = [...apiHistory].reverse().slice(-20).map((r, i) => ({
    check: i + 1,
    "Confidence %": Math.round(r.confidence * 100),
  }));

  const perStepData = Object.entries(
    apiHistory.reduce<Record<string, { total: number; ok: number }>>((acc, r) => {
      const k = `Step ${r.stepIdx + 1}`;
      if (!acc[k]) acc[k] = { total: 0, ok: 0 };
      acc[k].total++;
      if (r.correct) acc[k].ok++;
      return acc;
    }, {})
  ).map(([step, v]) => ({ step, "Accuracy %": Math.round(v.ok / v.total * 100) }));

  const latencyData    = stats.latencyBuckets;
  const confDistData   = stats.confidenceBuckets;
  const complexityScatterData = stats.complexityVsConfidence;

  // ── Shared toolbar ─────────────────────────────────────────────────────────
  const toolbarButtons = (
    <>
      <button onClick={() => setResearchMode(v => !v)}
        className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${researchMode ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-500 hover:border-violet-400 hover:text-violet-600"}`}>
        <FlaskConical className="w-3.5 h-3.5" /> Research Mode
      </button>
      <button onClick={() => setShowDebug(v => !v)} title="Toggle debug panel"
        className={`flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg border transition-all ${showDebug ? "bg-gray-800 text-green-400 border-gray-700" : "border-gray-200 text-gray-400 hover:border-gray-400"}`}>
        <Bug className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => exportHistoryJSON(history)} title="Export JSON"
        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200">
        <Download className="w-3.5 h-3.5" /> JSON
      </button>
      <button onClick={() => exportHistoryCSV(history)} title="Export CSV"
        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-green-600 transition-colors px-2 py-1 rounded-lg hover:bg-green-50 border border-transparent hover:border-green-200">
        <Download className="w-3.5 h-3.5" /> CSV
      </button>
      <button onClick={clearHistory}
        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        title="Clear check history (keeps current check)">
        <Trash2 className="w-3.5 h-3.5" /> History
      </button>
      {currentCheck && (
        <button onClick={clearCurrentCheckFn}
          className="flex items-center gap-1 text-[11px] text-orange-400 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
          title="Clear current check">
          <Trash2 className="w-3.5 h-3.5" /> Check
        </button>
      )}
    </>
  );

  // ── Debug panel ────────────────────────────────────────────────────────────
  const debugPanel = showDebug && (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4 font-mono text-[11px] space-y-1">
      <p className="text-gray-400 mb-2">// Current Check Debug</p>
      <p><span className="text-gray-500">currentCheck:</span> <span className={currentCheck ? "text-green-400" : "text-red-400"}>{currentCheck ? "✓ loaded" : "✗ null"}</span></p>
      <p><span className="text-gray-500">capturedImage:</span> <span className={capturedImage ? "text-green-400" : "text-red-400"}>{capturedImage ? `✓ (${Math.round(capturedImage.length / 1024)}kb)` : "✗ missing"}</span></p>
      <p><span className="text-gray-500">referenceImage:</span> <span className={referenceImage ? "text-green-400" : "text-yellow-400"}>{referenceImage ? `✓ (${Math.round(referenceImage.length / 1024)}kb)` : "⚠ missing (will regenerate)"}</span></p>
      <p><span className="text-gray-500">cumulativePieces:</span> <span className="text-cyan-400">{cumulativePieces.length} parts — [{cumulativePieces.slice(0, 4).map(c => c.code).join(", ")}{cumulativePieces.length > 4 ? "…" : ""}]</span></p>
      <p><span className="text-gray-500">stepTitle:</span> <span className="text-yellow-300">"{stepTitle || "(none)"}"</span></p>
      <p><span className="text-gray-500">chapterTitle:</span> <span className="text-yellow-300">"{chapterTitle || "(none)"}"</span></p>
      <p><span className="text-gray-500">stepIdx:</span> <span className="text-cyan-400">{stepIdx}</span></p>
      <p><span className="text-gray-500">canRunGemini:</span> <span className={canRunGemini ? "text-green-400" : "text-red-400"}>{canRunGemini ? "✓ true" : `✗ false — missing: ${missingItems.join(", ")}`}</span></p>
      {apiError && <p><span className="text-gray-500">lastGeminiError:</span> <span className="text-red-400">"{apiError}"</span></p>}
      <p><span className="text-gray-500">historyCount:</span> <span className="text-cyan-400">{history.length} records ({apiHistory.length} api)</span></p>
    </div>
  );

  // ── CASE B: No active check ────────────────────────────────────────────────
  if (!currentCheck) {
    return (
      <div className={inline ? "bg-gray-50" : "min-h-screen bg-gray-50"}>
        {!inline && (
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center gap-3">
              <button onClick={goBack} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <h1 className="font-bold text-[15px] text-gray-900">🔬 AI Model Research</h1>
              </div>
              <div className="flex items-center gap-2">{toolbarButtons}</div>
            </div>
          </div>
        )}
        <div className={inline ? "px-4 py-6 max-w-5xl" : "container mx-auto px-4 py-6 max-w-5xl"}>
          {debugPanel}

          {/* No active check state */}
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center mb-6">
            <p className="text-4xl mb-3">🔬</p>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No active check loaded</h2>
            <p className="text-sm text-gray-400 mb-1">Please open from the Build Guide to start a new AI verification.</p>
            <p className="text-[11px] text-gray-300">Or use the camera in Build Guide to capture your build, then click "Check with AI Vision".</p>
          </div>

          {/* Still show history even with no active check */}
          {history.length > 0 && (
            <section>
              <h2 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Performance Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <StatCard label="Total Checks" value={apiHistory.length} sub="AI Vision API" color="text-gray-800" isCount />
                <StatCard label="Accuracy" value={stats.apiAcc} sub={`${apiHistory.length} checks`} color="text-blue-600" />
                <StatCard label="Avg Confidence" value={stats.apiConf} sub="AI Vision" color="text-purple-600" />
              </div>
              <HistoryTable history={history} />
            </section>
          )}

          {history.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold text-gray-500 mb-1">No check history yet</p>
              <p className="text-[12px]">Run a check from the Build Guide to see results here.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── CASE A: Active check loaded ────────────────────────────────────────────
  return (
    <div className={inline ? "bg-gray-50" : "min-h-screen bg-gray-50"}>
      {!inline && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <button onClick={goBack} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-[15px] text-gray-900">🔬 AI Model Research</h1>
              <p className="text-[11px] text-gray-500">Step {stepIdx + 1}: {stepTitle}</p>
            </div>
            <div className="flex items-center gap-2">{toolbarButtons}</div>
          </div>
        </div>
      )}

      {inline && (
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <p className="text-[12px] font-bold text-gray-600 flex items-center gap-1.5">
            🔬 AI Model Research <span className="text-gray-400 font-normal">— performance analytics</span>
          </p>
          <div className="flex items-center gap-2">{toolbarButtons}</div>
        </div>
      )}

      <div className={inline ? "px-4 py-3 space-y-4 max-w-5xl" : "container mx-auto px-4 py-6 space-y-6 max-w-5xl"}>
        {debugPanel}

        {/* ── Current Check: side-by-side images ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide">Current Check</h2>
            <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
              Step {stepIdx + 1}: {stepTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wide text-center flex items-center justify-center gap-1">
                📐 3D Reference
              </p>
              <div className="relative rounded-2xl overflow-hidden border-2 border-teal-400 bg-gray-100 shadow-sm" style={{ height: 280 }}>
                {referenceImage ? (
                  <img src={referenceImage} alt="3D reference model" className="w-full h-full object-contain bg-white" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                    <span className="text-3xl">📐</span>
                    <span className="text-[11px]">Generating 3D reference…</span>
                    <span className="text-[10px] text-gray-300">{cumulativePieces.length} parts</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-teal-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                  REFERENCE
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-orange-500 uppercase tracking-wide text-center flex items-center justify-center gap-1">
                📷 Your Build
              </p>
              <div className="relative rounded-2xl overflow-hidden border-2 border-orange-400 shadow-sm" style={{ height: 280 }}>
                <img src={capturedImage} alt="Your captured build" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                  YOUR BUILD
                </div>
              </div>
            </div>
          </div>

          {/* Complexity badge */}
          {cumulativePieces.length > 0 && (
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Step complexity:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                complexity.difficultyLabel === "Low"    ? "bg-green-100 text-green-700" :
                complexity.difficultyLabel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                complexity.difficultyLabel === "High"   ? "bg-orange-100 text-orange-700" :
                "bg-red-100 text-red-700"
              }`}>{complexity.difficultyLabel} ({complexity.score}/100)</span>
              <span className="text-[10px] text-gray-400">{complexity.componentCount} parts · {complexity.uniqueTypes} types</span>
            </div>
          )}

          {/* Validation warnings */}
          {missingItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3">
              <p className="text-[11px] font-bold text-amber-700 mb-1">Cannot run Gemini — missing:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {missingItems.map(item => (
                  <li key={item} className="text-[11px] text-amber-600">{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dual verification panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <ResultPanel result={apiResult} label="☁️ Gemini 1.5 Flash (Lovable Gateway)" accent="blue" loading={loadingApi} error={apiError} />
              {!apiResult && !loadingApi && canRunGemini && (
                <button onClick={runVisionAPI}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Sparkles className="w-4 h-4" /> Run Gemini Check
                </button>
              )}
              {apiResult && !loadingApi && (
                <button onClick={runVisionAPI}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[11px] py-2 rounded-xl transition-colors">
                  ↻ Re-run Gemini
                </button>
              )}
              {researchMode && apiResult && (
                <div className="bg-gray-900 rounded-xl p-3 text-[10px] font-mono text-green-400 space-y-1">
                  <p className="text-gray-500">// Gemini response metadata</p>
                  <p>status: <span className="text-yellow-300">{apiResult.correct ? '"correct"' : '"incorrect"'}</span></p>
                  <p>confidence: <span className="text-cyan-300">{apiResult.confidence.toFixed(3)}</span></p>
                  <p>found: <span className="text-green-300">[{apiResult.found.join(", ")}]</span></p>
                  <p>missing: <span className="text-red-400">[{apiResult.missing.join(", ")}]</span></p>
                  <p>source: <span className="text-purple-300">"google/gemini-1.5-flash"</span></p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <ResultPanel result={tfResult} label={`🤖 TF.js ${detectorMode === "custom" ? "Custom Model" : "COCO-SSD (demo)"}`} accent="orange" loading={loadingTf} />
              {!tfResult && !loadingTf && (
                <button onClick={runTFCheck}
                  disabled={detectorStatus !== "ready" || !capturedImage}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-[12px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                  {detectorStatus === "loading"
                    ? <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Loading TF model…</>
                    : detectorStatus === "unavailable"
                    ? "TF model unavailable"
                    : <><Sparkles className="w-4 h-4" /> Run TF.js Check</>}
                </button>
              )}
              {researchMode && tfResult && (
                <div className="bg-gray-900 rounded-xl p-3 text-[10px] font-mono text-green-400 space-y-1">
                  <p className="text-gray-500">// TF.js inference metadata</p>
                  <p>mode: <span className="text-yellow-300">"{detectorMode}"</span></p>
                  <p>confidence: <span className="text-cyan-300">{tfResult.confidence.toFixed(3)}</span></p>
                  <p>found: <span className="text-green-300">[{tfResult.found.join(", ")}]</span></p>
                  <p>missing: <span className="text-red-400">[{tfResult.missing.join(", ")}]</span></p>
                  <p>source: <span className="text-purple-300">"{tfResult.source}"</span></p>
                </div>
              )}
            </div>
          </div>

          {/* Agreement analysis */}
          {apiResult && tfResult && (() => {
            const allCodes = new Set(cumulativePieces.map(c => c.code));
            let agreed = 0;
            allCodes.forEach(code => {
              if (apiResult.found.includes(code) === tfResult.found.includes(code)) agreed++;
            });
            const pct = allCodes.size > 0 ? Math.round((agreed / allCodes.size) * 100) : 0;
            const disagreedCodes = [...allCodes].filter(code =>
              apiResult.found.includes(code) !== tfResult.found.includes(code)
            );
            return (
              <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mt-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[12px] font-bold text-violet-700">Agreement Analysis — Gemini vs TF.js</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pct >= 80 ? "bg-green-100 text-green-700" : pct >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
                    {pct}% agreement
                  </span>
                </div>
                <div className="w-full bg-violet-200 rounded-full h-2 mb-2">
                  <div className="h-2 rounded-full bg-violet-600 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-violet-600">
                  {agreed}/{allCodes.size} components classified identically.
                  {disagreedCodes.length > 0 && ` Disagreements: ${disagreedCodes.join(", ")}.`}
                </p>
                <p className="text-[10px] text-violet-400 mt-1">
                  Low agreement demonstrates the domain gap between generic object detection (COCO-SSD)
                  and multimodal AI reasoning (Gemini). This is a key thesis finding.
                </p>
              </div>
            );
          })()}
        </section>

        {/* ── Performance summary ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-3 uppercase tracking-wide">Performance Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard label="Total Checks" value={apiHistory.length} sub="AI Vision API" color="text-gray-800" isCount />
            <StatCard label="Accuracy" value={stats.apiAcc} sub={`${apiHistory.length} checks`} color="text-blue-600" />
            <StatCard label="Avg Confidence" value={stats.apiConf} sub="AI Vision" color="text-purple-600" />
          </div>
        </section>

        {/* ── Charts (shown once enough data exists) ── */}
        {apiHistory.length >= 2 && (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <h3 className="text-[12px] font-bold text-gray-700 mb-3">Gemini Confidence Over Checks (last 20)</h3>
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

            {perStepData.length >= 2 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="text-[12px] font-bold text-gray-700 mb-3">Verification Accuracy by Build Step</h3>
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

            {latencyData.some(d => d.count > 0) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="text-[12px] font-bold text-gray-700 mb-1">Response Latency Distribution</h3>
                <p className="text-[10px] text-gray-400 mb-3">End-to-end latency per Gemini API call (Supabase Edge Function → Lovable Gateway)</p>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={latencyData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} label={{ value: "Checks", angle: -90, position: "insideLeft", fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {confDistData.some(d => d.count > 0) && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="text-[12px] font-bold text-gray-700 mb-1">Confidence Score Distribution</h3>
                <p className="text-[10px] text-gray-400 mb-3">Distribution of Gemini confidence scores across all checks</p>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={confDistData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {complexityScatterData.length >= 3 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <h3 className="text-[12px] font-bold text-gray-700 mb-1">Step Complexity vs AI Confidence</h3>
                <p className="text-[10px] text-gray-400 mb-3">
                  Correlation between weighted step complexity and Gemini confidence score. Key thesis metric.
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="complexity" type="number" name="Complexity" domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "Complexity score", position: "insideBottom", offset: -2, fontSize: 10 }} />
                    <YAxis dataKey="confidence" type="number" name="Confidence" domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number, name: string) => [`${v}${name === "confidence" ? "%" : ""}`, name]} />
                    <Scatter data={complexityScatterData} name="Check">
                      {complexityScatterData.map((entry, i) => (
                        <Cell key={i} fill={entry.correct ? "#10b981" : "#ef4444"} opacity={0.75} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Pass</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Fail</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Check history table ── */}
        {history.length > 0 && <HistoryTable history={history} />}

        {/* ── AI Step Check Pipeline ── */}
        <section>
          <h2 className="text-[13px] font-bold text-gray-700 mb-1 uppercase tracking-wide">AI Step Check Pipeline</h2>
          <p className="text-[11px] text-gray-400 mb-4">Step-by-step execution trace — live images and data from the current check.</p>

          <div className="space-y-1.5">
            <PipelineCard num={1} title="Active Build Step" source="chapter.build.steps[stepIdx]" accent="orange">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">📖 {chapterTitle}</span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Step {stepIdx + 1}</span>
                </div>
                <p className="text-[13px] font-semibold text-gray-800">{stepTitle}</p>
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
            </PipelineCard>

            <DownConnector />

            <PipelineCard num={2} title="Generated Procedural 3D Reference" source="renderStepReferenceImage(cumulativeComps, stepLabel)" accent="teal">
              <p className="text-[10px] text-gray-500 mb-2">
                Dynamically rendered from cumulative component list using Gallery-quality Three.js geometry. Changes per step. Not a textbook image.
              </p>
              {referenceImage ? (
                <div className="relative rounded-xl overflow-hidden border border-teal-200 bg-white" style={{ maxHeight: 220 }}>
                  <img src={referenceImage} alt="Generated 3D reference" className="w-full object-contain" style={{ maxHeight: 220 }} />
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
                    PROCEDURAL 3D RENDER
                  </div>
                </div>
              ) : (
                <ImagePlaceholder text="Generating 3D reference from cumulative component list…" icon="📐" />
              )}
            </PipelineCard>

            <DownConnector />

            <PipelineCard num={3} title="Student Real Build Photo" source="sessionStorage · blix_captured_image" accent="orange">
              <p className="text-[10px] text-gray-500 mb-2">Live camera capture from the student's device. JPEG encoded, passed as imageBase64.</p>
              <div className="relative rounded-xl overflow-hidden border border-orange-200" style={{ maxHeight: 220 }}>
                <img src={capturedImage} alt="Student build photo" className="w-full object-cover" style={{ maxHeight: 220 }} />
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">STUDENT PHOTO</div>
              </div>
            </PipelineCard>

            <DownConnector />

            <PipelineCard num={4} title="AI Input Package" source="sent to verify-build-step as JSON body" accent="blue">
              <p className="text-[10px] text-gray-500 mb-3">Both images + cumulative pieces list + step instruction sent as the Gemini prompt payload.</p>
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
                    <img src={capturedImage} alt="photo" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">pieces (cumulative)</p>
                <div className="flex flex-wrap gap-1">
                  {cumulativePieces.map((c, i) => (
                    <span key={i} className="font-mono text-[10px] bg-blue-50 border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded-full">
                      {c.code} ×{c.qty}
                    </span>
                  ))}
                </div>
              </div>
            </PipelineCard>

            <DownConnector />

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

            <PipelineCard num={7} title="AI Verification Result" source="verify_step tool response → { status, confidence, found, missing, feedback, tip }" accent={apiResult ? (apiResult.correct ? "green" : "orange") : "gray"}>
              {loadingApi ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[12px]">Gemini is analysing the build…</span>
                </div>
              ) : apiError ? (
                <div className="space-y-2">
                  <p className="text-[12px] font-bold text-red-600">API Error</p>
                  <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{apiError}</p>
                  <button onClick={runVisionAPI} className="bg-blue-500 text-white text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                    ↻ Retry Gemini
                  </button>
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
                <div className="text-center py-4 text-gray-400">
                  <div className="text-2xl mb-2">⏳</div>
                  <p className="text-[12px]">{canRunGemini ? "Running Gemini check…" : "Waiting for check to start."}</p>
                </div>
              )}
            </PipelineCard>

            <DownConnector />

            <PipelineCard num={8} title="Progress Save & Step Unlock" source="Supabase · chapter_progress table" accent={apiResult?.correct ? "green" : "gray"}>
              {apiResult ? (
                <div className="space-y-2">
                  {[
                    { ok: apiResult.correct, text: "Saved to chapter_progress (Supabase)" },
                    { ok: apiResult.correct, text: `Step ${stepIdx + 2} unlocked` },
                    { ok: apiResult.correct, text: "AR overlay mode available for this step" },
                  ].map(({ ok, text }, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[12px] font-semibold ${ok ? "text-green-700" : "text-gray-400"}`}>
                      <span>{ok ? "✓" : "○"}</span><span>{text}</span>
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

// ── History table extracted to avoid duplication ───────────────────────────────
function HistoryTable({ history }: { history: CheckRecord[] }) {
  return (
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
                      ? <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold">☁️ Gemini</span>
                      : <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-semibold">🤖 TF.js</span>
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
                  <td className="px-3 py-2 text-gray-400">{r.responseMs ? `${r.responseMs}ms` : "—"}</td>
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
  );
}
