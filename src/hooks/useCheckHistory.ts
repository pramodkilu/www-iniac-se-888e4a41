// ─── AI Step Check — Session History & Metrics ────────────────────────────────
//
// Stores every verification attempt in localStorage (max 200 records).
// Schema is curriculum-aware (grade → chapter → step) and thesis-readable.

const STORAGE_KEY = "blix_ai_check_history";

// ── Curriculum helpers ─────────────────────────────────────────────────────────

export function gradeFromChapterId(chapterId: string | number): number {
  const n = typeof chapterId === "string" ? parseInt(chapterId) || 0 : chapterId;
  if (n <= 6)  return 1;
  if (n <= 12) return 2;
  if (n <= 18) return 3;
  if (n <= 24) return 4;
  return 5;
}

export function gradeLabelFromChapterId(chapterId: string | number): string {
  return `Grade ${gradeFromChapterId(chapterId)}`;
}

// ── CheckRecord ────────────────────────────────────────────────────────────────

export interface CheckRecord {
  id: string;
  timestamp: number;

  // ── Curriculum context ───────────────────────────────────────────────────────
  gradeLabel: string;          // "Grade 1" – "Grade 5"
  chapterId: string;           // "1" – "30"
  chapterNumber: number;       // 1 – 30
  chapterTitle: string;
  stepNumber: number;          // 1-based (stepIdx + 1)
  stepIdx: number;             // 0-based (kept for chart compat)
  stepTitle: string;
  sessionId: string;           // from blix_current_check.createdAt — groups attempts in one session
  attemptNumber: number;       // 1-based count of attempts for same chapter+step+method

  // ── Verification method ──────────────────────────────────────────────────────
  method: "api" | "model";     // "api" = Gemini, "model" = TF.js (kept for computeStats compat)
  methodLabel: string;         // "Gemini 1.5 Flash" | "TF.js COCO-SSD (demo)" | "TF.js Custom"
  source: string;              // sub-source ("api" | "demo-model" | "model" | "mock")

  // ── Result ───────────────────────────────────────────────────────────────────
  correct: boolean;
  resultStatus: "pass" | "fail" | "error" | "unavailable";
  confidence: number;          // 0–1
  found: string[];
  missing: string[];
  responseMs?: number;         // end-to-end latency ms

  // ── Step / component context ─────────────────────────────────────────────────
  componentCount: number;      // total qty of cumulative parts
  uniqueComponentTypes: number; // distinct codes in cumulative list
  stepComplexity?: number;     // 0–100 score from stepComplexity.ts
  referenceType: "procedural-3d" | "textbook" | "none";

  // ── Dual-verification fields ─────────────────────────────────────────────────
  geminiStatus?: "correct" | "incorrect" | "needs_review";
  geminiConfidence?: number;
  geminiFound?: string[];
  geminiMissing?: string[];
  geminiMs?: number;

  tfStatus?: "correct" | "incorrect" | "needs_review" | "unavailable";
  tfConfidence?: number;
  tfFound?: string[];
  tfMissing?: string[];
  tfMs?: number;
  tfMode?: "custom" | "demo" | "none";

  agreementScore?: number;

  // ── Legacy aliases (kept so old records still display) ───────────────────────
  cumulativeCount?: number;    // old name for componentCount
  uniqueTypes?: number;        // old name for uniqueComponentTypes
}

// ── Storage helpers ─────────────────────────────────────────────────────────────

export function getCheckHistory(): CheckRecord[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

export function saveCheckRecord(record: Omit<CheckRecord, "id" | "timestamp">): CheckRecord {
  const history = getCheckHistory();
  const entry: CheckRecord = { ...record, id: Date.now().toString(), timestamp: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...history].slice(0, 200)));
  return entry;
}

export function clearCheckHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

// Compute attemptNumber for a new record BEFORE saving (count existing same-context records)
export function computeAttemptNumber(
  history: CheckRecord[],
  chapterId: string,
  stepIdx: number,
  method: "api" | "model"
): number {
  return history.filter(
    r => r.chapterId === chapterId && r.stepIdx === stepIdx && r.method === method
  ).length + 1;
}

// ── Computed stats ─────────────────────────────────────────────────────────────

