-- ==============================================================================
-- RECIPE REBEL: CONSOLIDATED DATABASE MIGRATION SCRIPT
-- Project Ref: rxtzrpvaaumxwtulkmgy
-- Consolidated from migrations:
--   1. 20251202093109_d0ef7c58-b597-4e19-acbd-a42ae72e3352.sql
--   2. 20251202093122_3eb98ffb-a51a-4c61-9003-73099a86c7d9.sql
--   3. 20251204052812_b1c8c164-b356-4fcc-ac07-73ef746f76fa.sql
--   4. 20251204060725_add6a8db-8967-426b-9884-e5dc2bffc13b.sql
--   5. 20251205050046_ac2ec95d-325c-426d-9c03-521b9b54e984.sql
--   6. 20251210060643_32c37835-aa84-4657-9379-8a5c26e967ba.sql
--   7. 20251210060713_5091f7a5-ab0c-4f44-8f96-7b7ae904b948.sql
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Custom Enum Types
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.recipe_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. Core Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  suspension_reason TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id SERIAL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  short_user_id TEXT GENERATED ALWAYS AS ('USR-' || UPPER(LEFT(user_id::text, 8))) STORED,
  user_name TEXT,
  user_email TEXT,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  ingredients TEXT[] NOT NULL,
  steps TEXT[] DEFAULT '{}'::TEXT[],
  preparation_time INTEGER NOT NULL,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')) DEFAULT NULL,
  dietary_type TEXT DEFAULT 'vegetarian' CHECK (dietary_type IN ('vegetarian', 'non-vegetarian')),
  tags TEXT[] DEFAULT '{}'::TEXT[],
  state TEXT DEFAULT NULL,
  calories INTEGER DEFAULT NULL,
  protein NUMERIC(6,2) DEFAULT NULL,
  carbs NUMERIC(6,2) DEFAULT NULL,
  fat NUMERIC(6,2) DEFAULT NULL,
  image_url TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status public.recipe_status NOT NULL DEFAULT 'pending',
  average_rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions & Triggers
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name TEXT;
BEGIN
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1),
    NEW.email
  );

  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, display_name)
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_roles (user_id, role, user_name, user_email)
  VALUES (NEW.id, 'user', display_name, NEW.email)
  ON CONFLICT (user_id, role) DO UPDATE
    SET user_name = EXCLUDED.user_name,
        user_email = EXCLUDED.user_email;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update recipe rating average
CREATE OR REPLACE FUNCTION public.update_recipe_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.recipes
  SET average_rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.ratings
    WHERE recipe_id = COALESCE(NEW.recipe_id, OLD.recipe_id)
  )
  WHERE id = COALESCE(NEW.recipe_id, OLD.recipe_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_rating_change ON public.ratings;
CREATE TRIGGER on_rating_change
  AFTER INSERT OR UPDATE OR DELETE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_recipe_rating();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_recipes_updated_at ON public.recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Row Level Security Policies

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- User Roles Policies (Secured: Users view their own roles, admins manage all)
DROP POLICY IF EXISTS "User roles are viewable by everyone" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;
CREATE POLICY "Only admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Recipes Policies
DROP POLICY IF EXISTS "Approved recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Approved recipes are viewable by everyone"
  ON public.recipes FOR SELECT
  USING (status = 'approved' OR auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can create recipes" ON public.recipes;
CREATE POLICY "Users can create recipes"
  ON public.recipes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors and admins can update recipes" ON public.recipes;
CREATE POLICY "Authors and admins can update recipes"
  ON public.recipes FOR UPDATE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authors and admins can delete recipes" ON public.recipes;
CREATE POLICY "Authors and admins can delete recipes"
  ON public.recipes FOR DELETE
  USING (auth.uid() = author_id OR public.has_role(auth.uid(), 'admin'));

-- Comments Policies
DROP POLICY IF EXISTS "Comments on approved recipes are viewable by everyone" ON public.comments;
CREATE POLICY "Comments on approved recipes are viewable by everyone"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipes
      WHERE recipes.id = comments.recipe_id
      AND recipes.status = 'approved'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users and admins can delete comments" ON public.comments;
CREATE POLICY "Users and admins can delete comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Ratings Policies
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.ratings;
CREATE POLICY "Ratings are viewable by everyone"
  ON public.ratings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can rate recipes" ON public.ratings;
CREATE POLICY "Users can rate recipes"
  ON public.ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
CREATE POLICY "Users can update their own ratings"
  ON public.ratings FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;
CREATE POLICY "Users can delete their own ratings"
  ON public.ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites Policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add favorites" ON public.favorites;
CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove favorites" ON public.favorites;
CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Public Ratings View (Security Invoker)
DROP VIEW IF EXISTS public.public_ratings;
CREATE VIEW public.public_ratings 
WITH (security_invoker = true) AS
SELECT 
  id,
  recipe_id,
  rating,
  created_at
FROM public.ratings;

GRANT SELECT ON public.public_ratings TO anon, authenticated;

-- 8. Supabase Storage Configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipe-images',
  'recipe-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies
DROP POLICY IF EXISTS "Recipe images are publicly accessible" ON storage.objects;
CREATE POLICY "Recipe images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'recipe-images');

DROP POLICY IF EXISTS "Authenticated users can upload recipe images" ON storage.objects;
CREATE POLICY "Authenticated users can upload recipe images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own recipe images" ON storage.objects;
CREATE POLICY "Users can update their own recipe images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'recipe-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own recipe images" ON storage.objects;
CREATE POLICY "Users can delete their own recipe images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'recipe-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
