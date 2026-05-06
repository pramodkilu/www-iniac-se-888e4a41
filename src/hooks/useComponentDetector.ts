import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DetectedComponent { code: string; count: number; confidence: number }
export type DetectorStatus = "idle" | "loading" | "ready" | "unavailable";
export type DetectorMode   = "custom" | "demo" | "none";

export interface VerifyResult {
  correct: boolean;
  found: string[];
  missing: string[];
  feedback: string;
  tip: string;
  confidence: number;
  source: "model" | "demo-model" | "api" | "mock";
}

// ─── Custom model class map ────────────────────────────────────────────────────
// Maps YOUR trained Roboflow model class index → Blix component code.
// Update these indices to match the label order in your Roboflow export.
export const COMPONENT_CLASS_MAP: Record<number, string> = {
  0:  "P3",      1:  "P5",     2:  "P7",     3:  "P11",
  4:  "P7X11",   5:  "P21X21", 6:  "CT2",    7:  "CT3",
  8:  "CH2",     9:  "CL2",   10:  "TW1",   11:  "TW2",
  12: "SH60",   13: "SH100",  14: "SH170",
  15: "G20",    16: "G60",    17: "Rack",
  18: "Wheel",  19: "Motor with Battery Box",
  20: "Pulley", 21: "Thread", 22: "Balloon",
};

// ─── COCO-SSD → Blix component mapping (demo mode) ───────────────────────────
// COCO-SSD detects 80 everyday object classes. We map the ones that visually
// resemble Blix components so the demo pipeline produces plausible detections.
// This is replaced entirely when VITE_COMPONENT_MODEL_URL is set.
const COCO_TO_BLIX: Record<string, string> = {
  // Structural / connector shapes
  "book":        "P7X11",   // flat rectangular beams
  "laptop":      "P21X21",  // flat base plate
  "remote":      "P5",      // small beam
  "cell phone":  "P3",      // small beam
  "keyboard":    "P11",     // long beam
  "mouse":       "CT2",     // small connector
  "cup":         "CT3",     // T-connector
  "bottle":      "SH60",    // shaft / cylindrical
  "wine glass":  "SH100",   // longer shaft
  "vase":        "SH170",   // tall shaft
  // Gears / wheels
  "clock":       "G60",     // large round gear
  "frisbee":     "G20",     // small round gear
  "sports ball": "Wheel",   // wheel
  "donut":       "Pulley",  // pulley / ring
  // Motors / power
  "hair drier":  "Motor with Battery Box",
  "toaster":     "Motor with Battery Box",
  // Thread / flexible
  "tie":         "Thread",
  "banana":      "Thread",
  // Connectors
  "scissors":    "TW1",
  "fork":        "CT2",
  "knife":       "CL2",
  // Fun
  "balloon":     "Balloon",
  "umbrella":    "Balloon",
};

const CONFIDENCE_THRESHOLD = 0.45;

