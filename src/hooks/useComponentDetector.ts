import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DetectedComponent {
  code: string;
  count: number;
  confidence: number;
  rawLabel?: string;
}
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

// ─── Full Blix Educator Set — 65-class custom model map ───────────────────────
// Covers all 6 boxes: structural, connectors, shafts, gears, wheels,
// logic blocks, electronics, power, marble-stem, magnets, actuators.
// Index order must match the Roboflow export label order.
export const COMPONENT_CLASS_MAP: Record<number, string> = {
  // ── Box 4 & 6: Structural pillars ──────────────────────────────────────────
  0:  "P3",         // 3-hole pillar (short beam)
  1:  "P5",         // 5-hole pillar
  2:  "P7",         // 7-hole pillar
  3:  "P11",        // 11-hole pillar (long beam)
  4:  "P3+",        // pillar-plus with stud top
  5:  "PC3",        // plate connector (3-point)
  6:  "P7X11",      // U-pillar 7×11 holes
  7:  "P21X21",     // large 21×21 base plate
  8:  "PU5X7",      // U-pillar (17 holes)
  9:  "PU5X13",     // U-pillar (29 holes)

  // ── Box 4: Connectors ───────────────────────────────────────────────────────
  10: "CT2",        // tight connector 2-piece
  11: "CT3",        // tight connector 3-piece
  12: "CT1X2",      // tight connector 2-piece coplanar
  13: "CH2",        // hole connector 2-piece
  14: "CL2",        // loose connector 2-piece
  15: "TW1",        // tubular washer 1-hole
  16: "TW2",        // tubular washer 2-hole

  // ── Box 4: Shafts ───────────────────────────────────────────────────────────
  17: "SH60",       // 60 mm shaft
  18: "SH100",      // 100 mm shaft
  19: "SH170",      // 170 mm shaft

  // ── Box 4: Gears & rack ─────────────────────────────────────────────────────
  20: "G20",        // 20-tooth spur gear
  21: "G20+",       // 20-tooth gear-plus (hub)
  22: "G20-IDL",    // 20-tooth idler gear
  23: "G60",        // 60-tooth spur gear
  24: "Rack",       // linear rack gear
  25: "P5-NUT",     // captive-nut beam
  26: "Power Screw",// lead screw

  // ── Box 4: Wheels & mechanical ──────────────────────────────────────────────
  27: "Wheel",      // wheel with tyre
  28: "W-NT",       // wheel without tyre
  29: "Pulley",     // belt-drive pulley
  30: "Suspension", // spring suspension
  31: "Steering",   // steering wheel
  32: "Spoiler",    // decorative spoiler
  33: "MGL",        // mudguard left
  34: "MGR",        // mudguard right

  // ── Box 5: Power & actuators ────────────────────────────────────────────────
  35: "Motor with Battery Box", // Blix motor+gearbox unit
  36: "BB",         // AA battery box
  37: "BB3V",       // 3 V battery box
  38: "BB6V",       // 6 V battery box
  39: "M-ACC",      // standalone DC motor (accessories)
  40: "Fan",        // propeller fan

  // ── Box 1: Logic blocks (colour-coded screenless coding set) ────────────────
  41: "POWER-BLK",  // yellow power block
  42: "NOT-BLK",    // orange NOT block
  43: "LED-BLK",    // red LED block
  44: "BUZZER-BLK", // green buzzer block
  45: "MOTOR-BLK",  // blue motor block
  46: "DIST-BLK",   // purple distance block
  47: "IR-BLK",     // pink IR block
  48: "SWITCH-BLK", // white switch block

  // ── Box 1: Junior Electronics & Queaky ─────────────────────────────────────
  49: "Queaky",     // yellow audio-feedback device
  50: "CT-TWR",     // connecting tower (stackable wiring node)
  51: "AC-R",       // red alligator clips
  52: "AC-B",       // black alligator clips

  // ── Box 3: Boffin / ESP32 electronics ──────────────────────────────────────
  53: "ESP32",      // ESP32 development board
  54: "SERVO",      // servo motor
  55: "DCMB",       // DC motor driver board
  56: "PCB-7SEG",   // 7-segment display PCB
  57: "IR-S",       // IR sensor module
  58: "LS",         // limit switch

  // ── Box 5: Magnets ──────────────────────────────────────────────────────────
  59: "DM",         // donut (ring) magnet
  60: "BM",         // bar magnet

  // ── Box 2: Marble Stem major track parts ────────────────────────────────────
  61: "MRS14",      // straight chute (14-unit)
  62: "MRB7",       // curved chute (7-unit)
  63: "MRH5",       // marble hopper
  64: "MAR",        // glass marble

  // ── Box 1 & 5: Consumables worth detecting ──────────────────────────────────
  65: "Balloon",    // balloon (pneumatics/propulsion)
  66: "RB",         // rubber band
};

