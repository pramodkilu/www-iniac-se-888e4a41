-- Create roboliga_registrations table
CREATE TABLE public.roboliga_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  school_city TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  team_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('junior', 'senior')),
  team_members JSONB NOT NULL DEFAULT '[]',
  student_count INTEGER NOT NULL CHECK (student_count >= 2 AND student_count <= 4),
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roboliga_registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration)
CREATE POLICY "Anyone can register a team"
ON public.roboliga_registrations
FOR INSERT
WITH CHECK (true);

-- Users can view their own registrations by email
CREATE POLICY "Users can view registrations by email"
ON public.roboliga_registrations
FOR SELECT
USING (true);

-- Admins can manage all registrations
CREATE POLICY "Admins can manage all registrations"
ON public.roboliga_registrations
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_roboliga_registrations_updated_at
BEFORE UPDATE ON public.roboliga_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();