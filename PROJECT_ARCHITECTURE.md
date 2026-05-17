# BLIX STEM Platform — Project Architecture

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite (SWC) |
| Styling | Tailwind CSS v3 + shadcn-ui (Radix primitives) |
| Routing | React Router v6 |
| Server state | TanStack React Query v5 |
| 3D rendering | Three.js (procedural geometry) |
| Backend / DB | Supabase (PostgreSQL + Auth + Edge Functions) |
| Deployment | Lovable (CI/CD → static hosting) |

---

## AI Step Check — Current Implementation

### What it does

Students build physical STEM models step-by-step using Blix component kits.
After assembling a step, they take a photo of their build. The AI Step Check
analyses the photo and reports which required components are visible and which
are missing, giving encouraging feedback and a correction tip.

### Current data flow

```
[Student] takes photo in BuildGuide.tsx (camera capture)
    ↓
Photo encoded as base64 (imageBase64)
    ↓
renderAssemblyReference(chapterId) generates reference image:
  → buildFinalAssembly(chapterId) renders assembled 3D model offscreen
  → 480×340 JPEG via Three.js WebGL renderer (referenceBase64)
    ↓
Both images + step metadata sent to Supabase Edge Function:
  verify-build-step/index.ts
    ↓
Edge function calls Lovable AI Gateway:
  POST https://ai.gateway.lovable.dev/v1/chat/completions
  model: google/gemini-1.5-flash
  tool: verify_step (structured JSON output via function calling)
    ↓
Response parsed → { status, confidence, found[], missing[], feedback, tip }
    ↓
Result displayed in BuildGuide AIStepCheck panel and AIResearch.tsx
```

### Payload sent to the AI model

| Field | Source | Notes |
|---|---|---|
| `imageBase64` | Student camera photo | JPEG, required |
| `referenceBase64` | `renderAssemblyReference()` | Three.js assembled render, optional |
| `stepInstruction` | `step.title.en` from chapters.ts | Plain text |
| `stepNumber` | current step index + 1 | 1-based |
| `pieces` | parsed `step.components` | e.g. `["CT2 ×2", "G20 ×1"]` |
| `chapterTitle` | chapter name | Context for the model |

### AI model used

- **Model:** `google/gemini-1.5-flash`
- **Gateway:** Lovable AI Gateway (`ai.gateway.lovable.dev`)
- **Auth:** `LOVABLE_API_KEY` Supabase project secret
- **Interface:** OpenAI-compatible `/v1/chat/completions` with function calling

> **This is NOT Claude Vision.** Claude is Anthropic's model family.
> Gemini 1.5 Flash is Google's model. Any prior "Claude Vision" labels in the
> codebase or UI were incorrect and have been renamed to "AI Vision (Gemini)".

### Why "Claude Vision" was wrong

The Lovable platform routes AI calls through its own gateway. The model
`google/gemini-1.5-flash` is a Google Gemini model, not an Anthropic Claude
model. Labelling the feature "Claude Vision" in the UI, edge function, and
thesis would be a factual misattribution of the underlying technology.

---

## Current limitations

### 1. Chapter-level reference image (not per-step)

`renderAssemblyReference(chapterId)` renders the **final assembled model**
for the whole chapter. It does not change between steps. This means:

- Step 1 reference = same as Step 8 reference
- The AI cannot compare "is the student at step 3 of 8" — only "does this
  roughly look like the finished build"

### 2. Procedural geometry vs real photo

The reference image is a Three.js procedural geometry render — simple shapes
approximating real Blix components. Gemini is comparing a real-world photo
against a synthetic 3D render. This mismatch reduces classification accuracy,
especially for small components (washers, shafts, gears).

### 3. No per-step ground truth

There are no photographed reference images for individual steps. The scanned
book page images in `/public/chapter_page_*.png` exist at chapter level only.

---

## Thesis-safe explanation

> "The AI Step Check feature uses multimodal AI to verify student builds.
> A photo of the student's physical assembly is sent alongside a 3D-rendered
> reference image of the target build to a cloud AI model
> (Google Gemini 1.5 Flash, accessed via Lovable AI Gateway).
> The model returns a structured JSON verdict — correct / incorrect / needs_review —
> with per-component found/missing lists, a confidence score, and feedback text.
> The backend is a Supabase Edge Function (Deno runtime) using OpenAI-compatible
> function calling for structured output."

---

## Future improvements

| Improvement | Impact |
|---|---|
| Per-step reference renders: export each step's partial assembly state to a PNG | High — enables step-granular comparison |
| Real GLB models in `/public/models/` for AR overlay | High — improves both AR and reference quality |
| Use scanned book page images as reference when available | Medium — real photos are better than synthetic renders |
| Upgrade to `gemini-1.5-pro` or `gemini-2.0-flash` | Medium — better spatial reasoning |
| Fine-tune or few-shot prompt with Blix-specific component photos | High — reduces false negatives for small parts |
| Store per-attempt photos in Supabase Storage for longitudinal analysis | Low — research data collection |

---

## Reference image priority chain (BuildGuide.tsx)

```
1. renderAssemblyReference(chapterId)   ← assembled 3D model render (primary)
2. referenceSnapshot                    ← manual 3D viewer snapshot (if taken)
3. renderStepReferenceImage(comps)      ← Gallery-quality individual component grid
4. buildReferenceImage(comps)           ← 2D canvas text fallback (last resort)
```

---

## Key files

| File | Role |
|---|---|
| `src/components/BuildGuide.tsx` | Step viewer, camera capture, AI check UI |
| `src/pages/AIResearch.tsx` | AI research dashboard, history charts, flowchart |
| `supabase/functions/verify-build-step/index.ts` | Edge function — calls Gemini via Lovable gateway |
| `src/data/stepAssets.ts` | Chapter-level reference image and GLB model URL mapping |
| `src/data/kitComponents.ts` | Full 123-component Blix kit catalogue with codes |
| `src/components/ThreeDGallery.tsx` | Gallery-quality 3D component renders + `renderStepReferenceImage` |
| `src/data/chapters.ts` | All 30 STEM lessons — bilingual content, component lists per step |
