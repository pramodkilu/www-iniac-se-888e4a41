const STORAGE_KEY = "blix_ai_check_history";

export interface CheckRecord {
  id: string;
  timestamp: number;
  chapterId: string;
  chapterTitle: string;
  stepIdx: number;
  stepTitle: string;
  method: "api" | "model";
  correct: boolean;
  confidence: number;
  found: string[];
  missing: string[];
  source: string;
  responseMs?: number;
}

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

// ── Computed stats ──────────────────────────────────────────────────────────
export function computeStats(history: CheckRecord[]) {
  const api   = history.filter(r => r.method === "api");
  const model = history.filter(r => r.method === "model");

  const acc = (arr: CheckRecord[]) =>
    arr.length ? Math.round((arr.filter(r => r.correct).length / arr.length) * 100) : null;

  // Agreement: steps where both methods were run and gave the same verdict
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

  return {
    total: history.length,
    apiAcc: acc(api),       modelAcc: acc(model),
    apiConf: avgConf(api),  modelConf: avgConf(model),
    apiMs: avgMs(api),      modelMs: avgMs(model),
    agreementRate: bothRun ? Math.round((agreed / bothRun) * 100) : null,
    bothRun, api, model,
  };
}
