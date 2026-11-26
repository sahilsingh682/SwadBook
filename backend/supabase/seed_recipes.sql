-- ==============================================================================
-- RECIPE REBEL: SCHEMA ALIGNMENT & COMPLETE SEED DATA (22 REGIONAL DISHES)
-- Run this in Supabase Dashboard -> SQL Editor to align tables and seed recipes.
-- ==============================================================================

-- 1. Ensure recipes table structure matches dataset & filters
ALTER TABLE public.recipes
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS dietary_type TEXT DEFAULT 'vegetarian',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS meal_type TEXT,
  ADD COLUMN IF NOT EXISTS calories INTEGER,
  ADD COLUMN IF NOT EXISTS protein NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS carbs NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS fat NUMERIC(6,2),
  ADD COLUMN IF NOT EXISTS steps TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0;

-- Update meal_type & dietary_type constraints safely
ALTER TABLE public.recipes DROP CONSTRAINT IF EXISTS recipes_meal_type_check;
ALTER TABLE public.recipes ADD CONSTRAINT recipes_meal_type_check
  CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks'));

ALTER TABLE public.recipes DROP CONSTRAINT IF EXISTS recipes_dietary_type_check;
ALTER TABLE public.recipes ADD CONSTRAINT recipes_dietary_type_check
  CHECK (dietary_type IN ('vegetarian', 'non-vegetarian'));

