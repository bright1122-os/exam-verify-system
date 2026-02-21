-- ==========================================
-- EXAM_VERIFY_SYSTEM DIGITAL LEDGER SCHEMA
-- Target Environment: Supabase PostgreSQL
-- Design: Editorial Warmth / High-Security Checkpoint
-- ==========================================

-- 1. ENABLING ESSENTIAL EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE TABLE: PROFILES (Extends Auth.Users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('student', 'examiner', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CORE TABLE: STUDENTS (Academic & Demographic Vector)
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  matric_number TEXT UNIQUE,
  department TEXT,
  level TEXT,
  faculty TEXT,
  course TEXT,
  photo_url TEXT,
  registration_complete BOOLEAN DEFAULT FALSE,
  payment_verified BOOLEAN DEFAULT FALSE,
  qr_generated BOOLEAN DEFAULT FALSE,
  qr_code_token TEXT UNIQUE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. LOG TABLE: VERIFICATIONS (The Global Ledger Log)
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  examiner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('approved', 'denied')),
  exam_hall TEXT,
  denial_reason TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- Whenever a user signs up via Supabase Auth, mirror info back into 'profiles'
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    COALESCE(new.raw_user_meta_data->>'role', 'student') -- default to student
  )
  ON CONFLICT (id) DO NOTHING;

  -- Keep student table synced immediately if role is student
  IF (COALESCE(new.raw_user_meta_data->>'role', 'student') = 'student') THEN
    INSERT INTO public.students (user_id) VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users ON INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies to avoid 42710 errors
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

DROP POLICY IF EXISTS "Public viewing of student core data." ON public.students;
DROP POLICY IF EXISTS "Students can update own data." ON public.students;

DROP POLICY IF EXISTS "Public viewing of verification logs." ON public.verifications;
DROP POLICY IF EXISTS "Only authenticated examiners can insert verifications." ON public.verifications;

-- Profiles Policy
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Students Policy
CREATE POLICY "Public viewing of student core data."
  ON public.students FOR SELECT
  USING ( true );

CREATE POLICY "Students can update own data."
  ON public.students FOR UPDATE
  USING ( auth.uid() = user_id );

-- Verifications Entry Policy
CREATE POLICY "Public viewing of verification logs."
  ON public.verifications FOR SELECT
  USING ( true );

CREATE POLICY "Only authenticated examiners can insert verifications."
  ON public.verifications FOR INSERT
  WITH CHECK ( auth.uid() = examiner_id );
