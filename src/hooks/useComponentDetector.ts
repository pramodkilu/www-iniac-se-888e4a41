import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DetectedComponent { code: string; count: number; confidence: number }
export type DetectorStatus = "idle" | "loading" | "ready" | "unavailable";

export interface VerifyResult {
  correct: boolean;
  found: string[];
  missing: string[];
  feedback: string;
  tip: string;
  confidence: number;
  source: "model" | "api" | "mock";
}

// ─── Component class map ──────────────────────────────────────────────────────
// Maps model output class index → Blix component code.
// Update these indices to match your Roboflow export labels.
export const COMPONENT_CLASS_MAP: Record<number, string> = {
  0:  "P3",      1:  "P5",     2:  "P7",     3:  "P11",
  4:  "P7X11",   5:  "P21X21", 6:  "CT2",    7:  "CT3",
  8:  "CH2",     9:  "CL2",   10:  "TW1",   11:  "TW2",
  12: "SH60",   13: "SH100",  14: "SH170",
  15: "G20",    16: "G60",    17: "Rack",
  18: "Wheel",  19: "Motor with Battery Box",
  20: "Pulley", 21: "Thread", 22: "Balloon",
};

// Set VITE_COMPONENT_MODEL_URL in .env to your trained Roboflow TF.js model URL.
// e.g. https://<project>.supabase.co/storage/v1/object/public/models/blix-detector/model.json
const MODEL_URL = (import.meta as any).env?.VITE_COMPONENT_MODEL_URL ?? null;
const CONFIDENCE_THRESHOLD = 0.5;

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useComponentDetector() {
  const modelRef = useRef<any>(null);
  const [status, setStatus] = useState<DetectorStatus>(MODEL_URL ? "idle" : "unavailable");

  useEffect(() => {
    if (!MODEL_URL) return;
    setStatus("loading");
    import("@tensorflow/tfjs").then(async (tf) => {
      try {
        const model = await tf.loadGraphModel(MODEL_URL);
        modelRef.current = model;
        setStatus("ready");
      } catch (e) {
        console.warn("[ComponentDetector] Model load failed:", e);
        setStatus("unavailable");
      }
    }).catch(() => setStatus("unavailable"));
  }, []);

  // Run inference on a captured image element or canvas
  const detect = async (source: HTMLImageElement | HTMLCanvasElement): Promise<DetectedComponent[]> => {
    if (status !== "ready" || !modelRef.current) return [];
    const tf = await import("@tensorflow/tfjs");
    try {
      const tensor = tf.browser
        .fromPixels(source)
        .resizeBilinear([640, 640])
        .expandDims(0)
        .div(255.0);

      const predictions = await modelRef.current.executeAsync(tensor) as any[];
      tensor.dispose();

      // Roboflow YOLOv8 TF.js export returns [boxes, scores, classes, num_detections]
      // Adjust indices if your model export differs
      const scores: number[]  = Array.from(await predictions[1].data());
      const classes: number[] = Array.from(await predictions[2].data());
      predictions.forEach((t: any) => t.dispose());

      const counts: Record<string, { count: number; totalConf: number }> = {};
      scores.forEach((score, i) => {
        if (score < CONFIDENCE_THRESHOLD) return;
        const code = COMPONENT_CLASS_MAP[Math.round(classes[i])] ?? `unknown_${Math.round(classes[i])}`;
        if (!counts[code]) counts[code] = { count: 0, totalConf: 0 };
        counts[code].count++;
        counts[code].totalConf += score;
      });

      return Object.entries(counts).map(([code, { count, totalConf }]) => ({
        code,
        count,
        confidence: totalConf / count,
      }));
    } catch (e) {
      console.warn("[ComponentDetector] Inference error:", e);
      return [];
    }
  };

  return { status, detect };
}

// ─── Shared verification logic (used by both paths) ───────────────────────────
export function verifyComponents(
  detected: DetectedComponent[],
  expected: { code: string; qty: number }[]
): VerifyResult {
  const found: string[] = [];
  const missing: string[] = [];

  expected.forEach(({ code, qty }) => {
    const det = detected.find(d => d.code.toLowerCase() === code.toLowerCase());
    if (det && det.count >= qty) {
      found.push(code);
    } else {
      missing.push(`${code}${qty > 1 ? ` ×${qty}` : ""}`);
    }
  });

  const correct = missing.length === 0;
  const avgConf = detected.length
    ? detected.reduce((s, d) => s + d.confidence, 0) / detected.length
    : 0.6;

  return {
    correct,
    found,
    missing,
    feedback: correct
      ? "All components are in place — great job!"
      : `I can see ${found.length} of ${expected.length} components.`,
    tip: missing.length
      ? `Still need: ${missing.join(", ")}. Place them and try again.`
      : "",
    confidence: avgConf,
    source: "model",
  };
}