CREATE INDEX IF NOT EXISTS idx_recipes_dietary_type ON public.recipes(dietary_type);
CREATE INDEX IF NOT EXISTS idx_recipes_state ON public.recipes(state);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON public.recipes(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING GIN(tags);

-- Ensure profiles governance columns exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- 2. Create Master Chef system account & seed all 22 curated recipes
DO $$
DECLARE
  master_chef_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    master_chef_id,
    'masterchef@reciperebel.com',
    '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012',
    now(),
    '{"name": "Master Chef Rebel"}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (id, name, status)
  VALUES (master_chef_id, 'Master Chef Rebel', 'active')
  ON CONFLICT (id) DO UPDATE SET name = 'Master Chef Rebel';

  INSERT INTO public.user_roles (user_id, role, user_name, user_email)
  VALUES (master_chef_id, 'admin', 'Master Chef Rebel', 'masterchef@reciperebel.com')
  ON CONFLICT (user_id, role) DO UPDATE
    SET user_name = EXCLUDED.user_name,
        user_email = EXCLUDED.user_email;

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000001',
    'Amritsari Butter Chicken (Murgh Makhani)',
    'Tender chicken morsels roasted in tandoor and simmered in a luscious, velvety tomato-butter gravy scented with kasuri methi.',
    'Punjab',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    45,
    480,
    38,
    14,
    28,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-punjab-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['750g Boneless Chicken Breast/Thighs', '1 cup Fresh Tomato Puree', '3 tbsp Butter & 2 tbsp Heavy Cream', '1 cup Greek Yogurt (Marinade)', '2 tbsp Kasuri Methi (Fenugreek)', '1 tbsp Kashmiri Red Chilli & Garam Masala', '2 tbsp Ginger-Garlic Paste']::TEXT[],
    ARRAY['Marinate chicken in yogurt, red chilli, ginger-garlic paste and salt for 1 hour.', 'Sear marinated chicken in a pan or oven at 200°C for 15 minutes until charred.', 'In a heavy bottom pan, melt butter, add pureed tomatoes, mild spices, and simmer for 15 minutes.', 'Add cooked chicken and fresh cream, garnish with toasted kasuri methi and serve warm with naan.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000002',
    'Classic Dal Makhani',
    'Slow-simmered black lentils and kidney beans slow cooked overnight with butter, cream, and aromatic North Indian spices.',
    'Punjab',
    'vegetarian',
    'dinner',
    ARRAY['high-fiber', 'high-protein']::TEXT[],
    60,
    340,
    16,
    42,
    14,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-punjab-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['1 cup Whole Black Urad Dal', '1/4 cup Rajma (Kidney Beans)', '2 tbsp Butter & 2 tbsp Fresh Cream', '1 cup Tomato Puree', '1 tsp Cumin Seeds, Ginger, and Garam Masala']::TEXT[],
    ARRAY['Soak urad dal and rajma overnight. Pressure cook with salt and water for 6-8 whistles until soft.', 'Heat butter in a pan, add cumin, ginger-garlic, and tomato puree. Cook until butter separates.', 'Pour in cooked dal, mash lightly with a ladle, and simmer on low flame for 45 minutes.', 'Finish with fresh cream, butter, and a pinch of fenugreek leaves.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000003',
    'Peshawari Chole Bhature',
    'Spicy and tangy chickpea curry infused with tea liquor and dry spices, paired with puffy golden bhaturas.',
    'Punjab',
    'vegetarian',
    'lunch',
    ARRAY['high-carbs', 'high-fiber']::TEXT[],
    40,
    520,
    15,
    76,
    18,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-punjab-3.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 cups Kabuli Chana (Chickpeas)', '1 Tea Bag (for authentic dark color)', '2 tbsp Chole Masala & Anardana Powder', '2 cups Flour & 2 tbsp Yogurt (for Bhature)', 'Onion, Tomatoes, Green Chillies']::TEXT[],
    ARRAY['Boil soaked chickpeas with a tea bag, bay leaf, and cinnamon until meltingly tender.', 'Saute finely chopped onions, ginger, and tomato paste with chole masala and anardana powder.', 'Add cooked chickpeas and simmer for 20 minutes until a rich dark sauce forms.', 'Roll dough into oval discs and deep fry in hot oil until they puff up golden.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000004',
    'Tandoori Paneer Tikka',
    'High-protein cubes of fresh cottage cheese, bell peppers, and onions tossed in a smoky spiced mustard oil and yogurt marinade.',
    'Punjab',
    'vegetarian',
    'snacks',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    30,
    280,
    24,
    10,
    16,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-punjab-4.jpg',
    master_chef_id,
    'approved',
    ARRAY['350g Firm Paneer (Cottage Cheese)', '1 Green & 1 Red Bell Pepper, diced', '1 Red Onion, cubed', '1/2 cup Hung Curd (Greek Yogurt)', '1 tbsp Smoked Mustard Oil', '1 tbsp Chaat Masala & Ajwain (Carom Seeds)']::TEXT[],
    ARRAY['Mix hung curd, roasted gram flour, mustard oil, ajwain, red chilli, and garam masala.', 'Coat paneer cubes, peppers, and onions gently in the marinade; chill for 30 minutes.', 'Thread onto skewers and roast on a hot grill or air-fryer at 200°C for 10-12 minutes.', 'Sprinkle chaat masala and fresh lemon juice before serving.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000005',
    'Mumbai Iconic Vada Pav',
    'The definitive heart of Mumbai street food — spiced mashed potato ball coated in crispy chickpea batter inside buttered pav with spicy garlic chutney.',
    'Maharashtra',
    'vegetarian',
    'snacks',
    ARRAY['high-carbs']::TEXT[],
    25,
    290,
    8,
    44,
    10,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-maha-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['4 Boiled Potatoes, mashed', '1 cup Besan (Chickpea Flour)', 'Mustard Seeds, Curry Leaves, Green Chillies', 'Dry Red Garlic Chutney & Green Mint Chutney', '4 Fresh Ladi Pav']::TEXT[],
    ARRAY['Temper mustard seeds, curry leaves, ginger, and turmeric; mix thoroughly into mashed potatoes.', 'Shape into spheres and dip in seasoned chickpea flour batter.', 'Deep fry in hot oil until light golden and crispy.', 'Slice pav, slather with spicy red garlic chutney, insert hot vada, and serve with fried chillies.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000006',
    'Kolhapuri Chicken Sukka',
    'Fiery Maharashtrian chicken pan-roast packed with toasted coconut, stone flower, and freshly ground Kolhapuri lavangi masala.',
    'Maharashtra',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    40,
    380,
    36,
    8,
    22,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-maha-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['600g Tender Bone-in Chicken', '1/2 cup Dry Roasted Coconut (Khobro)', '2 tbsp Kolhapuri Kanda-Lasun Masala', '2 Finely sliced Onions', 'Fresh Coriander, Ginger, and Garlic']::TEXT[],
    ARRAY['Marinate chicken in turmeric, ginger-garlic paste and sea salt for 20 minutes.', 'Dry roast coconut, coriander seeds, cloves, and black pepper; blend into a coarse paste.', 'Brown sliced onions in oil, add chicken, and sear on high heat for 6 minutes.', 'Add roasted coconut paste, cover and cook in its own juices until thick and dry.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000007',
    'Spicy Kolhapuri Misal Pav',
    'High-protein sprouted moth bean curry simmered with fiery ''kat'' gravy, garnished with farsan, chopped onions, and lemon.',
    'Maharashtra',
    'vegetarian',
    'breakfast',
    ARRAY['high-protein', 'high-fiber', 'gym-diet']::TEXT[],
    30,
    340,
    15,
    48,
    10,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-maha-3.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 cups Sprouted Matki (Moth Beans)', '1 cup Farsan (Crispy Savory Mix)', '2 tbsp Misal Masala & Red Chilli Powder', 'Onion, Coconut, and Ginger-Garlic Paste', 'Warm Pav bread & Lemon wedges']::TEXT[],
    ARRAY['Boil sprouted moth beans with turmeric and salt until tender.', 'Cook spiced onion-coconut paste in oil until oil surfaces (forming the spicy rassa/kat).', 'Assemble: layer cooked sprouts in a bowl, ladle fiery hot kat on top, and crown with crunchy farsan and diced onions.', 'Serve piping hot with fresh soft pav.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000008',
    'Mumbai Style Pav Bhaji',
    'Rich buttery blend of spiced mashed seasonal vegetables cooked on a huge flat iron griddle, served with toasted butter pav.',
    'Maharashtra',
    'vegetarian',
    'dinner',
    ARRAY['high-carbs', 'high-fiber']::TEXT[],
    35,
    380,
    9,
    58,
    14,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-maha-4.jpg',
    master_chef_id,
    'approved',
    ARRAY['3 Potatoes, 1/2 Cauliflower, 1/2 cup Green Peas, boiled', '2 Bell Peppers & 3 Tomatoes, finely diced', '3 tbsp Pav Bhaji Masala', '4 tbsp Salted Amul Butter', 'Fresh Pav, chopped coriander, and onions']::TEXT[],
    ARRAY['Boil potatoes, cauliflower, and green peas; mash thoroughly with a potato masher.', 'Melt butter on a pan, saute diced onions, bell peppers, tomatoes, and pav bhaji masala.', 'Combine the mashed veggies, add a dash of water and extra butter, and simmer for 15 minutes.', 'Serve with hot butter-griddled pav and fresh lemon wedges.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000009',
    'Crispy Mysore Masala Dosa',
    'Crispy fermented rice and lentil crepe smeared with spicy red garlic chutney and stuffed with seasoned potato masala.',
    'Tamil Nadu',
    'vegetarian',
    'breakfast',
    ARRAY['high-carbs', 'high-fiber']::TEXT[],
    30,
    310,
    8,
    52,
    8,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-south-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 cups Fermented Dosa Batter', '2 Boiled Potatoes, tempered with mustard and curry leaves', '2 tbsp Spicy Mysore Red Chutney', 'Ghee or Sesame Oil for roasting', 'Fresh Coconut Chutney & Piping Hot Sambar']::TEXT[],
    ARRAY['Pour a ladle of batter onto a hot cast-iron tawa and spread outward into a thin circle.', 'Drizzle ghee around the edges; spread a spoonful of red spicy chutney over the surface.', 'Place spiced potato filling in the center, fold when the bottom turns golden-crisp.', 'Serve immediately with fresh coconut chutney and vegetable sambar.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000010',
    'Chettinad Pepper Chicken',
    'Legendary Chettinad style chicken pan-roast loaded with freshly crushed black peppercorns, curry leaves, and fennel.',
    'Tamil Nadu',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    35,
    390,
    35,
    9,
    23,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-south-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['600g Chicken, cut into bite-sized pieces', '2 tbsp Freshly crushed Black Peppercorns', '1 tbsp Fennel Seeds & Cumin Seeds', 'Generous handful of fresh Curry Leaves', 'Small Shallots (Sambar Onions) & Garlic']::TEXT[],
    ARRAY['Dry roast black pepper, fennel, and cumin; grind into a coarse aromatic masala.', 'Saute shallots and curry leaves in sesame oil until caramelized.', 'Add chicken and ground pepper masala, cook on high flame for 5 minutes.', 'Lower heat, cover and simmer until chicken is tender and coated in black pepper glaze.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000011',
    'Steamed Soft Idli with Vegetable Sambar',
    'Pillowy, fermented steamed cakes of rice and urad dal served with protein-rich lentil vegetable sambar. The quintessential healthy Indian breakfast.',
    'Tamil Nadu',
    'vegetarian',
    'breakfast',
    ARRAY['gym-diet', 'high-fiber']::TEXT[],
    20,
    210,
    10,
    40,
    2,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-south-3.jpg',
    master_chef_id,
    'approved',
    ARRAY['3 cups Idli Rice & 1 cup Urad Dal (fermented batter)', '1 cup Toor Dal (for Sambar)', 'Drumstick, Carrots, Shallots, and Pumpkin', '2 tbsp Sambar Masala & Tamarind pulp']::TEXT[],
    ARRAY['Pour fermented batter into greased idli molds; steam for 10-12 minutes until light and fluffy.', 'Boil toor dal with vegetables, turmeric, and sambar powder.', 'Add tamarind extract and temper with mustard, curry leaves, and asafoetida.', 'Serve warm idlis dunked in steaming sambar.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000012',
    'Hyderabadi Chicken Dum Biryani',
    'Aromatic long-grain basmati rice and marinated chicken slow cooked on ''dum'' with saffron, caramelised onions, and fresh mint.',
    'Andhra Pradesh',
    'non-vegetarian',
    'lunch',
    ARRAY['high-protein', 'high-carbs']::TEXT[],
    55,
    560,
    32,
    64,
    20,
    5,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-andhra-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['750g Chicken pieces, marinated in yogurt and spices', '2.5 cups Aged Basmati Rice (70% parboiled)', '1 cup Birista (Golden fried onions)', '1/4 cup Saffron milk & Pure Ghee', 'Star anise, Shahi Jeera, Cardamom, and Mint leaves']::TEXT[],
    ARRAY['Marinate chicken with yogurt, ginger-garlic, biryani masala, and mint for 2 hours.', 'Layer the marinated chicken at the bottom of a heavy handi; top with parboiled aromatic rice.', 'Drizzle saffron milk, pure ghee, fried onions, and seal lid with dough.', 'Cook on high heat for 10 minutes, then low heat on a tawa for 25 minutes for perfect steam infusion.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000013',
    'Andhra Chilli Chicken',
    'Fiery green chilli-infused chicken stir fry with garlic, curry leaves, and a tangy tamarind kick.',
    'Andhra Pradesh',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    30,
    310,
    34,
    6,
    16,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-andhra-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['500g Boneless Chicken Cubes', '10-12 Spicy Green Chillies, slit', '2 tbsp Soya Sauce & 1 tbsp Vinegar', '1 tbsp Cornstarch (light coating)', 'Generous curry leaves and garlic']::TEXT[],
    ARRAY['Lightly coat chicken in cornstarch, egg white, salt, and flash fry for 4 minutes.', 'In a wok, heat oil, toss slit green chillies, garlic, and curry leaves until fragrant.', 'Toss chicken in the wok with light soya sauce and black pepper on intense heat.', 'Serve piping hot as a high-protein dinner or appetizer.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000014',
    'Authentic Dal Baati Churma',
    'Traditional baked whole wheat dough balls drenched in pure desi ghee, served with panchmel dal and sweet jaggery churma.',
    'Rajasthan',
    'vegetarian',
    'lunch',
    ARRAY['high-carbs', 'high-fiber']::TEXT[],
    50,
    580,
    14,
    82,
    22,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-raj-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 cups Coarse Whole Wheat Flour & Sooji', '1/2 cup Ghee for knead and dipping', 'Panchmel Dal (Mix of 5 lentils: Moong, Chana, Toor, Urad, Masoor)', '1/2 cup Jaggery and Cardamom for Churma']::TEXT[],
    ARRAY['Knead tight dough with wheat flour, ghee, and ajwain; shape into round baatis.', 'Bake baatis in a tandoor or oven at 200°C until golden and cracked.', 'Dip hot crushed baatis generously in warm desi ghee.', 'Pair with spicy 5-lentil dal and sweet powdered churma.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000015',
    'Rajasthani Laal Maas',
    'Legendary royal Rajput warrior mutton curry simmered with Mathania dry red chillies, garlic, and mustard oil.',
    'Rajasthan',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    60,
    420,
    36,
    8,
    26,
    5,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-raj-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['750g Mutton (Goat Meat) pieces', '15 Mathania Dried Red Chillies (soaked & pureed)', '1 cup Whisked Yogurt', '3 tbsp Mustard Oil & 2 tbsp Ghee', 'Whole cloves, cardamom, and garlic paste']::TEXT[],
    ARRAY['Heat mustard oil to smoking point; crackle whole garam masalas and sliced onions.', 'Add mutton pieces and sear on high heat until browned.', 'Stir in Mathania red chilli paste and garlic; cook until the vibrant red oil surfaces.', 'Slow simmer on low heat with whisked yogurt for 45 minutes until meat falls off the bone.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000016',
    'Bengali Machher Jhol',
    'Light, comforting Rohu/Katla fish curry cooked with potato wedges, cauliflower, turmeric, and freshly tempered kalonji.',
    'West Bengal',
    'non-vegetarian',
    'lunch',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    30,
    260,
    28,
    12,
    10,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-bengal-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['500g Fresh Rohu or Katla Fish Steaks', '2 Potatoes, cut into wedges', '1 tsp Kalonji (Nigella seeds)', 'Fresh Green Chillies, Turmeric, and Cumin paste', 'Mustard Oil for shallow fry and gravy']::TEXT[],
    ARRAY['Marinate fish steaks with turmeric and sea salt; shallow fry lightly in mustard oil.', 'In the remaining oil, temper nigella seeds and green chillies; sauté potato wedges.', 'Add cumin-turmeric paste with water, cover, and cook until potatoes are tender.', 'Slide in the fried fish and simmer gently for 5 minutes. Serve with hot steamed rice.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000017',
    'Kolkata Egg Chicken Roll',
    'Flaky paratha layered with fried egg, juicy spiced chicken tikka strips, sliced red onions, and tangy green chilli sauce.',
    'West Bengal',
    'non-vegetarian',
    'snacks',
    ARRAY['high-protein']::TEXT[],
    25,
    410,
    22,
    46,
    15,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-bengal-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 Whole Wheat Parathas', '2 Eggs, beaten', '250g Cooked Boneless Chicken strips', 'Thinly sliced onions & fresh green chillies', 'Chaat masala and lemon juice']::TEXT[],
    ARRAY['Cook paratha on a hot tawa; flip and pour beaten egg directly over it, cooking until set.', 'Place warm egg paratha on butter paper; arrange spiced chicken strips along the center.', 'Scatter crunchy onions, green chillies, chaat masala, and a dash of lemon juice.', 'Roll tightly in butter paper and enjoy street-style on the go.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000018',
    'Steamed Nylon Khaman Dhokla',
    'Ultra-spongy, juicy steamed chickpea flour cakes tempered with mustard seeds, curry leaves, and green chillies. Light, healthy, and low in calories.',
    'Gujarat',
    'vegetarian',
    'breakfast',
    ARRAY['gym-diet', 'high-fiber']::TEXT[],
    20,
    160,
    8,
    26,
    3,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-gujarat-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['1.5 cups Besan (Fine Gram Flour)', '1 tsp Eno fruit salt & pinch of Turmeric', '1 tbsp Lemon juice & Sugar', 'Mustard seeds, green chillies, and curry leaves for tadka', 'Grated fresh coconut and chopped coriander']::TEXT[],
    ARRAY['Whisk besan with water, ginger-chilli paste, lemon juice, and a pinch of turmeric.', 'Add Eno fruit salt, whisk rapidly until frothy, and pour immediately into a greased pan.', 'Steam for 15 minutes on medium flame until an inserted toothpick emerges clean.', 'Pour hot sweet-tangy mustard tadka water evenly over the sliced dhokla.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000019',
    'Gujarati Methi Thepla',
    'Soft, fragrant flatbreads made with fresh fenugreek leaves, whole wheat flour, and warm spices. Perfect for travel and high in dietary fiber.',
    'Gujarat',
    'vegetarian',
    'snacks',
    ARRAY['high-fiber', 'gym-diet']::TEXT[],
    20,
    190,
    6,
    32,
    5,
    4.8,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-gujarat-2.jpg',
    master_chef_id,
    'approved',
    ARRAY['2 cups Whole Wheat Flour', '1 cup Fresh Methi (Fenugreek) Leaves, finely chopped', '2 tbsp Yogurt & 1 tbsp Sesame Seeds (Til)', 'Ajwain, Turmeric, and Red Chilli Powder']::TEXT[],
    ARRAY['Knead wheat flour with washed methi leaves, yogurt, spices, and a little oil into a soft dough.', 'Roll into thin circular discs.', 'Cook on a medium hot griddle with a few drops of oil until golden brown spots appear on both sides.', 'Serve with mango pickle (chhunda) and plain yogurt.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000020',
    'Authentic Kashmiri Rogan Josh',
    'The crown jewel of Kashmiri Wazwan — succulent lamb slow braised in aromatic Kashmiri red chilli oil, fennel powder, and dried ginger.',
    'Kashmir',
    'non-vegetarian',
    'dinner',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    55,
    410,
    34,
    8,
    25,
    5,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-kashmir-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['750g Mutton/Lamb Shoulder, bone-in', '2 tbsp Kashmiri Red Chilli Powder (Ratanjot optional)', '1.5 tbsp Fennel Seed (Saunf) powder', '1 tsp Dry Ginger (Sonth) powder', '1/2 cup Whisked Yogurt & Mustard Oil']::TEXT[],
    ARRAY['Heat mustard oil, brown the meat pieces with green and black cardamoms and cloves.', 'Lower heat, whisk in yogurt, and stir continuously until incorporated.', 'Mix Kashmiri red chilli powder with warm water; pour into the pan to give the signature red color.', 'Add ground fennel and dry ginger, cover tightly, and slow-cook on low flame for 45 minutes.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000021',
    'Goan Coconut Prawn Curry',
    'Plump juicy prawns simmered in a velvety coconut milk gravy spiked with raw mango, fresh coriander, and spicy Kashmiri chillies.',
    'Goa',
    'non-vegetarian',
    'lunch',
    ARRAY['high-protein', 'gym-diet']::TEXT[],
    25,
    330,
    31,
    10,
    18,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-goa-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['500g Jumbo Tiger Prawns, peeled & deveined', '1 cup Fresh Coconut Milk', '1/2 cup Grated Coconut ground with dried chillies & coriander seeds', '2 Kokum rinds or Raw Mango slices', 'Fresh ginger, garlic, and turmeric']::TEXT[],
    ARRAY['Season cleaned prawns with turmeric and sea salt.', 'Simmer the freshly ground coconut spice paste with kokum and a little water for 8 minutes.', 'Pour in thick coconut milk and bring to a gentle simmer.', 'Add prawns and cook for exactly 4-5 minutes until plump and tender. Serve with rice.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

  INSERT INTO public.recipes (
    id, title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    '11111111-1111-4111-8111-000000000022',
    'Moradabadi High-Protein Moong Dal Chaat',
    'Nutritious, high-fiber, high-protein steamed yellow moong dal served piping hot with lemon, raw onions, and zesty chutneys. A gym enthusiast favorite.',
    'Uttar Pradesh',
    'vegetarian',
    'snacks',
    ARRAY['high-protein', 'high-fiber', 'gym-diet']::TEXT[],
    20,
    210,
    18,
    32,
    3,
    4.9,
    'https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-up-1.jpg',
    master_chef_id,
    'approved',
    ARRAY['1 cup Yellow Moong Dal, washed and boiled soft', '1 tbsp Cumin and Chaat Masala', '1 tbsp Mint-Coriander Chutney', 'Chopped Onions, Tomatoes, and Green Chillies', 'Squeeze of fresh Lemon & a dab of Butter']::TEXT[],
    ARRAY['Pressure cook moong dal with turmeric and salt until velvety and soft.', 'Ladle hot dal into bowls, add a small touch of butter or ghee.', 'Top with fresh crunchy onions, tomatoes, green chillies, and chaat masala.', 'Drizzle tangy mint chutney and lemon juice for an energizing high-protein snack.']::TEXT[]
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    state = EXCLUDED.state,
    dietary_type = EXCLUDED.dietary_type,
    meal_type = EXCLUDED.meal_type,
    tags = EXCLUDED.tags,
    preparation_time = EXCLUDED.preparation_time,
    calories = EXCLUDED.calories,
    protein = EXCLUDED.protein,
    carbs = EXCLUDED.carbs,
    fat = EXCLUDED.fat,
    average_rating = EXCLUDED.average_rating,
    image_url = EXCLUDED.image_url,
    ingredients = EXCLUDED.ingredients,
    steps = EXCLUDED.steps,
    status = 'approved';

END $$;
