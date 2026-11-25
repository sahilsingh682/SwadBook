-- ==============================================================================
-- Migration: Admin User Management (Hold/Suspend & Moderation)
-- Date: 2026-11-25
-- ==============================================================================

-- 1. Add status and suspension_reason columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' 
CHECK (status IN ('active', 'suspended', 'banned'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS suspension_reason TEXT DEFAULT NULL;

-- 2. RLS Policies: Allow admins to manage user profiles
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete any profile" ON public.profiles;
CREATE POLICY "Admins can delete any profile"
  ON public.profiles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
