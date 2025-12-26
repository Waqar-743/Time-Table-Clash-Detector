-- SQL Schema for Supabase

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL, -- Simplified for now, or use auth.uid() if using Supabase Auth
  title TEXT NOT NULL,
  day TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  subject_type TEXT,
  instructor TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own subjects
-- Note: This assumes you use Supabase Auth and link via user_id
-- For now, a simple policy if you aren't using full Auth yet:
CREATE POLICY "Allow public access for demo" ON public.subjects
  FOR ALL USING (true);
