-- HarshGuruJi Private Chat System - Supabase Migration

-- 1. Helper function for HGJ-XXXXXX ID generation
CREATE OR REPLACE FUNCTION generate_hgj_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOLEAN;
BEGIN
    done := FALSE;
    WHILE NOT done LOOP
        new_id := 'HGJ-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE hgj_id = new_id) THEN
            done := TRUE;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 2. Add hgj_id to profiles if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'hgj_id'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN hgj_id VARCHAR(20) UNIQUE;
    END IF;
END $$;

-- 3. Backfill existing profiles with hgj_id
UPDATE public.profiles 
SET hgj_id = generate_hgj_id() 
WHERE hgj_id IS NULL;

-- 4. Backfill unique usernames for rows with null/empty username
DO $$
DECLARE
    r RECORD;
    base_user TEXT;
    cand_user TEXT;
    counter INT;
BEGIN
    FOR r IN SELECT id, email FROM public.profiles WHERE username IS NULL OR username = '' LOOP
        base_user := lower(split_part(coalesce(r.email, 'user'), '@', 1));
        cand_user := base_user;
        counter := 1;
        WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = cand_user AND id <> r.id) LOOP
            cand_user := base_user || counter::text;
            counter := counter + 1;
        END LOOP;
        UPDATE public.profiles SET username = cand_user WHERE id = r.id;
    END LOOP;
END $$;

-- 5. Trigger on profiles to auto-set hgj_id and username
CREATE OR REPLACE FUNCTION trigger_set_profile_defaults()
RETURNS TRIGGER AS $$
DECLARE
    base_user TEXT;
    cand_user TEXT;
    counter INT;
BEGIN
    IF NEW.hgj_id IS NULL OR NEW.hgj_id = '' THEN
        NEW.hgj_id := generate_hgj_id();
    END IF;
    IF (NEW.username IS NULL OR NEW.username = '') THEN
        base_user := lower(split_part(coalesce(NEW.email, 'user'), '@', 1));
        cand_user := base_user;
        counter := 1;
        WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = cand_user) LOOP
            cand_user := base_user || counter::text;
            counter := counter + 1;
        END LOOP;
        NEW.username := cand_user;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_set_profile_defaults ON public.profiles;
CREATE TRIGGER tr_set_profile_defaults
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_profile_defaults();

-- 6. Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_one UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    participant_two UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    last_message TEXT,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    last_sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT check_different_participants CHECK (participant_one <> participant_two)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_participants 
ON public.conversations (LEAST(participant_one, participant_two), GREATEST(participant_one, participant_two));

-- 7. Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'seen'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    delivered_at TIMESTAMPTZ,
    seen_at TIMESTAMPTZ,
    deleted_for_sender BOOLEAN DEFAULT FALSE,
    deleted_for_receiver BOOLEAN DEFAULT FALSE,
    deleted_for_everyone BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id, status);

-- 8. User Blocks table
CREATE TABLE IF NOT EXISTS public.user_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_block UNIQUE (blocker_id, blocked_id)
);

-- 9. Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies
-- Profiles: allow reading for search
DO $$
BEGIN
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Conversations RLS
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
    CREATE POLICY "Users can view own conversations" ON public.conversations 
    FOR SELECT USING (auth.uid() = participant_one OR auth.uid() = participant_two);

    DROP POLICY IF EXISTS "Users can create conversations they belong to" ON public.conversations;
    CREATE POLICY "Users can create conversations they belong to" ON public.conversations 
    FOR INSERT WITH CHECK (auth.uid() = participant_one OR auth.uid() = participant_two);

    DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;
    CREATE POLICY "Users can update own conversations" ON public.conversations 
    FOR UPDATE USING (auth.uid() = participant_one OR auth.uid() = participant_two);

    DROP POLICY IF EXISTS "Users can delete own conversations" ON public.conversations;
    CREATE POLICY "Users can delete own conversations" ON public.conversations 
    FOR DELETE USING (auth.uid() = participant_one OR auth.uid() = participant_two);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Messages RLS
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
    CREATE POLICY "Users can view messages in their conversations" ON public.messages 
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

    DROP POLICY IF EXISTS "Users can insert messages as sender" ON public.messages;
    CREATE POLICY "Users can insert messages as sender" ON public.messages 
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

    DROP POLICY IF EXISTS "Users can update their messages" ON public.messages;
    CREATE POLICY "Users can update their messages" ON public.messages 
    FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- User Blocks RLS
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view blocks concerning them" ON public.user_blocks;
    CREATE POLICY "Users can view blocks concerning them" ON public.user_blocks 
    FOR SELECT USING (auth.uid() = blocker_id OR auth.uid() = blocked_id);

    DROP POLICY IF EXISTS "Users can create blocks" ON public.user_blocks;
    CREATE POLICY "Users can create blocks" ON public.user_blocks 
    FOR INSERT WITH CHECK (auth.uid() = blocker_id);

    DROP POLICY IF EXISTS "Users can remove blocks" ON public.user_blocks;
    CREATE POLICY "Users can remove blocks" ON public.user_blocks 
    FOR DELETE USING (auth.uid() = blocker_id);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 11. Add to Realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
