import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const messageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000, 'Message too long (max 2000 characters)')
  })).max(20, 'Too many messages (max 20)')
});

interface RecipeDoc {
  id: string;
  title: string;
  description: string | null;
  state: string | null;
  dietary_type: string | null;
  meal_type: string | null;
  tags: string[] | null;
  preparation_time: number;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  ingredients: string[] | null;
  image_url: string | null;
}

function detectIntentFilters(query: string) {
  const q = query.toLowerCase();
  const dietary =
    q.includes('non-veg') || q.includes('non veg') || q.includes('chicken') || q.includes('fish') || q.includes('mutton') || q.includes('meat')
      ? 'non-vegetarian'
      : q.includes('veg') || q.includes('paneer') || q.includes('dal')
        ? 'vegetarian'
        : null;

  const mealType =
    q.includes('breakfast') ? 'breakfast'
      : q.includes('lunch') ? 'lunch'
      : q.includes('dinner') ? 'dinner'
      : q.includes('snack') || q.includes('chaat') ? 'snacks'
      : null;

  const states = ['punjab', 'maharashtra', 'tamil nadu', 'andhra', 'rajasthan', 'west bengal', 'bengal', 'gujarat', 'kashmir', 'goa', 'uttar pradesh'];
  const state = states.find((s) => q.includes(s)) || null;

  return { dietary, mealType, state };
}

function scoreRecipe(recipe: RecipeDoc, query: string, filters: ReturnType<typeof detectIntentFilters>): number {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const haystack = [
    recipe.title,
    recipe.description || '',
    recipe.state || '',
    recipe.dietary_type || '',
    recipe.meal_type || '',
    ...(recipe.tags || []),
    ...(recipe.ingredients || []),
  ].join(' ').toLowerCase();

  let score = 0;
  for (const token of tokens) {
    if (recipe.title.toLowerCase().includes(token)) score += 6;
    if ((recipe.state || '').toLowerCase().includes(token)) score += 5;
    if ((recipe.tags || []).some((tag) => tag.includes(token))) score += 4;
    if (haystack.includes(token)) score += 2;
  }

  if (filters.dietary && recipe.dietary_type === filters.dietary) score += 5;
  if (filters.mealType && recipe.meal_type === filters.mealType) score += 4;
  if (filters.state && (recipe.state || '').toLowerCase().includes(filters.state)) score += 6;

  // Boost high-protein recipes when fitness/gym/protein is requested
  const q = query.toLowerCase();
  if ((q.includes('protein') || q.includes('gym') || q.includes('muscle')) && (recipe.protein || 0) >= 18) {
    score += 5;
  }
  if ((q.includes('low cal') || q.includes('weight loss') || q.includes('fat loss')) && (recipe.calories || 999) <= 350) {
    score += 4;
  }

  return score;
}

async function generateGeminiEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { parts: [{ text }] },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.embedding?.values || null;
  } catch {
    return null;
  }
}