// ─── COCO-SSD → Blix component mapping (demo mode) ───────────────────────────
// Maps the 80 MS-COCO classes to the nearest Blix component by shape analogy.
// Unmapped classes are returned with rawLabel so the UI can show them transparently.
const COCO_TO_BLIX: Record<string, string> = {
  // ── Structural / beam shapes ────────────────────────────────────────────────
  "book":         "P7X11",    // flat rectangular — U-pillar silhouette
  "laptop":       "P21X21",   // flat wide plate — base plate
  "remote":       "P5",       // small elongated rectangle — short beam
  "keyboard":     "P11",      // long flat rectangle — long beam

  // ── Connectors ──────────────────────────────────────────────────────────────
  "mouse":        "CT2",      // small rounded body — T-connector
  "cup":          "CT3",      // cylindrical with base — 3-point connector
  "fork":         "CT2",      // multi-prong — connector (duplicate avoided: use mouse)
  "scissors":     "TW1",      // two-arm joint — twist washer
  "knife":        "CL2",      // L-angle shape — L-connector

  // ── Shafts / cylinders ──────────────────────────────────────────────────────
  "bottle":       "SH60",     // narrow cylinder — 60 mm shaft
  "wine glass":   "SH100",    // taller narrow cylinder — 100 mm shaft
  "vase":         "SH170",    // tall cylinder — 170 mm shaft
  "baseball bat": "SH170",    // long cylinder — long shaft

  // ── Gears / wheels / pulleys ────────────────────────────────────────────────
  "clock":        "G60",      // large round disc — big gear
  "frisbee":      "G20",      // small round disc — small gear
  "donut":        "Pulley",   // ring shape — belt-drive pulley
  "pizza":        "G60",      // large flat circle — large gear

  // ── Motors / battery / power ────────────────────────────────────────────────
  "hair drier":   "Motor with Battery Box",
  "toaster":      "Motor with Battery Box",
  "microwave":    "BB6V",     // box with controls — battery box

  // ── Electronics ─────────────────────────────────────────────────────────────
  "tv":           "PCB-7SEG", // flat screen with segments — 7-seg display
  "cell phone":   "ESP32",    // rectangular PCB — development board

  // ── Marble stem ─────────────────────────────────────────────────────────────
  "baseball":     "MAR",      // small sphere — glass marble
  "orange":       "MAR",      // small sphere — marble

  // ── Wheel ───────────────────────────────────────────────────────────────────
  "sports ball":  "Wheel",    // round rubber-like — wheel with tyre

  // ── Magnets ─────────────────────────────────────────────────────────────────
  "cake":         "DM",       // round flat disc — donut magnet analogy

  // ── Flexible / consumables ───────────────────────────────────────────────────
  "tie":          "RB",       // flexible strip — rubber band
  "banana":       "RB",       // curved flexible — rubber band
  "hot dog":      "RB",       // elongated flexible — rubber band

  // ── Balloon ─────────────────────────────────────────────────────────────────
  "balloon":      "Balloon",
  "umbrella":     "Balloon",
};

const CONFIDENCE_THRESHOLD = 0.45;

const CUSTOM_MODEL_URL = (import.meta as any).env?.VITE_COMPONENT_MODEL_URL ?? null;

