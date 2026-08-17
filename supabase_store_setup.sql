-- Create the store_apps table
CREATE TABLE IF NOT EXISTS store_apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    developer_name TEXT,
    package_name TEXT,
    version TEXT NOT NULL,
    version_code INTEGER DEFAULT 1,
    file_size TEXT,
    whats_new TEXT,
    apk_storage_path TEXT,
    download_url TEXT,
    screenshots TEXT[],
    featured BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'Published',
    published_at TIMESTAMPTZ,
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE store_apps ENABLE ROW LEVEL SECURITY;

-- Allow public read access to Published apps
CREATE POLICY "Public can view published apps" ON store_apps
    FOR SELECT USING (status = 'Published');

-- Allow admins to do everything (Assuming you handle admin auth differently or just open it for now, 
-- but normally you would check auth.uid() or an admin role)
-- For a simple setup if you don't use Supabase Auth for admins yet:
CREATE POLICY "Allow insert for everyone (Temp Admin)" ON store_apps
    FOR INSERT WITH CHECK (true);
    
CREATE POLICY "Allow update for everyone (Temp Admin)" ON store_apps
    FOR UPDATE USING (true);

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('app-logos', 'app-logos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('apk-files', 'apk-files', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('app-screenshots', 'app-screenshots', true) ON CONFLICT DO NOTHING;

-- Storage Policies for app-logos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'app-logos' );
CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'app-logos' );
CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING ( bucket_id = 'app-logos' );

-- Storage Policies for apk-files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'apk-files' );
CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'apk-files' );
CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING ( bucket_id = 'apk-files' );

-- Storage Policies for app-screenshots
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'app-screenshots' );
CREATE POLICY "Upload Access" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'app-screenshots' );
CREATE POLICY "Update Access" ON storage.objects FOR UPDATE USING ( bucket_id = 'app-screenshots' );

-- Create app_downloads table to track logged-in users' downloads
CREATE TABLE IF NOT EXISTS app_downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    app_id UUID REFERENCES store_apps(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public inserts (so frontend can log downloads) and public read (so admin can view)
ALTER TABLE app_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert for downloads" ON app_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select for downloads" ON app_downloads FOR SELECT USING (true);

-- Add approved_at column to contributors table (run in Supabase SQL editor)
ALTER TABLE contributors ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE contributors ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE contributors ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE contributors ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE contributors ADD COLUMN IF NOT EXISTS youtube TEXT;

-- Added missing policies for Admin Dashboard functionality
CREATE POLICY "Allow select all for everyone (Temp Admin)" ON store_apps
    FOR SELECT USING (true);

CREATE POLICY "Allow delete for everyone (Temp Admin)" ON store_apps
    FOR DELETE USING (true);

CREATE POLICY "Delete Access" ON storage.objects
    FOR DELETE USING ( bucket_id = 'apk-files' );
    
CREATE POLICY "Delete Access Logos" ON storage.objects
    FOR DELETE USING ( bucket_id = 'app-logos' );
    
CREATE POLICY "Delete Access Screenshots" ON storage.objects
    FOR DELETE USING ( bucket_id = 'app-screenshots' );
