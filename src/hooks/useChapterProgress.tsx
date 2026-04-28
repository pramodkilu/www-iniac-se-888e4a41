import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface StepVerdict {
  status: "correct" | "incorrect" | "needs_review";
  confidence: number;
  feedback: string;
  tip: string;
  verifiedAt: string;
}

export interface ARPose {
  matrix: number[]; // 16-element column-major matrix from XRHitTestResult pose
  savedAt: string;
}

export interface ChapterProgress {
  current_step: number;
  step_verdicts: Record<string, StepVerdict>;
  ar_pose: ARPose | null;
}

const EMPTY: ChapterProgress = { current_step: 1, step_verdicts: {}, ar_pose: null };

export function useChapterProgress(chapterId: number | undefined) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ChapterProgress>(EMPTY);
  const [loading, setLoading] = useState(true);
  const rowIdRef = useRef<string | null>(null);

  // Load existing progress when user + chapter are known
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || chapterId == null) {
        setProgress(EMPTY);
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from("chapter_progress")
        .select("id, current_step, step_verdicts, ar_pose")
        .eq("user_id", user.id)
        .eq("chapter_id", chapterId)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error("Failed to load chapter progress:", error);
      }
      if (data) {
        rowIdRef.current = data.id;
        setProgress({
          current_step: data.current_step ?? 1,
          step_verdicts: (data.step_verdicts as Record<string, StepVerdict>) ?? {},
          ar_pose: (data.ar_pose as ARPose | null) ?? null,
        });
      } else {
        rowIdRef.current = null;
        setProgress(EMPTY);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, chapterId]);

  const persist = useCallback(
    async (next: ChapterProgress) => {
      if (!user || chapterId == null) return;
      const payload = {
        user_id: user.id,
        chapter_id: chapterId,
        current_step: next.current_step,
        step_verdicts: next.step_verdicts,
        ar_pose: next.ar_pose,
      };
      const { data, error } = await supabase
        .from("chapter_progress")
        .upsert(payload, { onConflict: "user_id,chapter_id" })
        .select("id")
        .single();
      if (error) {
        console.error("Failed to save chapter progress:", error);
        return;
      }
      if (data?.id) rowIdRef.current = data.id;
    },
    [user, chapterId],
  );

  const saveStepVerdict = useCallback(
    async (stepNumber: number, verdict: Omit<StepVerdict, "verifiedAt">) => {
      setProgress((prev) => {
        const nextVerdicts = {
          ...prev.step_verdicts,
          [String(stepNumber)]: { ...verdict, verifiedAt: new Date().toISOString() },
        };
        // Auto-advance current_step to the next step if this one is correct
        const shouldAdvance = verdict.status === "correct" && stepNumber >= prev.current_step;
        const next: ChapterProgress = {
          ...prev,
          step_verdicts: nextVerdicts,
          current_step: shouldAdvance ? stepNumber + 1 : prev.current_step,
        };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const setCurrentStep = useCallback(
    (step: number) => {
      setProgress((prev) => {
        const next = { ...prev, current_step: step };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const saveArPose = useCallback(
    (matrix: number[]) => {
      setProgress((prev) => {
        const next = { ...prev, ar_pose: { matrix, savedAt: new Date().toISOString() } };
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const clearArPose = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, ar_pose: null };
      void persist(next);
      return next;
    });
  }, [persist]);

  return {
    progress,
    loading,
    saveStepVerdict,
    setCurrentStep,
    saveArPose,
    clearArPose,
  };
}
