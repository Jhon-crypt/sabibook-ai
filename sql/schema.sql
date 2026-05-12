-- SabiBook AI Database Schema
-- Optimized for Nigerian University Students

-- Enable the pgvector extension for AI search
CREATE EXTENSION IF NOT EXISTS vector;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    matric_number TEXT UNIQUE,
    university TEXT,
    department TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0,
    last_module_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PDFs / Study Materials Table
CREATE TABLE IF NOT EXISTS pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER, -- in bytes
    content_text TEXT, -- Extracted text for RAG
    vector_embedding VECTOR(1536), -- If using pgvector for AI search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'ai')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Study Sessions (History) Table
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Schedules Table
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    task_name TEXT NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
DROP INDEX IF EXISTS idx_courses_user_id;
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);

DROP INDEX IF EXISTS idx_pdfs_course_id;
CREATE INDEX IF NOT EXISTS idx_pdfs_course_id ON pdfs(course_id);

DROP INDEX IF EXISTS idx_messages_user_id;
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

DROP INDEX IF EXISTS idx_study_sessions_user_id;
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);

DROP INDEX IF EXISTS idx_schedules_user_id;
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables (Safe to run multiple times)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- AUTO-SYNC USERS FROM AUTH.USERS TO PUBLIC.USERS
-- This function will run every time a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email, password_hash)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Student'), 
    new.email,
    'managed_by_supabase_auth' -- Password is handled by Supabase Auth
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Users Policies: Users can only see and edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Courses Policies: Users can only manage their own courses
DROP POLICY IF EXISTS "Users can view own courses" ON courses;
CREATE POLICY "Users can view own courses" ON courses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own courses" ON courses;
CREATE POLICY "Users can insert own courses" ON courses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own courses" ON courses;
CREATE POLICY "Users can update own courses" ON courses FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own courses" ON courses;
CREATE POLICY "Users can delete own courses" ON courses FOR DELETE USING (auth.uid() = user_id);

-- PDFs Policies: Users can only manage their own PDFs
DROP POLICY IF EXISTS "Users can view own pdfs" ON pdfs;
CREATE POLICY "Users can view own pdfs" ON pdfs FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pdfs" ON pdfs;
CREATE POLICY "Users can insert own pdfs" ON pdfs FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own pdfs" ON pdfs;
CREATE POLICY "Users can delete own pdfs" ON pdfs FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study Sessions Policies
DROP POLICY IF EXISTS "Users can view own sessions" ON study_sessions;
CREATE POLICY "Users can view own sessions" ON study_sessions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sessions" ON study_sessions;
CREATE POLICY "Users can insert own sessions" ON study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Schedules Policies
DROP POLICY IF EXISTS "Users can view own schedules" ON schedules;
CREATE POLICY "Users can view own schedules" ON schedules FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own schedules" ON schedules;
CREATE POLICY "Users can insert own schedules" ON schedules FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own schedules" ON schedules;
CREATE POLICY "Users can update own schedules" ON schedules FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own schedules" ON schedules;
CREATE POLICY "Users can delete own schedules" ON schedules FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- MANUAL SYNC COMMAND (RUN THIS ONCE)
-- ==========================================
-- Run this in your Supabase SQL Editor to fix 
-- the "RLS Policy Violation" for your current user:

INSERT INTO public.users (id, full_name, email, password_hash)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', 'Student'), email, 'managed_by_auth'
FROM auth.users 
ON CONFLICT (id) DO NOTHING;

-- Course Modules (AI-generated curriculum steps)
CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    quiz_questions JSONB, -- Array of {question, options, correctAnswer}
    is_completed BOOLEAN DEFAULT FALSE,
    quiz_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own modules" ON course_modules;
CREATE POLICY "Users can view own modules" ON course_modules FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own modules" ON course_modules;
CREATE POLICY "Users can update own modules" ON course_modules FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own modules" ON course_modules;
CREATE POLICY "Users can insert own modules" ON course_modules FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);

-- ==========================================
-- STORAGE BUCKET SETUP
-- ==========================================
-- 1. Create the handouts bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('handouts', 'handouts', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies (Allow students to manage their own files)
-- Allow public access to read handouts (optional, for simple viewing)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'handouts');

-- Allow students to upload their own handouts to their own folder
DROP POLICY IF EXISTS "Students can upload handouts" ON storage.objects;
CREATE POLICY "Students can upload handouts" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'handouts' AND 
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Allow students to delete their own handouts
DROP POLICY IF EXISTS "Students can delete own handouts" ON storage.objects;
CREATE POLICY "Students can delete own handouts" ON storage.objects FOR DELETE USING (
  bucket_id = 'handouts' AND 
  (auth.uid())::text = (storage.foldername(name))[1]
);
