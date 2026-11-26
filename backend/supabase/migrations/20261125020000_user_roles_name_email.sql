-- ==============================================================================
-- MIGRATION: Add short_id, short_user_id, user_name, and user_email to user_roles
-- Makes user_roles easy to read and manage in Supabase Table Editor while keeping
-- UUID primary/foreign keys intact for Supabase Auth & RLS.
-- ==============================================================================

ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS short_id SERIAL,
  ADD COLUMN IF NOT EXISTS short_user_id TEXT GENERATED ALWAYS AS ('USR-' || UPPER(LEFT(user_id::text, 8))) STORED,
  ADD COLUMN IF NOT EXISTS user_name TEXT,
  ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Backfill existing user_roles rows from auth.users and public.profiles
UPDATE public.user_roles ur
SET
  user_name = COALESCE(
    p.name,
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  ),
  user_email = au.email
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE ur.user_id = au.id;

-- Update handle_new_user() to populate user_name and user_email automatically
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

-- Keep user_roles.user_name in sync if profile.name changes
CREATE OR REPLACE FUNCTION public.sync_profile_name_to_user_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_roles
  SET user_name = NEW.name
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_name_updated ON public.profiles;
CREATE TRIGGER on_profile_name_updated
  AFTER UPDATE OF name ON public.profiles
  FOR EACH ROW
  WHEN (OLD.name IS DISTINCT FROM NEW.name)
  EXECUTE FUNCTION public.sync_profile_name_to_user_roles();
