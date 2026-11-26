-- ==============================================================================
-- ZAIKA: TIMED USER BANS & ADMIN GOVERNANCE
-- Adds suspended_until TIMESTAMPTZ to public.profiles for timed bans.
-- ==============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS suspended_until TIMESTAMPTZ DEFAULT NULL;