// ─── Category metadata for each class ────────────────────────────────────────
export const COMPONENT_CATEGORY: Record<string, string> = {
  P3: "structural",    P5: "structural",  P7: "structural",   P11: "structural",
  "P3+": "structural", PC3: "connector",  "P7X11": "structural", "P21X21": "structural",
  "PU5X7": "structural", "PU5X13": "structural",
  CT2: "connector",    CT3: "connector",  CT1X2: "connector", CH2: "connector",
  CL2: "connector",    TW1: "connector",  TW2: "connector",
  SH60: "shaft",       SH100: "shaft",    SH170: "shaft",
  G20: "gear",         "G20+": "gear",    "G20-IDL": "gear",  G60: "gear",
  Rack: "gear",        "P5-NUT": "structural", "Power Screw": "mechanical",
  Wheel: "wheel",      "W-NT": "wheel",   Pulley: "mechanical",
  Suspension: "mechanical", Steering: "mechanical", Spoiler: "structural",
  MGL: "structural",   MGR: "structural",
  "Motor with Battery Box": "actuator", BB: "power", BB3V: "power", BB6V: "power",
  "M-ACC": "actuator", Fan: "actuator",
  "POWER-BLK": "logic-block",  "NOT-BLK": "logic-block",
  "LED-BLK": "logic-block",    "BUZZER-BLK": "logic-block",
  "MOTOR-BLK": "logic-block",  "DIST-BLK": "logic-block",
  "IR-BLK": "logic-block",     "SWITCH-BLK": "logic-block",
  Queaky: "electronic",        "CT-TWR": "wiring",
  "AC-R": "wiring",            "AC-B": "wiring",
  ESP32: "ic",                 SERVO: "actuator",  DCMB: "actuator",
  "PCB-7SEG": "pcb",           "IR-S": "sensor",   LS: "sensor",
  DM: "magnet",                BM: "magnet",
  MRS14: "marble-stem",        MRB7: "marble-stem", MRH5: "marble-stem",
  MAR: "marble-stem",          Balloon: "consumable", RB: "consumable",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useComponentDetector() {
  const customModelRef = useRef<any>(null);
  const cocoModelRef   = useRef<any>(null);
  const [status, setStatus] = useState<DetectorStatus>("idle");
  const [mode,   setMode]   = useState<DetectorMode>("none");

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
      const tf = await import("@tensorflow/tfjs");
      try {
        await import("@tensorflow/tfjs-backend-webgl");
        await tf.setBackend("webgl");
        await tf.ready();
      } catch {
        await import("@tensorflow/tfjs-backend-cpu");
        await tf.setBackend("cpu");
        await tf.ready();
      }
      const cocoSsd = await import("@tensorflow-models/coco-ssd");
      const model = await cocoSsd.load({ base: "mobilenet_v1" });
      if (!cancelled) {
        cocoModelRef.current = model;
        setMode("demo");
        setStatus("ready");
      }
    };

    if (CUSTOM_MODEL_URL) {
      loadCustom().catch(() => {
        if (!cancelled) loadCoco().catch(() => { if (!cancelled) setStatus("unavailable"); });
      });
    } else {
      loadCoco().catch((e) => {
        console.warn("[ComponentDetector] Failed to load COCO-SSD:", e);
        if (!cancelled) setStatus("unavailable");
      });
    }

    return () => { cancelled = true; };
  }, []);

  // ─── detect() ─────────────────────────────────────────────────────────────
  const detect = async (
    source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement
  ): Promise<DetectedComponent[]> => {
    if (status !== "ready") return [];

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

    if (mode === "demo" && cocoModelRef.current) {
      try {
        const predictions = await cocoModelRef.current.detect(source);
        const counts: Record<string, { n: number; conf: number; raw: string }> = {};
        predictions.forEach(({ class: cls, score }: { class: string; score: number }) => {
          if (score < CONFIDENCE_THRESHOLD) return;
          const blixCode = COCO_TO_BLIX[cls] ?? cls;
          const key = blixCode;
          if (!counts[key]) counts[key] = { n: 0, conf: 0, raw: cls };
          counts[key].n++; counts[key].conf += score;
        });
        return Object.entries(counts).map(([code, { n, conf, raw }]) => ({
          code,
          count: n,
          confidence: conf / n,
          rawLabel: raw !== code ? raw : undefined,
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
  const source: VerifyResult["source"] = mode === "custom" ? "model" : "demo-model";

  const blixMapped  = detected.filter(d => !d.rawLabel);
  const rawDetected = detected.filter(d =>  d.rawLabel);

  const found: string[]   = [];
  const missing: string[] = [];

  expected.forEach(({ code, qty }) => {
    const det = blixMapped.find(d => d.code.toLowerCase() === code.toLowerCase());
    if (det && det.count >= qty) {
      found.push(code);
    } else {
      missing.push(`${code}${qty > 1 ? ` ×${qty}` : ""}`);
    }
  });

  const correct = missing.length === 0;
  const avgConf = detected.length
    ? detected.reduce((s, d) => s + d.confidence, 0) / detected.length
    : 0;

  const rawLabels = rawDetected.map(d => d.rawLabel ?? d.code);
  const isDemoNoMatch = mode === "demo" && blixMapped.length === 0;

  let feedback: string;
  let tip: string;

  if (correct) {
    feedback = "All components are in place — great job!";
    tip = "";
  } else if (isDemoNoMatch && rawLabels.length > 0) {
    feedback = `COCO-SSD detected: ${rawLabels.join(", ")} — none map to Blix components.`;
    tip = "The demo model uses everyday-object detection. Train the custom model on Blix parts for accurate results.";
  } else if (isDemoNoMatch) {
    feedback = "COCO-SSD detected nothing above confidence threshold.";
    tip = "Try better lighting, move closer, or place recognisable objects near the build for demo mode.";
  } else if (detected.length === 0) {
    feedback = "No components detected. Try better lighting or a closer shot.";
    tip = "Make sure all components are clearly visible.";
  } else {
    feedback = `Detected ${found.length} of ${expected.length} required components.`;
    tip = missing.length ? `Still need: ${missing.join(", ")}.` : "";
  }

  return { correct, found, missing, feedback, tip, confidence: avgConf, source };
}
