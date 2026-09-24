-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    mi_credits INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modules Table
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    audio_url TEXT,
    phase TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_modules_phase ON public.modules(phase);
CREATE INDEX IF NOT EXISTS idx_modules_chapter ON public.modules(chapter);

-- Reflections Table
CREATE TABLE public.reflections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
    content_type TEXT,
    content TEXT,
    visibility TEXT DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Corporate Workspaces Table
CREATE TABLE public.corporate_workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    join_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Modules
CREATE POLICY "Modules are viewable by everyone"
    ON public.modules FOR SELECT
    USING (true);

-- RLS Policies for Reflections
CREATE POLICY "Users can view own reflections"
    ON public.reflections FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reflections"
    ON public.reflections FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reflections"
    ON public.reflections FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reflections"
    ON public.reflections FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Corporate Workspaces
CREATE POLICY "Workspaces are viewable by authenticated users"
    ON public.corporate_workspaces FOR SELECT
    TO authenticated
    USING (true);
