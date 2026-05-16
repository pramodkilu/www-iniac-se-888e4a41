-- Core school operations for the INIAC school platform.
-- This migration keeps the first operational slice small:
-- schools -> programs -> batches -> sessions -> students -> enrollments -> attendance.

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent';

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.school_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (school_id, user_id)
);

CREATE TABLE public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'robotics',
  age_range TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  grade_range TEXT,
  schedule TEXT,
  capacity INTEGER NOT NULL DEFAULT 24,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  grade TEXT,
  date_of_birth DATE,
  guardian_name TEXT,
  guardian_email TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, batch_id)
);

CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES public.batches(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  objective TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (session_id, student_id)
);

CREATE OR REPLACE FUNCTION public.is_school_member(_school_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin_or_super(_user_id)
    OR EXISTS (
      SELECT 1
      FROM public.school_memberships
      WHERE school_id = _school_id
        AND user_id = _user_id
    )
$$;

CREATE OR REPLACE FUNCTION public.has_school_role(_school_id uuid, _user_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_admin_or_super(_user_id)
    OR EXISTS (
      SELECT 1
      FROM public.school_memberships
      WHERE school_id = _school_id
        AND user_id = _user_id
        AND role = ANY(_roles)
    )
$$;

CREATE OR REPLACE FUNCTION public.is_teacher_for_batch(_batch_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.batches
    WHERE id = _batch_id
      AND teacher_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_parent_for_student(_student_id uuid, _email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.students
    WHERE id = _student_id
      AND guardian_email IS NOT NULL
      AND lower(guardian_email) = lower(_email)
  )
$$;

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view schools"
  ON public.schools FOR SELECT TO authenticated
  USING (public.is_school_member(id, auth.uid()));

CREATE POLICY "Admins can manage schools"
  ON public.schools FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Users can view own school memberships"
  ON public.school_memberships FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_admin_or_super(auth.uid()));

CREATE POLICY "Admins can manage school memberships"
  ON public.school_memberships FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Authenticated users can view programs"
  ON public.programs FOR SELECT TO authenticated
  USING (public.is_school_member(school_id, auth.uid()));

CREATE POLICY "Admins can manage programs"
  ON public.programs FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Authenticated users can view batches"
  ON public.batches FOR SELECT TO authenticated
  USING (
    public.is_school_member(school_id, auth.uid())
    OR teacher_id = auth.uid()
  );

CREATE POLICY "Admins can manage batches"
  ON public.batches FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Teachers can update their batches"
  ON public.batches FOR UPDATE TO authenticated
  USING (teacher_id = auth.uid() OR is_admin_or_super(auth.uid()));

CREATE POLICY "Authenticated users can view students"
  ON public.students FOR SELECT TO authenticated
  USING (
    public.is_school_member(school_id, auth.uid())
    OR public.is_parent_for_student(id, auth.jwt() ->> 'email')
    OR EXISTS (
      SELECT 1
      FROM public.enrollments e
      JOIN public.batches b ON b.id = e.batch_id
      WHERE e.student_id = students.id
        AND b.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage students"
  ON public.students FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Teachers can view enrollments"
  ON public.enrollments FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.students s
      JOIN public.batches b ON b.id = enrollments.batch_id
      WHERE s.id = enrollments.student_id
        AND (
          public.is_school_member(s.school_id, auth.uid())
          OR b.teacher_id = auth.uid()
          OR public.is_parent_for_student(s.id, auth.jwt() ->> 'email')
        )
    )
  );

CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Authenticated users can view sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.batches b
      WHERE b.id = sessions.batch_id
        AND (
          public.is_school_member(b.school_id, auth.uid())
          OR b.teacher_id = auth.uid()
          OR EXISTS (
            SELECT 1
            FROM public.enrollments e
            JOIN public.students s ON s.id = e.student_id
            WHERE e.batch_id = b.id
              AND public.is_parent_for_student(s.id, auth.jwt() ->> 'email')
          )
        )
    )
  );

CREATE POLICY "Admins can manage sessions"
  ON public.sessions FOR ALL TO authenticated
  USING (is_admin_or_super(auth.uid()))
  WITH CHECK (is_admin_or_super(auth.uid()));

CREATE POLICY "Teachers can manage their sessions"
  ON public.sessions FOR ALL TO authenticated
  USING (teacher_id = auth.uid() OR is_admin_or_super(auth.uid()))
  WITH CHECK (teacher_id = auth.uid() OR is_admin_or_super(auth.uid()));

CREATE POLICY "Authenticated users can view attendance"
  ON public.attendance_records FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.sessions se
      JOIN public.batches b ON b.id = se.batch_id
      WHERE se.id = attendance_records.session_id
        AND (
          public.is_school_member(b.school_id, auth.uid())
          OR b.teacher_id = auth.uid()
          OR public.is_parent_for_student(attendance_records.student_id, auth.jwt() ->> 'email')
        )
    )
  );

CREATE POLICY "Teachers and admins can mark attendance"
  ON public.attendance_records FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'teacher'::app_role) OR is_admin_or_super(auth.uid()))
  WITH CHECK (has_role(auth.uid(), 'teacher'::app_role) OR is_admin_or_super(auth.uid()));

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batches_updated_at
  BEFORE UPDATE ON public.batches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_programs_school ON public.programs(school_id);
CREATE INDEX idx_school_memberships_school ON public.school_memberships(school_id);
CREATE INDEX idx_school_memberships_user ON public.school_memberships(user_id);
CREATE INDEX idx_batches_program ON public.batches(program_id);
CREATE INDEX idx_batches_school ON public.batches(school_id);
CREATE INDEX idx_students_school ON public.students(school_id);
CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_batch ON public.enrollments(batch_id);
CREATE INDEX idx_sessions_batch ON public.sessions(batch_id);
CREATE INDEX idx_attendance_session ON public.attendance_records(session_id);
CREATE INDEX idx_attendance_student ON public.attendance_records(student_id);
