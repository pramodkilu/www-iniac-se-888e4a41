// Verify a BLIX build step from a photo using Lovable AI vision
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, stepInstruction, stepNumber, pieces, chapterTitle } =
      await req.json();

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!stepInstruction || typeof stepInstruction !== "string") {
      return new Response(
        JSON.stringify({ error: "stepInstruction is required" }),
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

    // Normalize to data URL
    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const systemPrompt =
      "You are a friendly STEM teacher checking if a child correctly completed a physical BLIX robotics build step. " +
      "You look at a photo of their current build and decide if this specific step matches the instruction. " +
      "Be encouraging, concise, and kid-friendly (ages 7-14). Never scold. " +
      "Call the verify_step tool with your answer.";

    const userText =
      `Chapter: ${chapterTitle ?? "BLIX build"}\n` +
      `Step ${stepNumber ?? "?"}: ${stepInstruction}\n` +
      (Array.isArray(pieces) && pieces.length
        ? `Expected pieces in this step: ${pieces.join(", ")}\n`
        : "") +
      `Check if the child's photo shows this step done correctly. ` +
      `If unsure, lean toward "needs_review" rather than failing them.`;

    const body = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: userText },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "verify_step",
            description: "Return the verification verdict for this build step.",
            parameters: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["correct", "incorrect", "needs_review"],
                  description:
                    "correct = matches the step; incorrect = clearly wrong; needs_review = unclear photo or partial",
                },
                confidence: {
                  type: "number",
                  description: "0 to 1 confidence in the verdict",
                },
                feedback: {
                  type: "string",
                  description:
                    "One or two short, kid-friendly sentences explaining what you see.",
                },
                tip: {
                  type: "string",
                  description:
                    "If not correct, a concrete, friendly tip on how to fix it. Empty string if correct.",
                },
              },
              required: ["status", "confidence", "feedback", "tip"],
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
          JSON.stringify({ error: "AI credits exhausted. Please add credits in Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI verification failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let result = {
      status: "needs_review",
      confidence: 0.4,
      feedback: "I couldn't clearly analyze the photo. Try again in better light!",
      tip: "Make sure your build is centered and well-lit.",
    };
    if (toolCall?.function?.arguments) {
      try {
        result = JSON.parse(toolCall.function.arguments);
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
