-- Create the contributors table
CREATE TABLE IF NOT EXISTS public.contributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contributors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved contributors
CREATE POLICY "Public profiles are viewable by everyone."
ON public.contributors FOR SELECT
USING (status = 'approved');

-- Policy: Admins can view all contributors
-- Assuming admins are determined by a specific role or metadata in your app. 
-- For now, we will allow authenticated users to view their own application, and admins can view all.
-- Note: Replace this with your actual admin check logic if needed.
CREATE POLICY "Users can view their own application."
ON public.contributors FOR SELECT
TO authenticated
USING ((select auth.uid()) = user_id);

CREATE POLICY "Admins can view all applications."
ON public.contributors FOR SELECT
TO authenticated
USING ( (select auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

-- Policy: Users can insert their own application
CREATE POLICY "Users can insert their own profile."
ON public.contributors FOR INSERT
TO authenticated
WITH CHECK ((select auth.uid()) = user_id);

-- Policy: Users can update their own application if pending
CREATE POLICY "Users can update own profile."
ON public.contributors FOR UPDATE
TO authenticated
USING ((select auth.uid()) = user_id AND status = 'pending')
WITH CHECK ((select auth.uid()) = user_id AND status = 'pending');

-- Policy: Admins can update any application
CREATE POLICY "Admins can update any profile."
ON public.contributors FOR UPDATE
TO authenticated
USING ( (select auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true )
WITH CHECK ( (select auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true );

-- Create the Storage Bucket for contributor assets (avatars)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contributor-assets', 'contributor-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view avatars
CREATE POLICY "Avatar images are publicly accessible."
ON storage.objects FOR SELECT
USING ( bucket_id = 'contributor-assets' );

-- Storage Policy: Authenticated users can upload avatars
CREATE POLICY "Users can upload their own avatar."
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'contributor-assets' AND (select auth.uid()) = owner );

-- Insert the existing static contributors as approved
INSERT INTO public.contributors (name, role, status, avatar_url)
VALUES 
    ('Harsh Patel', 'Owner & Founder of HarshGuruJi', 'approved', 'Contributors/harsh.png'),
    ('Aditya', 'Contributor', 'approved', 'Contributors/aditya.png'),
    ('Gaurav', 'Contributor', 'approved', 'Contributors/gaurav.png'),
    ('Piyush', 'Contributor', 'approved', 'Contributors/piyush.png'),
    ('Pratyush', 'Contributor', 'approved', 'Contributors/pratyush.png'),
    ('Swastik', 'Contributor', 'approved', 'Contributors/swastik.png');
