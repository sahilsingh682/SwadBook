import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const messageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000, 'Message too long (max 2000 characters)')
  })).max(20, 'Too many messages (max 20)')
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const validationResult = messageSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid input format', details: validationResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = validationResult.data;
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    const systemPrompt = `You are an expert Dietician and Culinary Nutritionist for Zaika.
Your role is to provide accurate, empowering advice on nutrition, healthy eating, gym diets, macronutrients (protein, carbs, fat, calories), regional Indian cuisines, and recipe substitutions.

STRICT GUIDELINES:
1. ONLY answer questions related to diet, fitness, food nutrition, healthy eating, gym meal planning, and recipes.
2. If the user asks about unrelated topics (coding, politics, general trivia), respond with: "I am your Zaika AI Dietician. Please ask a food, diet, nutrition, or recipe-related question!"
3. When asked for diet plans, provide specific breakdowns: Calories, Protein, Carbs, Fats, and suggest authentic regional meals (e.g. Dal Makhani, Sambar, Idli, Paneer Tikka, Sprouts, Grilled Chicken).
4. Be enthusiastic, clear, supportive, and practical.`;

    // -------------------------------------------------------------
    // OPTION 1: Direct Google Gemini API (if GEMINI_API_KEY is set)
    // -------------------------------------------------------------
    if (GEMINI_API_KEY) {
      try {
        const contents = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                temperature: 0.7,
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
              JSON.stringify({ response: reply }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } else {
          console.error('Google Gemini API returned status:', response.status, await response.text());
        }
      } catch (err) {
        console.error('Gemini API fetch error:', err);
      }
    }

    // -------------------------------------------------------------
    // OPTION 2: Built-in Intelligent Fallback Nutrition Engine
    // (Ensures the chatbot always works reliably without 500 errors)
    // -------------------------------------------------------------
    const lower = lastUserMessage.toLowerCase();
    let fallbackReply = `Hello! I am your **Zaika AI Dietician**. 🥗\n\n`;

    if (lower.includes('protein') || lower.includes('gym') || lower.includes('muscle')) {
      fallbackReply += `### 💪 High-Protein / Gym Diet Recommendations:\n` +
        `- **Vegetarian**: Paneer Tikka (18g protein / 100g), Soya Chunks (52g protein / 100g), Greek Yogurt with Nuts, Dal Makhani, Moong Dal Sprout Salad.\n` +
        `- **Non-Vegetarian**: Tandoori Chicken Breast (31g protein / 100g), Amritsari Fish Fry (24g protein / 100g), Egg White Bhurji.\n` +
        `**Pro-Tip**: Aim for 1.6g to 2.2g of protein per kg of bodyweight if you are lifting weights!`;
    } else if (lower.includes('weight loss') || lower.includes('fat loss') || lower.includes('diet plan')) {
      fallbackReply += `### 🎯 Balanced Weight Loss Strategy:\n` +
        `1. **Breakfast**: Steamed Idli Sambar or Moong Dal Chilla with Mint Chutney (~250 kcal).\n` +
        `2. **Lunch**: 2 Multigrain Rotis + 1 bowl Tadka Dal + 1 bowl Seasonal Sabzi + Cucumber Salad (~450 kcal).\n` +
        `3. **Snack**: Roasted Makhana or Boiled Chana Chaat with Lemon (~150 kcal).\n` +
        `4. **Dinner**: Grilled Paneer/Chicken Salad or Light Vegetable Khichdi (~350 kcal).\n` +
        `*Maintain a modest 300-500 calorie deficit for sustainable results!*`;
    } else if (lower.includes('fiber') || lower.includes('digestion')) {
      fallbackReply += `### 🌾 High-Fiber Food Suggestions:\n` +
        `- **Legumes & Lentils**: Rajma, Chole, Kala Chana, Green Moong.\n` +
        `- **Whole Grains**: Makki Roti, Bajra, Oats, Brown Basmati Rice.\n` +
        `- **Veggies**: Sarson Ka Saag, Bhindi (Okra), Palak (Spinach), and Carrots.\n` +
        `Aim for 25-30g of dietary fiber daily for optimal gut health and steady energy!`;
    } else {
      fallbackReply += `I'm here to help you personalize your meals and hit your fitness goals! You can ask me:\n` +
        `• "Suggest a high-protein vegetarian gym diet"\n` +
        `• "What are healthy breakfast ideas under 400 calories?"\n` +
        `• "How much protein is in Paneer Tikka vs Chicken Tikka?"\n` +
        `• "Give me a 1500 calorie Indian meal plan"`;
    }

    return new Response(
      JSON.stringify({ response: fallbackReply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-dietician function:', error);
    return new Response(
      JSON.stringify({ 
        response: "Hello! I am your Zaika AI Dietician. Ask me about high-protein meals, gym diets, calories, and recipe nutrition!" 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