async function retrieveRelevantRecipes(query: string, geminiKey?: string): Promise<RecipeDoc[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const filters = detectIntentFilters(query);

  // 1. Try pgvector semantic search first when Gemini key + embeddings exist
  if (geminiKey) {
    const embedding = await generateGeminiEmbedding(query, geminiKey);
    if (embedding) {
      const { data: vectorMatches, error: rpcError } = await supabase.rpc('match_recipes', {
        query_embedding: embedding,
        match_count: 5,
        filter_dietary: filters.dietary,
        filter_state: filters.state,
      });
      if (!rpcError && Array.isArray(vectorMatches) && vectorMatches.length > 0) {
        return vectorMatches as RecipeDoc[];
      }
    }
  }

  // 2. Hybrid lexical + metadata retrieval over approved recipes in Supabase
  const { data: allApproved, error } = await supabase
    .from('recipes')
    .select('id, title, description, state, dietary_type, meal_type, tags, preparation_time, calories, protein, carbs, fat, ingredients, image_url')
    .eq('status', 'approved')
    .limit(100);

  if (error || !allApproved || allApproved.length === 0) return [];

  const ranked = (allApproved as RecipeDoc[])
    .map((r) => ({ recipe: r, score: scoreRecipe(r, query, filters) }))
    .sort((a, b) => b.score - a.score);

  const top = ranked.filter((item) => item.score > 0).slice(0, 4).map((item) => item.recipe);
  return top.length > 0 ? top : (allApproved as RecipeDoc[]).slice(0, 3);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const validationResult = messageSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input format', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = validationResult.data;
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content || '';
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    // STEP 1 (RETRIEVE): Fetch relevant recipes from Zaika's Supabase database
    const retrievedRecipes = await retrieveRelevantRecipes(lastUserMessage, GEMINI_API_KEY);

    const ragContext = retrievedRecipes.length > 0
      ? retrievedRecipes.map((r, i) => (
          `[${i + 1}] ${r.title} (${r.state || 'Regional'}, ${r.dietary_type || 'vegetarian'}, ${r.meal_type || 'meal'})` +
          ` | ${r.calories ?? '?'} kcal, ${r.protein ?? '?'}g protein, ${r.carbs ?? '?'}g carbs, ${r.fat ?? '?'}g fat` +
          ` | Prep: ${r.preparation_time} min` +
          ` | Tags: ${(r.tags || []).join(', ') || 'none'}` +
          ` | Key Ingredients: ${(r.ingredients || []).slice(0, 6).join(', ')}`
        )).join('\n')
      : 'No matching recipes found in database.';

    // STEP 2 (AUGMENT): Ground system prompt with retrieved recipes
    const systemPrompt = `You are SwadBook AI Dietician — a warm, friendly, conversational culinary nutritionist and fitness dietitian for SwadBook.
You are running inside a Retrieval-Augmented Generation (RAG) pipeline grounded in SwadBook's live Supabase recipe catalog.

RETRIEVED SWADBOOK RECIPES CONTEXT:
${ragContext}

STRICT GUIDELINES:
1. Be natural and conversational! If the user says casual greetings, thanks, or conversational remarks in English or Hinglish (e.g. "hi", "ohhhoooo accha", "sure understood", "thanks"), reply warmly and naturally like a helpful human assistant.
2. When the user asks about any recipe, dish, ingredient, protein/calorie/carb/fat macros, regional Indian food, or diet/gym meal plan, answer accurately using the RETRIEVED SWADBOOK RECIPES CONTEXT above (citing exact dish names, state origin, calories, protein, carbs, fat, and steps/ingredients when asked).
3. ONLY if the user asks a clear off-topic factual question unrelated to food, recipes, cooking, health, fitness, or nutrition (e.g., politics, ministers, coding, movies, general trivia), politely reply: "I'm your SwadBook AI Dietician! I can only help with SwadBook recipes, food, nutrition, and diet/fitness meal plans."
4. Keep responses concise, well-formatted, and helpful.`;

    const sources = retrievedRecipes.map((r) => ({
      id: r.id,
      title: r.title,
      state: r.state,
      dietary_type: r.dietary_type,
      calories: r.calories,
      protein: r.protein,
      preparation_time: r.preparation_time,
    }));

    // STEP 3 (GENERATE): Call Google Gemini API with augmented context (tries newest models first)
    if (GEMINI_API_KEY) {
      const contents = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      for (const model of ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents,
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                  temperature: 0.6,
                  maxOutputTokens: 1000,
                }
              })
            }
          );

          if (response.ok) {
            const geminiData = await response.json();
            const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
              return new Response(
                JSON.stringify({ response: reply, sources, rag_enabled: true, model }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          } else {
            console.error(`Gemini (${model}) status:`, response.status, await response.text());
          }
        } catch (err) {
          console.error(`Gemini (${model}) fetch error:`, err);
        }
      }
    }

    // STEP 3B (RAG FALLBACK): Grounded response using retrieved Supabase recipes even without Gemini key
    let fallbackReply = `Hello! I am your **SwadBook AI Dietician**. 🥗\n\n`;
    if (retrievedRecipes.length > 0) {
      fallbackReply += `### 📌 Top Matching Recipes from SwadBook\n`;
      for (const r of retrievedRecipes) {
        fallbackReply += `- **${r.title}** (${r.state || 'Regional'} · ${r.dietary_type || 'veg'}): **${r.calories ?? '—'} kcal**, **${r.protein ?? '—'}g protein**, ${r.preparation_time} min\n`;
      }
      fallbackReply += `\nTap any recipe card below to view full ingredients and cooking steps!`;
    } else {
      fallbackReply += `I'm here to help you personalize your meals and hit your fitness goals! You can ask me:\n` +
        `• "Suggest a high-protein vegetarian gym diet"\n` +
        `• "What are healthy breakfast ideas under 400 calories?"\n` +
        `• "Recommend a high-protein dish from Punjab"`;
    }

    return new Response(
      JSON.stringify({ response: fallbackReply, sources, rag_enabled: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-dietician RAG function:', error);
    return new Response(
      JSON.stringify({
        response: "Hello! I am your SwadBook AI Dietician. Ask me about high-protein meals, gym diets, calories, and recipe nutrition!",
        sources: [],
        rag_enabled: true
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
