// ── Step / chapter asset mapping ─────────────────────────────────────────────
//
// referenceImage: scanned book-page PNGs that already exist in /public.
//   These are chapter-level (one image covers all steps of a chapter).
//   Per-step renders are planned once CAD exports are available.
//
// modelUrl: GLB files for <model-viewer> AR.
//   Files don't exist yet. Add them to /public/models/ then uncomment.
//   Naming convention: /models/chapter{id}-assembled.glb
// ─────────────────────────────────────────────────────────────────────────────

export interface StepAsset {
  chapterId: number;
  stepNumber: number; // 0 = all steps of this chapter
  referenceImage: string | null;
  modelUrl: string | null;
}

// Chapter-level reference images (real scanned pages, files exist in /public)
const CHAPTER_REFERENCE_IMAGES: Record<number, string> = {
  1:  "/chapter_page_3.png",
  2:  "/chapter_page_8.png",
  3:  "/chapter_page_13.png",
  4:  "/chapter_page_15.png",
  5:  "/chapter_page_21.png",
  6:  "/chapter_page_23.png",
  7:  "/chapter_page_29.png",
  8:  "/chapter_page_31.png",
  9:  "/chapter_page_37.png",
  10: "/chapter_page_38.png",
  11: "/chapter_page_41.png",
  12: "/chapter_page_45.png",
  13: "/chapter_page_47.png",
  14: "/chapter_page_49.png",
  15: "/chapter_page_51.png",
  16: "/chapter_page_55.png",
  17: "/chapter_page_58.png",
  18: "/chapter_page_62.png",
  19: "/chapter_page_65.png",
  20: "/chapter_page_66.png",
  21: "/chapter_page_70.png",
  22: "/chapter_page_71.png",
  23: "/chapter_page_72.png",
  24: "/chapter_page_75.png",
  25: "/chapter_page_78.png",
  26: "/chapter_page_79.png",
  27: "/chapter_page_82.png",
  28: "/chapter_page_87.png",
  29: "/chapter_page_91.png",
  30: "/chapter_page_95.png",
};

// GLB model URLs — add files to /public/models/ then uncomment each entry.
// TODO: export from Blender/CAD and drop into public/models/
const CHAPTER_MODEL_URLS: Record<number, string> = {
  // 1:  "/models/chapter1-assembled.glb",
  // 2:  "/models/chapter2-assembled.glb",
  // Add remaining chapters as GLB files become available
};

/**
 * Returns the best available asset for a given chapter + step.
 * Falls back to the chapter-level reference image for all steps.
 * modelUrl is null until GLB files are added to /public/models/.
 */
export function getStepAsset(chapterId: number, stepNumber: number): StepAsset {
  return {
    chapterId,
    stepNumber,
    referenceImage: CHAPTER_REFERENCE_IMAGES[chapterId] ?? null,
    modelUrl: CHAPTER_MODEL_URLS[chapterId] ?? null,
  };
}
