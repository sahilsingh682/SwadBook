-- ==============================================================================
-- RECIPE REBEL: SEED DATABASE WITH FAMOUS REGIONAL & FITNESS RECIPES
-- Run this in Supabase SQL Editor to populate the database with verified dishes.
-- ==============================================================================

-- 1. Create a Master Chef system user in auth.users if not exists
DO $$ 
DECLARE
  master_chef_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Insert into auth.users (System Chef)
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
  VALUES (
    master_chef_id,
    'masterchef@reciperebel.com',
    '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012',
    now(),
    '{"name": "Master Chef Rebel"}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;

  -- Insert profile
  INSERT INTO public.profiles (id, name, status)
  VALUES (master_chef_id, 'Master Chef Rebel', 'active')
  ON CONFLICT (id) DO UPDATE SET name = 'Master Chef Rebel';

  -- Insert admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (master_chef_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 2. Insert Famous Regional Recipes
  
  -- Punjab: Butter Chicken
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Amritsari Butter Chicken (Murgh Makhani)',
    'Tender chicken roasted in tandoor and simmered in a luscious tomato-butter gravy scented with kasuri methi.',
    'Punjab', 'non-vegetarian', 'dinner', ARRAY['high-protein', 'gym-diet'],
    45, 480, 38, 14, 28, 4.9,
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['750g Boneless Chicken', '1 cup Tomato Puree', '3 tbsp Butter & Cream', '1 cup Yogurt', '2 tbsp Kasuri Methi', 'Kashmiri Chilli & Garam Masala'],
    ARRAY['Marinate chicken in yogurt and spices for 1 hour.', 'Sear chicken in a pan or oven until charred.', 'Simmer tomato puree and butter with mild spices.', 'Add cooked chicken and cream; garnish with kasuri methi.']
  );

  -- Punjab: Dal Makhani
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Classic Dal Makhani',
    'Slow-simmered black lentils and kidney beans slow cooked with butter, cream, and aromatic spices.',
    'Punjab', 'vegetarian', 'dinner', ARRAY['high-fiber', 'high-protein'],
    60, 340, 16, 42, 14, 4.8,
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['1 cup Black Urad Dal', '1/4 cup Rajma', '2 tbsp Butter & Cream', '1 cup Tomato Puree', 'Cumin, Ginger, Garam Masala'],
    ARRAY['Pressure cook soaked dal and rajma until soft.', 'Prepare spiced tomato butter tadka.', 'Combine and slow simmer for 45 minutes.', 'Finish with cream and butter.']
  );

  -- Punjab: Tandoori Paneer Tikka
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Tandoori Paneer Tikka',
    'High-protein cubes of cottage cheese, peppers, and onions tossed in a smoky spiced yogurt marinade.',
    'Punjab', 'vegetarian', 'snacks', ARRAY['high-protein', 'gym-diet'],
    30, 280, 24, 10, 16, 4.8,
    'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['350g Firm Paneer', 'Bell Peppers & Onions', '1/2 cup Hung Curd', 'Mustard Oil', 'Chaat Masala & Ajwain'],
    ARRAY['Whisk hung curd with spices and mustard oil.', 'Coat paneer and vegetables; rest 30 mins.', 'Grill or air-fry at 200°C for 10-12 mins.', 'Serve hot with mint chutney.']
  );

  -- Maharashtra: Vada Pav
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Mumbai Iconic Vada Pav',
    'Spiced mashed potato ball coated in crispy chickpea batter inside buttered pav with spicy garlic chutney.',
    'Maharashtra', 'vegetarian', 'snacks', ARRAY['high-carbs'],
    25, 290, 8, 44, 10, 4.9,
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['4 Boiled Potatoes', '1 cup Besan', 'Mustard seeds & Curry leaves', 'Dry Garlic Chutney', '4 Fresh Ladi Pav'],
    ARRAY['Temper potatoes with mustard, chillies, and turmeric.', 'Shape balls and dip into chickpea batter.', 'Deep fry until golden.', 'Assemble inside pav with dry garlic chutney.']
  );

  -- Tamil Nadu: Masala Dosa
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Crispy Mysore Masala Dosa',
    'Crispy fermented crepe smeared with red chutney and stuffed with spiced potato masala.',
    'Tamil Nadu', 'vegetarian', 'breakfast', ARRAY['high-carbs', 'high-fiber'],
    30, 310, 8, 52, 8, 4.9,
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['2 cups Dosa Batter', '2 Boiled Potatoes', '2 tbsp Mysore Red Chutney', 'Ghee', 'Coconut Chutney & Sambar'],
    ARRAY['Spread batter thin on hot tawa.', 'Drizzle ghee and smear red chutney.', 'Place potato masala in center and fold.', 'Serve with coconut chutney and sambar.']
  );

  -- Andhra Pradesh: Hyderabadi Biryani
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Hyderabadi Chicken Dum Biryani',
    'Aromatic basmati rice and marinated chicken slow cooked on dum with saffron and fried onions.',
    'Andhra Pradesh', 'non-vegetarian', 'lunch', ARRAY['high-protein', 'high-carbs'],
    55, 560, 32, 64, 20, 5.0,
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['750g Chicken', '2.5 cups Basmati Rice', '1 cup Fried Onions', 'Saffron Milk & Ghee', 'Biryani Spices & Mint'],
    ARRAY['Marinate chicken in yogurt and spices.', 'Layer chicken in pot and top with parboiled rice.', 'Drizzle saffron milk, ghee, and fried onions.', 'Seal and cook on dum for 25 minutes.']
  );

  -- Gujarat: Khaman Dhokla
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Steamed Nylon Khaman Dhokla',
    'Spongy, juicy steamed chickpea cakes tempered with mustard and green chillies. Light and healthy.',
    'Gujarat', 'vegetarian', 'breakfast', ARRAY['gym-diet', 'high-fiber'],
    20, 160, 8, 26, 3, 4.9,
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['1.5 cups Besan', '1 tsp Eno fruit salt', 'Lemon juice & Sugar', 'Mustard seeds & Curry leaves', 'Fresh Coconut'],
    ARRAY['Whisk besan with lemon juice, water, and salt.', 'Add Eno and steam in a greased pan for 15 mins.', 'Pour sweet-tangy mustard tadka water over sliced dhokla.']
  );

  -- Kashmir: Rogan Josh
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Authentic Kashmiri Rogan Josh',
    'Succulent lamb braised in aromatic Kashmiri red chilli oil, fennel powder, and dried ginger.',
    'Kashmir', 'non-vegetarian', 'dinner', ARRAY['high-protein', 'gym-diet'],
    55, 410, 34, 8, 25, 5.0,
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['750g Mutton', '2 tbsp Kashmiri Red Chilli', '1.5 tbsp Fennel Powder', '1 tsp Dry Ginger Powder', 'Yogurt & Mustard Oil'],
    ARRAY['Brown mutton in mustard oil with whole spices.', 'Whisk in yogurt and red chilli infusion.', 'Simmer on low heat with fennel and ginger until tender.']
  );

  -- Uttar Pradesh: Moong Dal Chaat
  INSERT INTO public.recipes (
    title, description, state, dietary_type, meal_type, tags,
    preparation_time, calories, protein, carbs, fat, average_rating,
    image_url, author_id, status, ingredients, steps
  ) VALUES (
    'Moradabadi High-Protein Moong Dal Chaat',
    'Nutritious, high-fiber, high-protein steamed yellow moong dal with lemon, raw onions, and zesty chutneys.',
    'Uttar Pradesh', 'vegetarian', 'snacks', ARRAY['high-protein', 'high-fiber', 'gym-diet'],
    20, 210, 18, 32, 3, 4.9,
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80',
    master_chef_id, 'approved',
    ARRAY['1 cup Yellow Moong Dal', 'Chaat Masala & Cumin', 'Mint-Coriander Chutney', 'Diced Onions & Tomatoes', 'Fresh Lemon & Ghee'],
    ARRAY['Boil moong dal until velvety and soft.', 'Ladle into bowls with a touch of ghee.', 'Top with crunchy onions, tomatoes, and chaat masala.', 'Finish with lemon juice and mint chutney.']
  );

END $$;
