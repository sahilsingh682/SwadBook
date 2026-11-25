-- ==============================================================================
-- Migration: Support State Cuisine, Dietary Type, Tags (Gym Diet, High Protein, Fiber, etc.)
-- Date: 2026-11-25
-- ==============================================================================

-- 1. Expand meal_type constraint to include 'snacks'
ALTER TABLE public.recipes DROP CONSTRAINT IF EXISTS recipes_meal_type_check;
ALTER TABLE public.recipes ADD CONSTRAINT recipes_meal_type_check 
  CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks') OR meal_type IS NULL);

-- 2. Add dietary_type ('vegetarian' or 'non-vegetarian')
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS dietary_type TEXT DEFAULT 'vegetarian' 
CHECK (dietary_type IN ('vegetarian', 'non-vegetarian'));

-- 3. Add tags for fitness & health categories (high-protein, gym-diet, high-fiber, high-carbs)
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[];

-- 4. Add state column for regional Indian/world cuisine (Punjab, Maharashtra, Tamil Nadu, etc.)
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT NULL;

-- 5. Add short description
ALTER TABLE public.recipes 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT NULL;

-- 6. Add indexes for high-speed filter queries
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_type ON public.recipes (dietary_type);
CREATE INDEX IF NOT EXISTS idx_recipes_state ON public.recipes (state);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON public.recipes (meal_type);