export function computeStats(history: CheckRecord[]) {
  const api   = history.filter(r => r.method === "api");
  const model = history.filter(r => r.method === "model");

  const acc = (arr: CheckRecord[]) =>
    arr.length ? Math.round((arr.filter(r => r.correct).length / arr.length) * 100) : null;

  const stepKeys = new Set([...api, ...model].map(r => `${r.chapterId}-${r.stepIdx}`));
  let agreed = 0, disputed = 0;
  stepKeys.forEach(key => {
    const a = api.find(r => `${r.chapterId}-${r.stepIdx}` === key);
    const m = model.find(r => `${r.chapterId}-${r.stepIdx}` === key);
    if (a && m) { if (a.correct === m.correct) agreed++; else disputed++; }
  });
  const bothRun = agreed + disputed;

  const avgConf = (arr: CheckRecord[]) =>
    arr.length ? Math.round(arr.reduce((s, r) => s + r.confidence, 0) / arr.length * 100) : null;

  const avgMs = (arr: CheckRecord[]) => {
    const timed = arr.filter(r => r.responseMs != null);
    return timed.length ? Math.round(timed.reduce((s, r) => s + (r.responseMs ?? 0), 0) / timed.length) : null;
  };

  const latencyBuckets = (arr: CheckRecord[]) => {
    const buckets = { "<1s": 0, "1-2s": 0, "2-3s": 0, "3-5s": 0, ">5s": 0 };
    arr.forEach(r => {
      if (!r.responseMs) return;
      const s = r.responseMs / 1000;
      if (s < 1) buckets["<1s"]++;
      else if (s < 2) buckets["1-2s"]++;
      else if (s < 3) buckets["2-3s"]++;
      else if (s < 5) buckets["3-5s"]++;
      else buckets[">5s"]++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  };

  const confidenceBuckets = (arr: CheckRecord[]) => {
    const buckets = { "0-20%": 0, "20-40%": 0, "40-60%": 0, "60-80%": 0, "80-100%": 0 };
    arr.forEach(r => {
      const pct = r.confidence * 100;
      if (pct < 20) buckets["0-20%"]++;
      else if (pct < 40) buckets["20-40%"]++;
      else if (pct < 60) buckets["40-60%"]++;
      else if (pct < 80) buckets["60-80%"]++;
      else buckets["80-100%"]++;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  };

  const complexityVsConfidence = api
    .filter(r => r.stepComplexity != null)
    .map(r => ({
      complexity: r.stepComplexity!,
      confidence: Math.round(r.confidence * 100),
      correct: r.correct,
      step: r.stepIdx + 1,
    }));

  return {
    total: history.length,
    apiAcc: acc(api),       modelAcc: acc(model),
    apiConf: avgConf(api),  modelConf: avgConf(model),
    apiMs: avgMs(api),      modelMs: avgMs(model),
    agreementRate: bothRun ? Math.round((agreed / bothRun) * 100) : null,
    bothRun, api, model,
    latencyBuckets: latencyBuckets(api),
    confidenceBuckets: confidenceBuckets(api),
    complexityVsConfidence,
  };
}

// ── Export utilities ────────────────────────────────────────────────────────────

export function exportHistoryJSON(history: CheckRecord[]): void {
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `blix_ai_checks_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportHistoryCSV(history: CheckRecord[]): void {
  const cols: (keyof CheckRecord)[] = [
    "timestamp", "gradeLabel", "chapterNumber", "chapterTitle",
    "stepNumber", "stepTitle", "sessionId", "attemptNumber",
    "methodLabel", "resultStatus", "correct", "confidence", "responseMs",
    "componentCount", "uniqueComponentTypes", "stepComplexity", "referenceType",
    "geminiStatus", "geminiConfidence", "tfStatus", "tfConfidence",
    "tfMode", "agreementScore",
  ];
  const header = cols.join(",");
  const rows = history.map(r =>
    cols.map(c => {
      const v = r[c];
      if (v === undefined || v === null) return "";
      if (typeof v === "string" && v.includes(",")) return `"${v}"`;
      if (Array.isArray(v)) return `"${v.join("|")}"`;
      return String(v);
    }).join(",")
  );
  const csv  = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `blix_ai_checks_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
