
-- Create a function to check if user is super_admin or admin
CREATE OR REPLACE FUNCTION public.is_admin_or_super(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin'::app_role, 'super_admin'::app_role)
  )
$$;

-- Super admins can manage all roles
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Teachers can view all student profiles
CREATE POLICY "Teachers can view student profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role));

-- Teachers can view all completed chapters
CREATE POLICY "Teachers can view all completed chapters"
ON public.completed_chapters
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'teacher'::app_role));

-- Admins can view all completed chapters
CREATE POLICY "Admins can view all completed chapters"
ON public.completed_chapters
FOR SELECT
TO authenticated
USING (is_admin_or_super(auth.uid()));
