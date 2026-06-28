-- CineDNA Phase 4: User accounts schema
-- Run this in the Supabase SQL Editor before deploying Phase 4.

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  dna_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL,
  film_title TEXT NOT NULL,
  film_poster TEXT,
  film_year INTEGER,
  dna_type TEXT,
  why_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.watched_films (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL,
  film_title TEXT NOT NULL,
  film_poster TEXT,
  film_year INTEGER,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

CREATE TABLE IF NOT EXISTS public.favourite_films (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  film_id INTEGER NOT NULL,
  film_title TEXT NOT NULL,
  film_poster TEXT,
  film_year INTEGER,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watched_films ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourite_films ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own recommendations" ON public.recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watched" ON public.watched_films FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favourites" ON public.favourite_films FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
