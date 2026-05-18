// ─── Step Complexity Analysis ──────────────────────────────────────────────────
//
// Computes a quantitative complexity score for each build step based on the
// cumulative component list. Used for thesis correlation analysis:
//   step complexity vs AI confidence vs verification success rate.
//
// Complexity dimensions:
//   1. componentCount  — total parts (cumulative)
//   2. uniqueTypes     — distinct component codes
//   3. categoryWeight  — difficulty of identifying each category visually
//   4. score           — weighted aggregate (used as axis in charts)

export interface StepComplexityMetrics {
  componentCount: number;    // total parts in cumulative list (qty summed)
  uniqueTypes: number;       // distinct component codes
  categoryBreakdown: Record<string, number>;  // category → count
  score: number;             // 0–100 weighted complexity score
  difficultyLabel: "Low" | "Medium" | "High" | "Very High";
}

// Visual identification difficulty per category.
// Higher = harder for AI to identify reliably.
const CATEGORY_WEIGHT: Record<string, number> = {
  "gear":             3.0,  // small, similar-looking, teeth details matter
  "ic":               3.0,  // tiny black chips, hard to distinguish
  "sensor":           2.5,  // small PCB modules
  "pcb":              2.5,  // green boards with varying surface detail
  "actuator":         2.0,  // motors vary in size/color
  "active-electronic":2.0,
  "passive-electronic":1.5,
  "connector":        1.5,  // small, often partially hidden
  "marble-stem":      1.5,
  "wheel-tyre":       1.2,
  "mechanical":       1.5,
  "shaft":            1.2,  // thin, easy to miss in photo
  "logic-block":      1.0,  // large coloured blocks, easy
  "structural":       1.0,  // large beams, easy
  "power":            1.0,
  "wiring":           0.8,  // often obscured
  "magnet":           1.0,
  "consumable":       0.5,
  "stationery":       0.5,
  "tool":             0.5,
};

// Maps component codes to their category for complexity calculation.
// Subset of COMPONENT_CATEGORY from useComponentDetector — avoid importing
// that whole module to keep this utility lightweight.
const CODE_TO_CATEGORY: Record<string, string> = {
  P3: "structural", P5: "structural", P7: "structural", P11: "structural",
  "P3+": "structural", PC3: "connector", P7X11: "structural", P21X21: "structural",
  PU5X7: "structural", PU5X13: "structural",
  CT2: "connector", CT3: "connector", CT1X2: "connector", CH2: "connector",
  CL2: "connector", TW1: "connector", TW2: "connector",
  SH60: "shaft", SH100: "shaft", SH170: "shaft",
  G20: "gear", "G20+": "gear", "G20-IDL": "gear", G60: "gear",
  Rack: "gear", "P5-NUT": "structural", "Power Screw": "mechanical",
  Wheel: "wheel-tyre", "W-NT": "wheel-tyre", Pulley: "mechanical",
  Suspension: "mechanical", Steering: "mechanical", Spoiler: "structural",
  MGL: "structural", MGR: "structural",
  "Motor with Battery Box": "actuator", BB: "power", BB3V: "power", BB6V: "power",
  "M-ACC": "actuator", Fan: "actuator",
  "POWER-BLK": "logic-block", "NOT-BLK": "logic-block",
  "LED-BLK": "logic-block", "BUZZER-BLK": "logic-block",
  "MOTOR-BLK": "logic-block", "DIST-BLK": "logic-block",
  "IR-BLK": "logic-block", "SWITCH-BLK": "logic-block",
  Queaky: "active-electronic", "CT-TWR": "wiring",
  "AC-R": "wiring", "AC-B": "wiring",
  ESP32: "ic", SERVO: "actuator", DCMB: "actuator",
  "PCB-7SEG": "pcb", "IR-S": "sensor", LS: "sensor",
  DM: "magnet", BM: "magnet",
  MRS14: "marble-stem", MRB7: "marble-stem", MRH5: "marble-stem",
  MAR: "marble-stem", Balloon: "consumable", RB: "consumable",
  // Logic-block electronics
  PB: "active-electronic", "LED-G": "active-electronic", "LED-R": "active-electronic",
  BZ: "active-electronic", SW: "active-electronic", CAP: "passive-electronic",
  "R-10K": "passive-electronic", "R-20K": "passive-electronic", "R-3K3": "passive-electronic",
  POT: "active-electronic", LDR: "sensor",
};

export function computeStepComplexity(
  comps: { code: string; qty: number }[]
): StepComplexityMetrics {
  if (comps.length === 0) {
    return { componentCount: 0, uniqueTypes: 0, categoryBreakdown: {}, score: 0, difficultyLabel: "Low" };
  }

  const componentCount = comps.reduce((s, c) => s + c.qty, 0);
  const uniqueTypes = comps.length;

  const categoryBreakdown: Record<string, number> = {};
  let weightedSum = 0;

  for (const { code, qty } of comps) {
    const cat = CODE_TO_CATEGORY[code] ?? CODE_TO_CATEGORY[code.toUpperCase()] ?? "structural";
    categoryBreakdown[cat] = (categoryBreakdown[cat] ?? 0) + qty;
    const weight = CATEGORY_WEIGHT[cat] ?? 1.0;
    weightedSum += qty * weight;
  }

  // Normalise to 0-100 using empirical max of ~40 weighted parts
  const raw = Math.min(100, (weightedSum / 40) * 100);
  // Also factor in variety: more unique types → harder to verify
  const varietyBonus = Math.min(20, uniqueTypes * 2);
  const score = Math.min(100, Math.round(raw * 0.8 + varietyBonus));

  const difficultyLabel: StepComplexityMetrics["difficultyLabel"] =
    score < 20 ? "Low" : score < 45 ? "Medium" : score < 70 ? "High" : "Very High";

  return { componentCount, uniqueTypes, categoryBreakdown, score, difficultyLabel };
}

// ─── Batch complexity for all steps up to N ───────────────────────────────────
export function computeAllStepComplexities(
  allSteps: { components: string[] }[]
): StepComplexityMetrics[] {
  const results: StepComplexityMetrics[] = [];
  const running = new Map<string, number>();

  for (const step of allSteps) {
    // Cumulative accumulation
    for (const raw of step.components) {
      const m = raw.match(/^(.+?)\s*[xX×](\d+)$/);
      const code = m ? m[1].trim() : raw.trim();
      const qty  = m ? parseInt(m[2]) : 1;
      running.set(code, (running.get(code) ?? 0) + qty);
    }
    const cumComps = Array.from(running.entries()).map(([code, qty]) => ({ code, qty }));
    results.push(computeStepComplexity(cumComps));
  }
  return results;
}
