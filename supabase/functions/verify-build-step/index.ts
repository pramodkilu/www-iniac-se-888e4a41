// Verify a BLIX build step from a photo using Lovable AI vision
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Physical descriptions of all 123 Blix Educator Set components
// Covers all 6 boxes: structural, connectors, shafts, gears, wheels,
// logic blocks, electronics, power, marble-stem, magnets, actuators.
const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  // ── Box 4 & 6: Structural pillars ──────────────────────────────────────────
  "P3":     "a very short orange/yellow plastic beam with 3 holes along its length",
  "P5":     "an orange/yellow plastic beam with 5 holes along its length",
  "P7":     "an orange/yellow plastic beam with 7 holes along its length",
  "P11":    "a long orange/yellow plastic beam with 11 holes along its length",
  "P3+":    "an orange plastic short pillar with 3 holes and a raised stud on top",
  "PC3":    "a flat orange plate-connector with 3 attachment points",
  "P7X11":  "a U-shaped orange/yellow plastic pillar (letter U shape) with a 7×11 hole grid",
  "P7x11":  "a U-shaped orange/yellow plastic pillar (letter U shape) with a 7×11 hole grid",
  "P21X21": "a large flat orange/grey square base plate with a 21×21 grid of holes (about 20 cm wide)",
  "PU5X7":  "a medium U-shaped orange plastic frame with 17 holes total",
  "PU5X13": "a large U-shaped orange plastic frame with 29 holes total",
  "P5 Nut": "an orange beam with a captive metal nut embedded in one hole",
  "P5-NUT": "an orange beam with a captive metal nut embedded in one hole",
  "P3 Plus":"an orange short pillar with 3 holes and a raised stud top",
  // ── Box 4: Connectors ───────────────────────────────────────────────────────
  "CT2":    "a small orange T-shaped rigid connector joining two beams",
  "CT3":    "an orange rigid connector with 3 attachment points",
  "CT1X2":  "an orange coplanar tight connector joining two pieces in one plane",
  "CT(1x2)":"an orange coplanar tight connector joining two pieces in one plane",
  "CH2":    "an orange cross/plus-shaped connector with a central axle hole",
  "CL2":    "an orange L-shaped right-angle connector between two beams",
  "TW1":    "a small grey/silver round tubular washer with 1 hole — like a tiny ring",
  "TW2":    "a slightly larger grey tubular washer with 2 holes",
  // ── Box 4: Shafts ───────────────────────────────────────────────────────────
  "SH60":   "a silver metal axle shaft rod, 60 mm (about 6 cm) long",
  "SH100":  "a silver metal axle shaft rod, 100 mm (about 10 cm) long",
  "SH170":  "a silver metal axle shaft rod, 170 mm (about 17 cm) long",
  // ── Box 4: Gears & rack ─────────────────────────────────────────────────────
  "G20":    "a small blue plastic spur gear with 20 teeth around its edge",
  "G20+":   "a small blue plastic gear-plus with 20 teeth and a central hub for the motor shaft",
  "G20-IDL":"a small blue plastic idler gear with 20 teeth — free-rotating, no hub",
  "G20 Plus":"a small blue plastic gear-plus with 20 teeth and a central hub",
  "G20 Idler":"a small blue plastic idler gear with 20 teeth",
  "G60":    "a large yellow plastic spur gear with 60 teeth, about 3× the size of G20",
  "Rack":   "a flat orange plastic rack gear strip with teeth along one edge for linear motion",
  "Power Screw": "a plastic lead screw/threaded rod for converting rotation to linear movement",
  // ── Box 4: Wheels & mechanical ──────────────────────────────────────────────
  "Wheel":  "a black rubber tyre on an orange plastic hub/wheel",
  "W-NT":   "an orange plastic wheel hub without a rubber tyre",
  "Wheel w/o tires": "an orange plastic wheel hub without a rubber tyre",
  "Pulley": "a yellow circular pulley wheel for belt/thread drive",
  "Suspension": "an orange spring suspension unit for vehicle shock absorption",
  "Steering": "a small black plastic steering wheel control",
  "Steering wheel": "a small black plastic steering wheel control",
  "Spoiler": "an orange decorative aerodynamic spoiler piece",
  "MGL":    "an orange left-side mudguard / wheel arch piece",
  "MGR":    "an orange right-side mudguard / wheel arch piece",
  "Mudguard Left":  "an orange left-side mudguard / wheel arch piece",
  "Mudguard Right": "an orange right-side mudguard / wheel arch piece",
  // ── Box 5: Power & actuators ────────────────────────────────────────────────
  "Motor with Battery Box": "a grey/black DC motor unit with an orange battery compartment box attached",
  "BB":     "a small rectangular battery holder for AA cells",
  "BB3V":   "a small 3V battery box with a red positive wire and black negative wire",
  "BB6V":   "a 6V battery box, larger than BB3V, also with red and black wires",
  "M-ACC":  "a small cylindrical DC motor with two wire leads",
  "Fan":    "a plastic propeller/fan blade that attaches to a motor shaft",
  // ── Box 1: Logic blocks (colour-coded screenless coding) ────────────────────
  "POWER-BLK":  "a bright yellow rectangular logic block labelled POWER — powers the block chain",
  "NOT-BLK":    "an orange rectangular logic block labelled NOT — inverts the signal",
  "LED-BLK":    "a red rectangular logic block labelled LED — lights up on HIGH",
  "BUZZER-BLK": "a green rectangular logic block labelled BUZZER — makes sound on HIGH",
  "MOTOR-BLK":  "a blue rectangular logic block labelled MOTOR — drives motor on HIGH",
  "DIST-BLK":   "a purple rectangular logic block labelled DISTANCE — proximity sensor",
  "IR-BLK":     "a pink rectangular logic block labelled IR — infrared line sensor",
  "SWITCH-BLK": "a white rectangular logic block labelled SWITCH — manual ON/OFF input",
  // ── Box 1: Junior Electronics & Queaky ─────────────────────────────────────
  "Queaky":  "a small yellow plastic device with two metal ear-tabs — makes noise when ears are connected",
  "Thread":  "a thin conductive rubber thread/wire used with Queaky",
  "CT-TWR":  "a small stackable plastic connecting tower — like a tiny pillar with metal contacts",
  "AC-R":    "a red alligator clip wire for positive circuit connections",
  "AC-B":    "a black alligator clip wire for negative circuit connections",
  "Alligator clips": "alligator clip wires (one red positive, one black negative)",
  "Connecting towers": "small stackable plastic connecting towers with metal contacts",
  // ── Box 1: Passive & active electronics ─────────────────────────────────────
  "LED-G":  "a small green LED (light-emitting diode) with two wire legs",
  "LED-R":  "a small red LED (light-emitting diode) with two wire legs",
  "PB":     "a small momentary push button",
  "BZ":     "a small black cylindrical piezoelectric buzzer",
  "SW":     "a small SPDT slide switch",
  "CAP":    "a small cylindrical capacitor",
  "R-10K":  "a small 10K ohm resistor with colour bands",
  "R-20K":  "a small 20K ohm resistor with colour bands",
  "R-3K3":  "a small 3.3K ohm resistor with colour bands",
  "POT":    "a small blue potentiometer (variable resistor) with a rotating knob",
  "LDR":    "a small light-dependent resistor — looks like a small flat disc with a zigzag pattern",
  // ── Box 3: ICs ──────────────────────────────────────────────────────────────
  "IC555":   "a black DIP-8 integrated circuit chip labelled '555' — timer IC",
  "IC7408":  "a black DIP-14 integrated circuit chip labelled '7408' — AND gate IC",
  "IC7432":  "a black DIP-14 IC chip labelled '7432' — OR gate IC",
  "IC7404":  "a black DIP-14 IC chip labelled '7404' — NOT/inverter IC",
  "IC7400":  "a black DIP-14 IC chip labelled '7400' — NAND gate IC",
  "IC7402":  "a black DIP-14 IC chip labelled '7402' — NOR gate IC",
  "IC7486":  "a black DIP-14 IC chip labelled '7486' — XOR gate IC",
  "IC74151": "a black DIP-16 IC chip labelled '74151' — 8:1 multiplexer",
  "IC74138": "a black DIP-16 IC chip labelled '74138' — 3:8 decoder",
  // ── Box 3: PCBs ─────────────────────────────────────────────────────────────
  "PCB-7SEG": "a green PCB module with a red 7-segment digit display on it",
  "PCB-PER":  "a small green PCB adapter board for peripheral ICs",
  "PCB-SW":   "a small green PCB with a switch mounted on it",
  "PCB-ICH":  "a small green PCB IC holder/carrier for DIP chips",
  // ── Box 3: ESP32 / Boffin boards ────────────────────────────────────────────
  "ESP32":   "a blue/green rectangular ESP32 development board with WiFi antenna and many pins along edges",
  "SERVO":   "a small blue/orange servo motor with a white gear horn on top and 3-wire connector",
  "DCMB":    "a small green H-bridge DC motor driver PCB board",
  "IR-S":    "a small PCB module with two IR emitter/receiver eyes on the front",
  "LS":      "a mechanical limit switch with a small lever arm",
  // ── Box 5: Magnets ──────────────────────────────────────────────────────────
  "DM":      "a silver ring/donut-shaped magnet with a hole in the centre",
  "BM":      "a rectangular silver and red bar magnet with N and S poles marked",
  // ── Box 2: Marble Stem ──────────────────────────────────────────────────────
  "MRS14":   "a straight orange plastic chute/slide section (14 units long) for the marble run",
  "MRB7":    "a curved orange plastic chute section (7 units) for the marble run",
  "MRH5":    "an orange plastic hopper/funnel for collecting marbles",
  "MAR":     "a small glass marble (clear or coloured ball about 1.5 cm diameter)",
  "P3C2":    "an orange angled connector beam used in marble-stem track curves",
  "BCKT":    "a small orange plastic bucket/cup for catching marbles at the end of a run",
  // ── Consumables worth detecting ─────────────────────────────────────────────
  "Balloon": "a red (or coloured) rubber balloon for pneumatics/propulsion experiments",
  "RB":      "a rubber band — a small elastic loop",
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
      model: "google/gemini-1.5-flash",
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
      const errorText = await resp.text();
      console.error("AI gateway error:", resp.status, errorText);
      if (resp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (resp.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Contact your administrator." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Return a structured fallback result rather than an error — so the UI still renders
      return new Response(JSON.stringify({
        status: "needs_review",
        confidence: 0.3,
        found: [],
        missing: componentCodes,
        feedback: `AI model unavailable (${resp.status}). Try again or use the ML model.`,
        tip: "The vision AI gateway returned an error. This may be temporary.",
      }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
    // Return a graceful result rather than a 500 so the frontend can still display something
    return new Response(
      JSON.stringify({
        status: "needs_review",
        confidence: 0.2,
        found: [],
        missing: [],
        feedback: "Could not connect to AI service. Check your internet connection and try again.",
        tip: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
