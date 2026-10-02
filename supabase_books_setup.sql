-- ══════════════════════════════════════════════════════════════════════════
-- Supabase Setup Script for NCERT Books Library & Books Studio
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ══════════════════════════════════════════════════════════════════════════

-- 1. Create the ncert_books table
CREATE TABLE IF NOT EXISTS ncert_books (
    id TEXT PRIMARY KEY,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    book_title TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    edition TEXT DEFAULT 'Rationalised 2024-25 Edition',
    language TEXT DEFAULT 'English',
    pdf_url TEXT NOT NULL,
    cover_url TEXT DEFAULT '',
    file_size TEXT DEFAULT 'PDF Document',
    color TEXT DEFAULT '#6366f1',
    downloads INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for high-speed queries on Class, Subject, and Book Title
CREATE INDEX IF NOT EXISTS idx_ncert_books_class ON ncert_books (class);
CREATE INDEX IF NOT EXISTS idx_ncert_books_subject ON ncert_books (subject);
CREATE INDEX IF NOT EXISTS idx_ncert_books_book_title ON ncert_books (book_title);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE ncert_books ENABLE ROW LEVEL SECURITY;

-- 4. Policies for ncert_books:
-- Allow anyone to read books
CREATE POLICY "Allow public read access to ncert_books" ON ncert_books
    FOR SELECT USING (true);

-- Allow authenticated / admin inserts, updates, deletes
CREATE POLICY "Allow insert for ncert_books" ON ncert_books
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for ncert_books" ON ncert_books
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete for ncert_books" ON ncert_books
    FOR DELETE USING (true);

-- 5. Storage Buckets (for PDF files & Cover images)
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('book-files', 'book-files', true) ON CONFLICT DO NOTHING;

-- Storage Policies for book-covers
CREATE POLICY "Public Read Access book-covers" ON storage.objects FOR SELECT USING ( bucket_id = 'book-covers' );
CREATE POLICY "Upload Access book-covers" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'book-covers' );
CREATE POLICY "Update Access book-covers" ON storage.objects FOR UPDATE USING ( bucket_id = 'book-covers' );

-- Storage Policies for book-files
CREATE POLICY "Public Read Access book-files" ON storage.objects FOR SELECT USING ( bucket_id = 'book-files' );
CREATE POLICY "Upload Access book-files" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'book-files' );
CREATE POLICY "Update Access book-files" ON storage.objects FOR UPDATE USING ( bucket_id = 'book-files' );
