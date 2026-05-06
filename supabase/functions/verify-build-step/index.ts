// Verify a BLIX build step from a photo using Lovable AI vision
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Physical descriptions of each Blix component so the AI knows what to look for
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  "P3":    "a short orange/yellow plastic beam with 3 holes",
  "P5":    "an orange/yellow plastic beam with 5 holes",
  "P7":    "an orange/yellow plastic beam with 7 holes",
  "P11":   "a long orange/yellow plastic beam with 11 holes",
  "P7X11": "a U-shaped orange/yellow plastic pillar (shaped like the letter U) with 7×11 holes",
  "P7x11": "a U-shaped orange/yellow plastic pillar (shaped like the letter U) with 7×11 holes",
  "P21X21":"a large flat orange/grey square base plate with a 21×21 grid of holes",
  "CT2":   "a small T-shaped orange connector piece",
  "CT3":   "a T-shaped connector with 3 connection points",
  "CH2":   "a cross/plus-shaped connector piece",
  "CL2":   "an L-shaped right-angle connector",
  "TW1":   "a small round twist/rotation connector",
  "TW2":   "a larger round twist connector",
  "SH60":  "a 60mm silver metal shaft/axle rod",
  "SH100": "a 100mm silver metal shaft/axle rod",
  "SH170": "a 170mm long silver metal shaft/axle rod",
  "G20":   "a small blue plastic gear with 20 teeth",
  "G60":   "a larger yellow plastic gear with 60 teeth",
  "Rack":  "a flat plastic rack gear strip",
  "Wheel": "a black rubber tyre/wheel",
  "Motor with Battery Box": "a motor unit with battery compartment attached",
  "Pulley":"a circular yellow pulley wheel",
  "Thread":"a rubber band or thread/belt",
  "Balloon":"a red balloon",
};

function describeComponents(pieces: string[]): string {
  return pieces.map(p => {
    const match = p.match(/^(.+?)\s*[×x](\d+)$/);
    const code = match ? match[1].trim() : p.trim();
    const qty  = match ? parseInt(match[2]) : 1;
    const desc = COMPONENT_DESCRIPTIONS[code] ?? code;
    return `• ${code} ×${qty} — ${desc}`;
  }).join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, referenceBase64, stepInstruction, stepNumber, pieces, chapterTitle } =
      await req.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const refUrl = referenceBase64
      ? (referenceBase64.startsWith("data:") ? referenceBase64 : `data:image/jpeg;base64,${referenceBase64}`)
      : null;

    const pieceList: string[] = Array.isArray(pieces) && pieces.length ? pieces : [];
    const componentCodes = pieceList.map(p => {
      const m = p.match(/^(.+?)\s*[×x](\d+)$/);
      return m ? m[1].trim() : p.trim();
    });

    const systemPrompt =
      "You are a STEM robotics build guide checker for kids aged 7-14. " +
      "You analyse a photo of a student's physical BLIX robotics build and determine which components are visible. " +
      "Be encouraging and kind. Use the component descriptions to identify each part. " +
      "Call the verify_step tool with your structured answer.";

    const userText = [
      `Chapter: ${chapterTitle ?? "BLIX build"}`,
      `Step ${stepNumber ?? "?"}: ${stepInstruction}`,
      "",
      "Required components for this step:",
      describeComponents(pieceList),
      "",
      refUrl
        ? "The FIRST image is a 3D diagram showing the exact components needed (for reference shape/layout). " +
          "The SECOND image is the student's real build photo. " +
          "Identify which required components you can actually see in the student's photo."
        : "Look at the student's build photo and identify which of the required components listed above are visible.",
      "",
      "For each required component, decide if it is PRESENT (clearly visible) or MISSING.",
      "If the photo is blurry, too dark, or you cannot see the build clearly, use needs_review.",
    ].join("\n");

    const userContent: object[] = [{ type: "text", text: userText }];
    if (refUrl) userContent.push({ type: "image_url", image_url: { url: refUrl } });
    userContent.push({ type: "image_url", image_url: { url: dataUrl } });

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "verify_step",
            description: "Return the verification result with per-component found/missing lists.",
            parameters: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["correct", "incorrect", "needs_review"],
                  description:
                    "correct = all required components visible and correctly placed; " +
                    "incorrect = components clearly missing or wrong; " +
                    "needs_review = photo unclear or partially visible",
                },
                confidence: {
                  type: "number",
                  description: "0 to 1 — how confident you are in this verdict",
                },
                found: {
                  type: "array",
                  items: { type: "string" },
                  description: "Exact component codes (e.g. P7X11, CT2) that are clearly visible in the photo",
                },
                missing: {
                  type: "array",
                  items: { type: "string" },
                  description: "Exact component codes that are NOT visible or insufficient quantity",
                },
                feedback: {
                  type: "string",
                  description: "One or two short encouraging sentences about what you see.",
                },
                tip: {
                  type: "string",
                  description: "If not correct: one concrete friendly tip to fix it. Empty string if correct.",
                },
              },
              required: ["status", "confidence", "found", "missing", "feedback", "tip"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "verify_step" } },
    };

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI verification failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    let result = {
      status: "needs_review",
      confidence: 0.4,
      found: [] as string[],
      missing: componentCodes,
      feedback: "I couldn't clearly analyse the photo. Try again in better light!",
      tip: "Make sure your build is centred and well-lit, then retake the photo.",
    };

    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        result = {
          status: parsed.status ?? result.status,
          confidence: parsed.confidence ?? result.confidence,
          found: Array.isArray(parsed.found) ? parsed.found : [],
          missing: Array.isArray(parsed.missing) ? parsed.missing : componentCodes,
          feedback: parsed.feedback ?? result.feedback,
          tip: parsed.tip ?? result.tip,
        };
      } catch (e) {
        console.error("Failed to parse tool arguments", e);
      }
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("verify-build-step error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
