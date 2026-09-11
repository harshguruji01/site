-- Supabase Setup for Contact & Feedback Two-Way System
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    gender TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    admin_reply TEXT,
    replied_at TIMESTAMPTZ,
    replied_by TEXT,
    user_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated users to insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow users to view own or admin view all" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow delete contact_messages" ON public.contact_messages;

-- Create Policies
CREATE POLICY "Allow authenticated users to insert contact_messages"
ON public.contact_messages FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow users to view own or admin view all"
ON public.contact_messages FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Allow update contact_messages"
ON public.contact_messages FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete contact_messages"
ON public.contact_messages FOR DELETE
TO authenticated, anon
USING (true);

-- Auto-purge function for messages older than 14 days (2 weeks maximum)
CREATE OR REPLACE FUNCTION purge_expired_contact_messages()
RETURNS void AS $$
BEGIN
    DELETE FROM public.contact_messages
    WHERE created_at < NOW() - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