// Set in .env — points to your trained Roboflow TF.js model.json
// e.g. https://<project>.supabase.co/storage/v1/object/public/models/blix-v1/model.json
const CUSTOM_MODEL_URL = (import.meta as any).env?.VITE_COMPONENT_MODEL_URL ?? null;

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useComponentDetector() {
  const customModelRef = useRef<any>(null);
  const cocoModelRef   = useRef<any>(null);
  const [status, setStatus]   = useState<DetectorStatus>("idle");
  const [mode,   setMode]     = useState<DetectorMode>("none");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const loadCustom = async () => {
      const tf = await import("@tensorflow/tfjs");
      await import("@tensorflow/tfjs-backend-webgl");
      await tf.setBackend("webgl");
      const model = await tf.loadGraphModel(CUSTOM_MODEL_URL);
      if (!cancelled) {
        customModelRef.current = model;
        setMode("custom");
        setStatus("ready");
      }
    };

    const loadCoco = async () => {
      await import("@tensorflow/tfjs-backend-webgl");
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      const model = await cocoSsd.load({ base: "mobilenet_v2" });
      if (!cancelled) {
        cocoModelRef.current = model;
        setMode("demo");
        setStatus("ready");
      }
    };

    if (CUSTOM_MODEL_URL) {
      loadCustom().catch(() => {
        // Custom model failed → fall back to COCO demo
        if (!cancelled) loadCoco().catch(() => { if (!cancelled) setStatus("unavailable"); });
      });
    } else {
      loadCoco().catch(() => { if (!cancelled) setStatus("unavailable"); });
    }

    return () => { cancelled = true; };
  }, []);

  // ─── detect() ─────────────────────────────────────────────────────────────
  const detect = async (
    source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<DetectedComponent[]> => {
    if (status !== "ready") return [];

    // Custom Roboflow model
    if (mode === "custom" && customModelRef.current) {
      const tf = await import("@tensorflow/tfjs");
      try {
        const tensor = tf.browser
          .fromPixels(source as HTMLImageElement)
          .resizeBilinear([640, 640])
          .expandDims(0)
          .div(255.0);
        const preds = await customModelRef.current.executeAsync(tensor) as any[];
        tensor.dispose();
        const scores:  number[] = Array.from(await preds[1].data());
        const classes: number[] = Array.from(await preds[2].data());
        preds.forEach((t: any) => t.dispose());
        const counts: Record<string, { n: number; conf: number }> = {};
        scores.forEach((s, i) => {
          if (s < CONFIDENCE_THRESHOLD) return;
          const code = COMPONENT_CLASS_MAP[Math.round(classes[i])] ?? "unknown";
          if (!counts[code]) counts[code] = { n: 0, conf: 0 };
          counts[code].n++; counts[code].conf += s;
        });
        return Object.entries(counts).map(([code, { n, conf }]) => ({
          code, count: n, confidence: conf / n,
        }));
      } catch (e) {
        console.warn("[Detector] Custom model inference failed:", e);
        return [];
      }
    }

    // COCO-SSD demo model
    if (mode === "demo" && cocoModelRef.current) {
      try {
        const predictions = await cocoModelRef.current.detect(source);
        const counts: Record<string, { n: number; conf: number }> = {};
        predictions.forEach(({ class: cls, score }: { class: string; score: number }) => {
          if (score < CONFIDENCE_THRESHOLD) return;
          const code = COCO_TO_BLIX[cls];
          if (!code) return;
          if (!counts[code]) counts[code] = { n: 0, conf: 0 };
          counts[code].n++; counts[code].conf += score;
        });
        return Object.entries(counts).map(([code, { n, conf }]) => ({
          code, count: n, confidence: conf / n,
        }));
      } catch (e) {
        console.warn("[Detector] COCO-SSD inference failed:", e);
        return [];
      }
    }

    return [];
  };

  return { status, mode, detect };
}

// ─── Verify detected components against step requirements ─────────────────────
export function verifyComponents(
  detected: DetectedComponent[],
  expected: { code: string; qty: number }[],
  mode: DetectorMode
): VerifyResult {
  const found: string[]   = [];
  const missing: string[] = [];

  expected.forEach(({ code, qty }) => {
    const det = detected.find(d => d.code.toLowerCase() === code.toLowerCase());
    if (det && det.count >= qty) {
      found.push(code);
    } else {
      missing.push(`${code}${qty > 1 ? ` ×${qty}` : ""}`);
    }
  });

  const correct  = missing.length === 0;
  const avgConf  = detected.length
    ? detected.reduce((s, d) => s + d.confidence, 0) / detected.length
    : 0;
  const source: VerifyResult["source"] = mode === "custom" ? "model" : "demo-model";

  return {
    correct,
    found,
    missing,
    feedback: correct
      ? "All components are in place — great job!"
      : detected.length === 0
        ? "I couldn't detect any components. Try better lighting or a closer shot."
        : `I can see ${found.length} of ${expected.length} required components.`,
    tip: missing.length
      ? `Still need: ${missing.join(", ")}. Place them and try again.`
      : "",
    confidence: avgConf,
    source,
  };
}
