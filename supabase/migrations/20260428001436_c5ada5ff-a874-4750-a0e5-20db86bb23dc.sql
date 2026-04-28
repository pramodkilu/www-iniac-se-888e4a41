-- Per-user progress within a chapter: AI step verdicts + current step + AR placement
CREATE TABLE public.chapter_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  chapter_id INTEGER NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  step_verdicts JSONB NOT NULL DEFAULT '{}'::jsonb,
  ar_pose JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id)
);

ALTER TABLE public.chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON public.chapter_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.chapter_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.chapter_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
  ON public.chapter_progress FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view all progress"
  ON public.chapter_progress FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Admins can view all progress"
  ON public.chapter_progress FOR SELECT TO authenticated
  USING (is_admin_or_super(auth.uid()));

CREATE TRIGGER trg_chapter_progress_updated_at
  BEFORE UPDATE ON public.chapter_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_chapter_progress_user ON public.chapter_progress(user_id);
CREATE INDEX idx_chapter_progress_chapter ON public.chapter_progress(chapter_id);