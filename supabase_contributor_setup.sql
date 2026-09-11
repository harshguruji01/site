-- Contributor and Golden Tick System Schema Migration
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS golden_tick BOOLEAN DEFAULT false;

-- Contributors RLS configuration
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read contributors" ON public.contributors;
DROP POLICY IF EXISTS "Allow authenticated insert contributors" ON public.contributors;
DROP POLICY IF EXISTS "Allow admin all contributors" ON public.contributors;

CREATE POLICY "Allow public read contributors"
ON public.contributors FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow authenticated insert contributors"
ON public.contributors FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admin all contributors"
ON public.contributors FOR ALL
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Profiles update policy for golden_tick management
DROP POLICY IF EXISTS "Allow update profiles" ON public.profiles;

CREATE POLICY "Allow update profiles"
ON public.profiles FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);
