-- ==============================================================================
-- ZAIKA: RAG (RETRIEVAL-AUGMENTED GENERATION) VECTOR SCHEMA & RPC
-- Enables pgvector semantic search over approved recipes in public.recipes.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS embedding extensions.vector(768);

CREATE INDEX IF NOT EXISTS idx_recipes_embedding
  ON public.recipes
  USING ivfflat (embedding extensions.vector_cosine_ops)
  WITH (lists = 50);

-- Semantic + metadata filtered recipe retrieval RPC for the RAG pipeline
CREATE OR REPLACE FUNCTION public.match_recipes(
  query_embedding extensions.vector(768),
  match_count INT DEFAULT 5,
  filter_dietary TEXT DEFAULT NULL,
  filter_state TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  state TEXT,
  dietary_type TEXT,
  meal_type TEXT,
  tags TEXT[],
  preparation_time INTEGER,
  calories INTEGER,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  ingredients TEXT[],
  image_url TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.title,
    r.description,
    r.state,
    r.dietary_type,
    r.meal_type,
    r.tags,
    r.preparation_time,
    r.calories,
    r.protein,
    r.carbs,
    r.fat,
    r.ingredients,
    r.image_url,
    1 - (r.embedding <=> query_embedding) AS similarity
  FROM public.recipes r
  WHERE r.status = 'approved'
    AND r.embedding IS NOT NULL
    AND (filter_dietary IS NULL OR r.dietary_type = filter_dietary)
    AND (filter_state IS NULL OR r.state ILIKE '%' || filter_state || '%')
  ORDER BY r.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
