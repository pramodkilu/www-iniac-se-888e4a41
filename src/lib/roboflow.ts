// ── Roboflow inference placeholder ───────────────────────────────────────────
//
// IMPORTANT: Do NOT expose VITE_ROBOFLOW_API_KEY in production builds.
// Move this call to a Supabase Edge Function before going live so the
// key stays server-side.
//
// Usage:
//   const result = await verifyWithRoboflow(imageBase64);
// ─────────────────────────────────────────────────────────────────────────────

export interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoboflowResult {
  predictions: RoboflowPrediction[];
  image: { width: number; height: number };
}

export async function verifyWithRoboflow(imageBase64: string): Promise<RoboflowResult> {
  const apiKey  = import.meta.env.VITE_ROBOFLOW_API_KEY;
  const modelId = import.meta.env.VITE_ROBOFLOW_MODEL_ID;
  const version = import.meta.env.VITE_ROBOFLOW_VERSION;

  if (!apiKey || !modelId || !version) {
    throw new Error(
      "Roboflow environment variables are missing. " +
      "Set VITE_ROBOFLOW_API_KEY, VITE_ROBOFLOW_MODEL_ID, and VITE_ROBOFLOW_VERSION in .env"
    );
  }

  // TODO: connect Roboflow inference endpoint here.
  // Example endpoint (replace with your hosted or Roboflow-hosted URL):
  //
  // const url = `https://detect.roboflow.com/${modelId}/${version}?api_key=${apiKey}`;
  // const res = await fetch(url, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //   body: imageBase64,
  // });
  // return res.json() as Promise<RoboflowResult>;

  throw new Error("Roboflow integration not yet implemented. See src/lib/roboflow.ts.");
}
