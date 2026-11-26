export interface FamousRecipe {
  id: string;
  title: string;
  description: string;
  state: string;
  dietary_type: 'vegetarian' | 'non-vegetarian';
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  tags: string[]; // 'high-protein' | 'high-carbs' | 'gym-diet' | 'high-fiber'
  preparation_time: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  average_rating: number;
  image_url: string;
  ingredients: string[];
  steps: string[];
  profiles: {
    name: string;
  };
}

export const FAMOUS_RECIPES: FamousRecipe[] = [
  // =============================================================
  // PUNJAB (4)
  // =============================================================
  {
    id: "recipe-punjab-1",
    title: "Amritsari Butter Chicken (Murgh Makhani)",
    description: "Tender boneless chicken marinated in spiced yogurt, charred on high heat, and simmered in a velvety tomato-butter gravy scented with roasted kasuri methi (per serving: ~200g chicken).",
    state: "Punjab",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 45,
    calories: 470,
    protein: 36,
    carbs: 14,
    fat: 30,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "750g Boneless Chicken Thighs (4 servings)",
      "1 cup (240g) Thick Hung Curd / Yogurt",
      "400g Ripe Tomato Puree",
      "3 tbsp (45g) Unsalted Butter",
      "3 tbsp (45ml) Fresh Cream",
      "2 tbsp Ginger-Garlic Paste",
      "2 tsp Kashmiri Red Chilli Powder & 1 tsp Garam Masala",
      "2 tbsp Dried Kasuri Methi (Fenugreek Leaves)",
      "1 tsp Honey & Salt to taste"
    ],
    steps: [
      "Whisk 240g hung curd with 1 tbsp ginger-garlic paste, 1 tsp Kashmiri chilli, 1/2 tsp turmeric, and salt; coat 750g chicken and marinate for 1 hour.",
      "Sear marinated chicken pieces in a hot grill pan or air-fryer at 220°C for 10–12 minutes until lightly charred.",
      "Melt 30g butter in a heavy kadhai, sauté remaining 1 tbsp ginger-garlic paste for 1 minute, then pour in 400g tomato puree.",
      "Simmer the tomato base on medium-low heat for 12–15 minutes until thickened and glossy; blend smooth if desired.",
      "Add seared chicken, 15g remaining butter, 1 tsp garam masala, 1 tsp honey, and simmer 8 minutes.",
      "Finish with 45ml fresh cream and crushed roasted kasuri methi; serve hot with tandoori roti or jeera rice."
    ],
    profiles: { name: "Chef Harpreet Singh" }
  },
  {
    id: "recipe-punjab-2",
    title: "Classic Dal Makhani",
    description: "Whole black urad lentils and red kidney beans slow-simmered with ripe tomatoes, ginger, butter, and a swirl of cream for deep smoky richness (1 generous bowl per serving).",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "dinner",
    tags: ["high-fiber", "high-protein"],
    preparation_time: 60,
    calories: 346,
    protein: 15,
    carbs: 40,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1 cup (200g) Whole Black Urad Dal (soaked overnight)",
      "1/4 cup (50g) Red Kidney Beans (Rajma)",
      "2 tbsp (30g) Butter",
      "2 tbsp (30ml) Fresh Cream",
      "1 cup (220g) Fresh Tomato Puree",
      "1.5 tbsp Ginger-Garlic Paste",
      "1 tsp Kashmiri Red Chilli Powder & 1/2 tsp Garam Masala",
      "1 tbsp Kasuri Methi & Salt to taste"
    ],
    steps: [
      "Rinse soaked 200g urad dal and 50g rajma thoroughly; pressure cook with 4 cups water and salt for 6–7 whistles until creamy.",
      "Lightly mash 20% of the cooked lentils with the back of a ladle to thicken the broth naturally.",
      "Melt 30g butter in a pot, sauté 1.5 tbsp ginger-garlic paste and 1 tsp Kashmiri chilli for 1 minute.",
      "Add 220g tomato puree and cook on medium heat for 10 minutes until the butter separates.",
      "Pour in the cooked dal with simmering water and slow-simmer on low heat for 30–35 minutes, stirring occasionally.",
      "Stir in 1/2 tsp garam masala, crushed kasuri methi, and 30ml cream before serving."
    ],
    profiles: { name: "Chef Gurpreet Kaur" }
  },
  {
    id: "recipe-punjab-3",
    title: "Peshawari Chole Bhature",
    description: "Robust dark-spiced Amritsari chickpeas simmered with tea-infused water and dried amla, paired with crisp, fluffy fermented bhaturas (1 plate = 1 bowl chole + 2 medium bhaturas).",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 50,
    calories: 517,
    protein: 14,
    carbs: 68,
    fat: 21,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/aa/Chole_Bhature_1.jpg/960px-Chole_Bhature_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "1.5 cups (270g) Dried Kabuli Chana (soaked overnight)",
      "2 cups (250g) All-Purpose Flour (Maida) + 2 tbsp Semolina",
      "1/2 cup (120g) Plain Curd (for bhatura dough)",
      "2 Black Tea Bags & 3 pieces Dried Amla",
      "2 medium (180g) Onions finely chopped & 200g Tomato Puree",
      "2 tbsp Chole Masala & 1 tsp Roasted Cumin Powder",
      "1 tsp Dry Mango Powder (Amchur) & 1/2 tsp Ajwain",
      "Oil for deep frying + 2 tbsp Ghee for tadka"
    ],
    steps: [
      "Knead 250g flour, 2 tbsp semolina, 120g curd, 1/2 tsp baking powder, and salt into a soft dough; rest covered for 2 hours.",
      "Pressure cook soaked 270g chickpeas with 2 tea bags, dried amla, black cardamom, and salt for 5 whistles; discard tea bags.",
      "Sauté 180g chopped onions in 2 tbsp ghee until deep golden brown; add 1 tbsp ginger-garlic paste and 200g tomato puree.",
      "Stir in 2 tbsp chole masala, 1 tsp cumin, and 1 tsp amchur; simmer with cooked chickpeas for 15 minutes until thick.",
      "Roll rested dough into oval discs and deep-fry in hot oil (190°C) until puffed and golden.",
      "Serve hot with pickled onions, green chillies, and mint chutney."
    ],
    profiles: { name: "Chef Vikramjeet Singh" }
  },
  {
    id: "recipe-punjab-4",
    title: "Tandoori Paneer Tikka",
    description: "Smoky, char-grilled cubes of fresh cottage cheese, bell peppers, and red onions marinated in spiced hung curd and mustard oil — a clean high-protein favorite.",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 294,
    protein: 23,
    carbs: 10,
    fat: 18,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "350g Firm Paneer (cut into 1.5-inch cubes)",
      "1 cup (150g) Green & Red Bell Peppers (diced)",
      "1 large (120g) Red Onion (petals)",
      "1/2 cup (120g) Thick Hung Curd",
      "1.5 tbsp Cold-Pressed Mustard Oil",
      "1.5 tbsp Roasted Besan (Gram Flour)",
      "1 tsp Kashmiri Chilli, 1 tsp Chaat Masala, 1/2 tsp Ajwain",
      "1 tbsp Lemon Juice & 1 tbsp Ginger-Garlic Paste"
    ],
    steps: [
      "Whisk 120g hung curd with 1.5 tbsp mustard oil, 1.5 tbsp roasted besan, ginger-garlic paste, Kashmiri chilli, ajwain, and salt.",
      "Gently fold in 350g paneer cubes, 150g bell peppers, and 120g onion petals; refrigerate for 30 minutes.",
      "Thread paneer and vegetables alternately onto skewers.",
      "Grill on a cast-iron tawa or air-fry at 200°C for 10–12 minutes, brushing lightly with oil halfway.",
      "Sprinkle 1 tsp chaat masala and fresh lemon juice; serve hot with green mint-coriander chutney."
    ],
    profiles: { name: "Chef Amrit Pal" }
  },

  // =============================================================
  // MAHARASHTRA (4)
  // =============================================================
  {
    id: "recipe-maha-1",
    title: "Mumbai Iconic Vada Pav",
    description: "Golden besan-battered spiced potato patty tucked inside soft ladi pav with fiery dry garlic-peanut chutney and fried green chilli.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-carbs"],
    preparation_time: 25,
    calories: 303,
    protein: 7,
    carbs: 44,
    fat: 11,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "4 medium (400g) Boiled & Mashed Potatoes",
      "4 Fresh Ladi Pav Buns",
      "1 cup (120g) Besan (Gram Flour) + 1 tbsp Rice Flour",
      "1 tsp Mustard Seeds, 10 Curry Leaves & 1/2 tsp Turmeric",
      "2 Green Chillies & 6 Garlic Cloves (crushed)",
      "3 tbsp Dry Garlic-Peanut Chutney",
      "Oil for deep frying & Salt to taste"
    ],
    steps: [
      "Heat 1 tbsp oil in a pan; splutter 1 tsp mustard seeds, curry leaves, crushed garlic-chilli paste, and 1/2 tsp turmeric.",
      "Toss in 400g mashed potatoes and salt; mix well, cool slightly, and shape into 4 even patties.",
      "Whisk 120g besan, 1 tbsp rice flour, a pinch of turmeric, and water into a thick, smooth batter.",
      "Dip each potato vada in batter and deep-fry in hot oil (180°C) for 3–4 minutes until crisp and golden.",
      "Slit 4 ladi pavs, spread 3 tbsp dry garlic chutney inside, place hot vada, and serve with a salted fried green chilli."
    ],
    profiles: { name: "Chef Sneha Kulkarni" }
  },
  {
    id: "recipe-maha-2",
    title: "Kolhapuri Misal Pav",
    description: "Protein-rich sprouted moth bean curry simmered in fiery Kolhapuri kanda-lasun masala, topped with crunchy farsan, chopped onions, and served with pav.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-fiber", "high-protein"],
    preparation_time: 35,
    calories: 376,
    protein: 16,
    carbs: 51,
    fat: 12,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1.5 cups (220g) Sprouted Moth Beans (Matki)",
      "2 medium (160g) Onions (100g for gravy + 60g for garnish)",
      "2 tbsp (20g) Grated Dry Coconut",
      "2 tbsp Kolhapuri Kanda-Lasun Masala",
      "1 cup (60g) Crunchy Sev / Farsan",
      "4 Ladi Pav & 2 tbsp Oil",
      "1 Lemon & Fresh Coriander"
    ],
    steps: [
      "Roast 100g sliced onions, 20g dry coconut, garlic, and ginger in 1 tsp oil; blend into a smooth masala paste.",
      "Heat remaining oil, sauté the paste with 2 tbsp Kolhapuri masala and 1/2 tsp turmeric until aromatic.",
      "Add 220g sprouted matki and 3 cups water; simmer for 15 minutes until sprouts are tender and spicy red tarri floats on top.",
      "Ladle hot usal and tarri into bowls, top generously with 60g farsan, chopped raw onion, coriander, and lemon juice.",
      "Serve immediately with warm buttered pav."
    ],
    profiles: { name: "Chef Rohan Deshmukh" }
  },
  {
    id: "recipe-maha-3",
    title: "Kanda Poha with Roasted Peanuts",
    description: "Light, fluffy flattened rice tempered with mustard seeds, sweet onions, curry leaves, turmeric, and crunchy roasted peanuts.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 15,
    calories: 264,
    protein: 6,
    carbs: 42,
    fat: 8,
    average_rating: 4.7,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Kanda_Poha-Diu-DSC003.jpg/960px-Kanda_Poha-Diu-DSC003.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "2 cups (180g) Thick Poha (Flattened Rice)",
      "1 large (120g) Onion finely chopped",
      "3 tbsp (30g) Raw Peanuts",
      "1 tsp Mustard Seeds, 10 Curry Leaves & 2 Green Chillies",
      "1/2 tsp Turmeric Powder & 1 tsp Sugar",
      "1.5 tbsp Oil & 1 tbsp Fresh Lemon Juice",
      "Fresh Coriander & Sev for garnish"
    ],
    steps: [
      "Rinse 180g thick poha in a colander under running water for 10 seconds and drain completely; let soften for 5 minutes.",
      "Heat 1.5 tbsp oil in a kadhai; roast 30g peanuts on medium heat until crisp and set aside.",
      "In the same oil, splutter 1 tsp mustard seeds, curry leaves, and slit green chillies.",
      "Add 120g chopped onions and sauté 3 minutes until translucent; stir in 1/2 tsp turmeric, salt, and 1 tsp sugar.",
      "Gently fold in softened poha and roasted peanuts; cover and steam on low heat for 2 minutes.",
      "Finish with lemon juice and chopped coriander."
    ],
    profiles: { name: "Chef Meera Joshi" }
  },
  {
    id: "recipe-maha-4",
    title: "Fasting Sabudana Khichdi",
    description: "Non-sticky pearl tapioca sautéed in pure cow ghee with roasted crushed peanuts, cumin, green chillies, and diced potatoes.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs"],
    preparation_time: 20,
    calories: 326,
    protein: 5,
    carbs: 54,
    fat: 10,
    average_rating: 4.7,
    image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1 cup (180g) Sabudana (Tapioca Pearls, soaked 5 hours)",
      "1/3 cup (45g) Roasted Peanuts (coarsely crushed)",
      "1 medium (120g) Boiled Potato (cubed)",
      "1.5 tbsp Pure Cow Ghee",
      "1 tsp Cumin Seeds & 2 Green Chillies",
      "Rock Salt (Sendha Namak) & 1 tbsp Lemon Juice"
    ],
    steps: [
      "Rinse 180g sabudana twice, soak in just enough water to cover for 5 hours until pearls crush easily without mushiness.",
      "Mix drained sabudana gently with 45g coarsely crushed peanuts and rock salt.",
      "Heat 1.5 tbsp ghee in a non-stick pan; crackle 1 tsp cumin seeds and chopped green chillies.",
      "Toss in 120g cubed boiled potatoes and sauté 2 minutes until lightly golden.",
      "Add the sabudana-peanut mixture and cook on low heat for 5–6 minutes, stirring gently until pearls turn translucent.",
      "Finish with lemon juice and fresh coriander."
    ],
    profiles: { name: "Chef Aditi Patwardhan" }
  },

  // =============================================================
  // TAMIL NADU (4)
  // =============================================================
  {
    id: "recipe-south-1",
    title: "Crispy Masala Dosa with Sambar",
    description: "Paper-thin fermented rice-lentil crepe golden-roasted with ghee, stuffed with spiced turmeric potato masala, and served with hot vegetable sambar.",
    state: "Tamil Nadu",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 30,
    calories: 341,
    protein: 9,
    carbs: 56,
    fat: 9,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups (450g) Fermented Rice & Urad Dal Dosa Batter",
      "3 medium (300g) Boiled Potatoes (mashed coarsely)",
      "1 medium (100g) Onion sliced & 1/2 tsp Turmeric",
      "1 tsp Mustard Seeds, 1 tsp Chana Dal & 10 Curry Leaves",
      "2 tsp Pure Ghee for roasting",
      "1 cup (200ml) Hot Toor Dal Vegetable Sambar",
      "2 tbsp Fresh Coconut Chutney"
    ],
    steps: [
      "Heat 1 tbsp oil, splutter mustard seeds, chana dal, curry leaves, and green chillies; sauté 100g onions until soft.",
      "Add 1/2 tsp turmeric, 300g mashed potatoes, and salt; cook 3 minutes to make the masala filling.",
      "Heat a cast-iron dosa tawa until hot, sprinkle water to season, and pour 1 ladle of fermented batter in the center.",
      "Spread thinly in rapid spiral circles and drizzle 1/2 tsp ghee around the edges.",
      "Once crisp and golden-brown, place 2 tbsp potato masala in the center and fold.",
      "Serve piping hot with vegetable sambar and coconut chutney."
    ],
    profiles: { name: "Chef Karthik Iyer" }
  },
  {
    id: "recipe-south-2",
    title: "Chettinad Pepper Chicken Curry",
    description: "Aromatic Tamil-style chicken simmered in freshly stone-ground black pepper, fennel, star anise, curry leaves, and shallots.",
    state: "Tamil Nadu",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 40,
    calories: 387,
    protein: 36,
    carbs: 9,
    fat: 23,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "700g Bone-in Chicken (curry cut, 4 servings)",
      "150g Shallots (Madras Onions) finely sliced",
      "2 medium (160g) Tomatoes chopped",
      "2 tbsp Freshly Roasted Black Peppercorns & Coriander Seeds",
      "1 tsp Fennel Seeds, 1 Star Anise & 2 tbsp Grated Coconut",
      "2 tbsp Gingelly (Sesame) Oil",
      "15 Fresh Curry Leaves & 1.5 tbsp Ginger-Garlic Paste"
    ],
    steps: [
      "Dry roast black peppercorns, coriander seeds, fennel, star anise, and 2 tbsp grated coconut for 3 minutes; grind into a smooth paste.",
      "Heat 2 tbsp gingelly oil in a pan; sauté curry leaves, 150g shallots, and 1.5 tbsp ginger-garlic paste until golden.",
      "Add 160g chopped tomatoes and 1/2 tsp turmeric; cook until soft and pulpy.",
      "Toss in 700g chicken pieces and sear on high heat for 5 minutes until sealed.",
      "Stir in the freshly ground Chettinad spice paste and 1 cup water; cover and simmer 18–20 minutes until chicken is tender.",
      "Finish with crushed black pepper and fresh curry leaves."
    ],
    profiles: { name: "Chef Meenakshi Sundaram" }
  },
  {
    id: "recipe-south-3",
    title: "Steamed Soft Idli with Vegetable Sambar",
    description: "Feather-light, gut-friendly steamed fermented rice-urad cakes served with protein-rich lentil vegetable sambar (3 idlis + 1 bowl sambar per serving).",
    state: "Tamil Nadu",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-fiber", "gym-diet"],
    preparation_time: 20,
    calories: 224,
    protein: 9,
    carbs: 38,
    fat: 4,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/02/Idli_Sambar-Noida-UP-SP004.jpg/960px-Idli_Sambar-Noida-UP-SP004.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "3 cups (600g) Fermented Idli Batter (3:1 Rice to Urad Dal)",
      "1/2 cup (100g) Toor Dal (cooked soft)",
      "150g Mixed Drumstick, Carrot & Pumpkin pieces",
      "1 tbsp Sambar Powder & 1 tsp Tamarind Pulp",
      "1 tsp Mustard Seeds, Asafoetida & Curry Leaves",
      "1 tsp Oil for sambar tempering"
    ],
    steps: [
      "Grease idli moulds lightly and ladle fermented batter into each cavity; steam for 10–12 minutes until a toothpick comes out clean.",
      "Boil 150g diced vegetables with 1 tsp tamarind pulp, 1/2 tsp turmeric, and salt until tender.",
      "Stir in cooked 100g toor dal and 1 tbsp sambar powder; simmer 8 minutes for flavors to meld.",
      "Temper mustard seeds, asafoetida, and curry leaves in 1 tsp oil and pour over the sambar.",
      "Serve 3 warm idlis per plate drenched in hot sambar."
    ],
    profiles: { name: "Chef Aravind Krishnan" }
  },
  {
    id: "recipe-south-4",
    title: "Ghee Ven Pongal with Coconut Chutney",
    description: "Comforting Tamil temple-style savory rice and split yellow moong dal porridge tempered with ghee, whole black pepper, cumin, and roasted cashews.",
    state: "Tamil Nadu",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs"],
    preparation_time: 25,
    calories: 352,
    protein: 9,
    carbs: 52,
    fat: 12,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Pongalpot.jpg/960px-Pongalpot.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "1 cup (200g) Raw Sona Masoori Rice",
      "1/3 cup (70g) Split Yellow Moong Dal",
      "2.5 tbsp (35g) Pure Cow Ghee",
      "10 Whole Cashew Nuts",
      "1.5 tsp Cumin Seeds & 1 tsp Whole Black Peppercorns",
      "1 inch Ginger (finely grated), Curry Leaves & Asafoetida"
    ],
    steps: [
      "Dry roast 70g moong dal for 3 minutes until fragrant; wash together with 200g rice.",
      "Pressure cook rice and dal with 4.5 cups water and salt for 4 whistles until soft and creamy.",
      "Heat 35g ghee in a small tadka pan; fry 10 cashews until golden and set aside.",
      "In the same ghee, crackle 1.5 tsp cumin, 1 tsp peppercorns, grated ginger, asafoetida, and curry leaves.",
      "Pour the sizzling ghee tempering and cashews over the hot pongal; mix gently and serve with coconut chutney."
    ],
    profiles: { name: "Chef Priya Natarajan" }
  },

  // =============================================================
  // ANDHRA PRADESH (4)
  // =============================================================
  {
    id: "recipe-andhra-1",
    title: "Hyderabadi Chicken Dum Biryani",
    description: "Royal slow-steamed kacchi dum biryani layering saffron-infused aged basmati rice over spiced yogurt-marinated chicken, caramelized birista, and mint.",
    state: "Andhra Pradesh",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "high-carbs"],
    preparation_time: 65,
    calories: 522,
    protein: 34,
    carbs: 56,
    fat: 18,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "700g Chicken Drumsticks & Thighs",
      "2 cups (380g) Aged Basmati Rice (soaked 30 mins)",
      "1 cup (240g) Thick Yogurt & 150g Fried Crispy Onions (Birista)",
      "2 tbsp Shahi Biryani Masala & 2 tbsp Ginger-Garlic Paste",
      "1 pinch Saffron soaked in 3 tbsp Warm Milk",
      "2 tbsp Ghee, Fresh Mint & Coriander Leaves"
    ],
    steps: [
      "Marinate 700g chicken with 240g yogurt, ginger-garlic paste, biryani masala, half the birista, mint, and salt for 2 hours.",
      "Boil 380g soaked basmati rice with whole bay leaf, cardamom, and cloves until 70% cooked; drain immediately.",
      "Spread marinated chicken in a heavy handi, layer 70%-cooked rice evenly on top.",
      "Drizzle saffron milk, 2 tbsp melted ghee, remaining birista, and fresh mint leaves.",
      "Seal the pot tightly with foil/dough and cook on dum (5 min high, 25 min very low heat over a tawa).",
      "Let rest 10 minutes before fluffing gently; serve with mirchi ka salan and raita."
    ],
    profiles: { name: "Chef Farhan Quadri" }
  },
  {
    id: "recipe-andhra-2",
    title: "Pesarattu (Green Moong Dal Dosa)",
    description: "Crisp, high-protein Andhra breakfast crepe made from whole green moong gram, ginger, cumin, and green chillies — zero rice required.",
    state: "Andhra Pradesh",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-protein", "high-fiber", "gym-diet"],
    preparation_time: 20,
    calories: 233,
    protein: 13,
    carbs: 34,
    fat: 5,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1.5 cups (280g) Whole Green Moong Dal (soaked 6 hours)",
      "2 tbsp (25g) Raw Rice (for extra crispness)",
      "1 inch Fresh Ginger & 3 Green Chillies",
      "1 tsp Cumin Seeds & 1 small (80g) Onion finely chopped",
      "2 tsp Cold-Pressed Oil & Salt to taste"
    ],
    steps: [
      "Grind soaked 280g green moong, 25g rice, ginger, green chillies, and salt with water into a smooth pouring batter.",
      "Stir in 1 tsp cumin seeds (no fermentation needed — cook right away!).",
      "Pour 1 ladle onto a hot non-stick tawa and spread evenly into a thin circle.",
      "Scatter chopped onions over the top, drizzle 1/2 tsp oil, and cook 2–3 minutes until crisp.",
      "Fold and serve hot with tangy ginger-tamarind (allam) chutney."
    ],
    profiles: { name: "Chef Lakshmi Narayana" }
  },
  {
    id: "recipe-andhra-3",
    title: "Gutti Vankaya Kura (Stuffed Eggplant Curry)",
    description: "Tender baby brinjals slit and stuffed with a freshly roasted peanut, sesame, coconut, and tamarind spice masala, then braised until meltingly soft.",
    state: "Andhra Pradesh",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-fiber"],
    preparation_time: 35,
    calories: 266,
    protein: 6,
    carbs: 20,
    fat: 18,
    average_rating: 4.8,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/12/Gutti-vankaya_kura.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    ingredients: [
      "400g Small Purple Brinjals (Eggplants, slit in a cross)",
      "3 tbsp (30g) Roasted Peanuts & 2 tbsp White Sesame Seeds",
      "2 tbsp (20g) Dry Coconut & 1 tbsp Coriander Seeds",
      "1 tbsp Tamarind Pulp & 1 tsp Red Chilli Powder",
      "2 tbsp Oil, 1 tsp Mustard Seeds & 10 Curry Leaves"
    ],
    steps: [
      "Dry roast peanuts, sesame seeds, dry coconut, coriander seeds, and cumin; grind with tamarind, chilli powder, and salt into a thick stuffing paste.",
      "Stuff the spice paste generously inside each slit baby brinjal; reserve extra paste.",
      "Heat 2 tbsp oil in a wide pan, splutter mustard seeds and curry leaves.",
      "Place stuffed brinjals gently in a single layer, cover, and cook on low heat for 12 minutes, turning carefully.",
      "Add reserved masala paste with 1/2 cup water and simmer 8 minutes until gravy thickens around the tender brinjals."
    ],
    profiles: { name: "Chef Padmavathi Rao" }
  },
  {
    id: "recipe-andhra-4",
    title: "Andhra Kodi Vepudu (Spicy Chicken Fry)",
    description: "Fiery, dry-roasted South Indian chicken sautéed with curry leaves, Guntur chillies, black pepper, and crushed garlic — ultra high-protein and low-carb.",
    state: "Andhra Pradesh",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 35,
    calories: 344,
    protein: 35,
    carbs: 6,
    fat: 20,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/96/Andhra_Fried_Chicken.JPG/960px-Andhra_Fried_Chicken.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "700g Boneless or Small-Cut Chicken",
      "1 medium (100g) Onion finely sliced",
      "2 tbsp Ginger-Garlic Paste & 8 Crushed Garlic Cloves",
      "2 tbsp Oil & 20 Fresh Curry Leaves",
      "1.5 tsp Guntur Red Chilli Powder & 1 tsp Black Pepper",
      "1 tsp Coriander Powder & 1/2 tsp Garam Masala",
      "1 tbsp Lemon Juice"
    ],
    steps: [
      "Marinate 700g chicken with turmeric, 1 tbsp ginger-garlic paste, and salt for 20 minutes.",
      "Heat 2 tbsp oil in a heavy pan; sauté sliced onions and curry leaves until golden.",
      "Add marinated chicken and cook covered on medium heat for 12 minutes until chicken releases and reabsorbs its juices.",
      "Uncover, add Guntur chilli powder, coriander powder, black pepper, and crushed garlic cloves.",
      "Roast on medium-high heat for 8–10 minutes until dark, crisp, and coated in dry spice masala; finish with lemon juice."
    ],
    profiles: { name: "Chef Sai Kiran Reddy" }
  },

  // =============================================================
  // RAJASTHAN (4)
  // =============================================================
  {
    id: "recipe-raj-1",
    title: "Authentic Dal Baati Churma",
    description: "Rajasthan's iconic royal platter: baked whole-wheat baatis dipped in ghee, served with five-lentil panchmel dal and sweet crushed wheat-jaggery churma.",
    state: "Rajasthan",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 65,
    calories: 557,
    protein: 16,
    carbs: 76,
    fat: 21,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/%22Delectable_Dal_Baati_Churma%22.jpg/960px-%22Delectable_Dal_Baati_Churma%22.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "2 cups (240g) Coarse Whole Wheat Flour (Atta) + 2 tbsp Semolina",
      "1 cup (180g) Panchmel Dal (Toor, Moong, Masoor, Chana, Urad)",
      "4 tbsp (55g) Pure Desi Ghee (for dough, dipping & tadka)",
      "3 tbsp (45g) Grated Jaggery + Cardamom (for Churma)",
      "1 tsp Cumin, 1/2 tsp Ajwain & Pinch of Hing",
      "1 tsp Red Chilli Powder & 1/2 tsp Garam Masala"
    ],
    steps: [
      "Mix 240g atta, 2 tbsp semolina, ajwain, salt, and 2 tbsp ghee into a stiff dough; shape into round baatis.",
      "Bake baatis in an oven at 190°C (or appam pan/baati cooker) for 30–35 minutes until golden and cracked.",
      "Pressure cook 180g panchmel dal with turmeric and salt; temper with ghee, cumin, hing, and red chilli.",
      "Crush 2 baked baatis finely, blend with 45g melted jaggery, cardamom powder, and almonds to make sweet churma.",
      "Dip remaining hot baatis in melted ghee and serve alongside steaming panchmel dal and churma."
    ],
    profiles: { name: "Chef Mahendra Rathore" }
  },
  {
    id: "recipe-raj-2",
    title: "Rajasthani Laal Maas",
    description: "Fiery royal mutton curry slow-braised in yogurt, garlic, and smoky Mathania red chillies until tender and intensely aromatic.",
    state: "Rajasthan",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 60,
    calories: 434,
    protein: 34,
    carbs: 7,
    fat: 30,
    average_rating: 4.8,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/97/Laal-Maans.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    ingredients: [
      "750g Bone-in Goat Mutton (curry cut)",
      "8–10 Dried Mathania Red Chillies (soaked & ground to paste)",
      "1 cup (240g) Whisked Plain Yogurt",
      "2 medium (160g) Onions finely sliced",
      "2 tbsp Crushed Garlic & 3 tbsp Pure Desi Ghee",
      "2 Black Cardamoms, 4 Cloves & 1 Bay Leaf"
    ],
    steps: [
      "Soak Mathania chillies in warm water for 20 minutes and grind with garlic into a vibrant red paste.",
      "Heat 3 tbsp ghee in a heavy handi; add whole spices and sauté 160g sliced onions until deep brown.",
      "Add 750g mutton and sear on high heat for 6–8 minutes until browned.",
      "Stir in the Mathania chilli-garlic paste and whisked 240g yogurt slowly on low heat, stirring continuously.",
      "Add 1.5 cups hot water, cover tightly, and slow-simmer 40–45 minutes until mutton falls off the bone."
    ],
    profiles: { name: "Chef Devendra Shekhawat" }
  },
  {
    id: "recipe-raj-3",
    title: "Gatte ki Sabzi",
    description: "Steamed, spiced gram-flour (besan) dumplings simmered in a tangy, creamy yogurt-tomato gravy tempered with cumin and kasuri methi.",
    state: "Rajasthan",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "high-fiber"],
    preparation_time: 35,
    calories: 310,
    protein: 12,
    carbs: 34,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ac/Besan_Gatta_curry03.jpg/960px-Besan_Gatta_curry03.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "1.5 cups (180g) Besan (Gram Flour)",
      "1 cup (240g) Whisked Yogurt",
      "2 tbsp Oil + 1 tbsp Ghee",
      "1 tsp Ajwain, 1 tsp Fennel Seeds & 1 tsp Coriander Powder",
      "1 tsp Kashmiri Chilli Powder & 1/2 tsp Turmeric",
      "1 tbsp Kasuri Methi & Pinch of Asafoetida"
    ],
    steps: [
      "Mix 180g besan, ajwain, fennel, turmeric, 2 tbsp yogurt, and 1 tbsp oil into a firm dough; roll into thin cylinders.",
      "Boil cylinders in simmering water for 10 minutes until tiny bubbles appear on their surface; cool and slice into bite-sized gatte.",
      "Whisk remaining yogurt with chilli powder, coriander powder, and turmeric.",
      "Heat 1 tbsp ghee + 1 tbsp oil, crackle cumin and hing, then stir in spiced yogurt continuously until simmering.",
      "Add sliced gatte and reserved boiling water; simmer 10 minutes until gravy coats the dumplings. Finish with kasuri methi."
    ],
    profiles: { name: "Chef Bhawana Sharma" }
  },
  {
    id: "recipe-raj-4",
    title: "Traditional Ker Sangri",
    description: "Authentic desert delicacy of dried wild caper berries (ker) and desert beans (sangri) stir-fried with amchur, whole red chillies, and warming Marwari spices.",
    state: "Rajasthan",
    dietary_type: "vegetarian",
    meal_type: "dinner",
    tags: ["high-fiber"],
    preparation_time: 30,
    calories: 211,
    protein: 6,
    carbs: 22,
    fat: 11,
    average_rating: 4.7,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/70/KerSangri.JPG/960px-KerSangri.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "1 cup (120g) Dried Ker & Sangri (soaked overnight & boiled)",
      "2 tbsp (30ml) Mustard Oil or Ghee",
      "2 tbsp Raisins (Kishmish) & 4 Whole Dried Red Chillies",
      "1.5 tsp Amchur (Dry Mango Powder) & 1 tsp Coriander Powder",
      "1 tsp Cumin Seeds & Pinch of Hing"
    ],
    steps: [
      "Wash soaked ker and sangri 3 times to remove any sand; boil in fresh water for 12 minutes and drain.",
      "Heat 30ml mustard oil until smoking, cool slightly, and crackle cumin, hing, and whole red chillies.",
      "Add boiled ker sangri, 1 tsp coriander powder, 1/2 tsp turmeric, and red chilli powder; sauté 5 minutes.",
      "Toss in 2 tbsp raisins and 1.5 tsp amchur; cook on low heat for 6–8 minutes until crisp and well-coated.",
      "Serve with bajra roti and chilled buttermilk."
    ],
    profiles: { name: "Chef Padmini Rathore" }
  },

  // =============================================================
  // WEST BENGAL (4)
  // =============================================================
  {
    id: "recipe-bengal-1",
    title: "Bengali Macher Jhol (Light Fish Curry)",
    description: "Clean, comforting homestyle Bengali fish curry cooked with rohu steaks, potatoes, nigella seeds (kalonji), turmeric, and aromatic mustard oil.",
    state: "West Bengal",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 296,
    protein: 28,
    carbs: 10,
    fat: 16,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "600g Rohu or Katla Fish Steaks (4 pieces)",
      "2 tbsp (30ml) Cold-Pressed Mustard Oil",
      "1 medium (120g) Potato (cut into wedges)",
      "1/2 tsp Kalonji (Nigella Seeds) & 3 Slit Green Chillies",
      "1 tsp Turmeric, 1 tsp Cumin Powder & 1 tsp Ginger Paste",
      "1 medium (100g) Tomato chopped & Fresh Coriander"
    ],
    steps: [
      "Rub 600g fish steaks with 1/2 tsp turmeric and salt; rest 10 minutes.",
      "Heat 30ml mustard oil until smoking; lightly sear fish steaks 2 minutes per side and set aside.",
      "In the same oil, temper kalonji and green chillies; sauté 120g potato wedges for 3 minutes.",
      "Add ginger paste, chopped tomato, cumin powder, remaining turmeric, and 2 cups warm water; boil until potatoes soften.",
      "Slide seared fish gently into the light broth, cover, and simmer 6–8 minutes. Garnish with coriander and serve with steamed rice."
    ],
    profiles: { name: "Chef Anirban Chatterjee" }
  },
  {
    id: "recipe-bengal-2",
    title: "Kolkata Egg Chicken Kathi Roll",
    description: "Flaky lachha paratha lined with beaten egg, stuffed with charred chicken tikka, pickled onions, green chilli, and tangy chaat masala.",
    state: "West Bengal",
    dietary_type: "non-vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "high-carbs"],
    preparation_time: 30,
    calories: 442,
    protein: 28,
    carbs: 42,
    fat: 18,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Kati_Roll_Company%2C_Soho%2C_London_%282809874428%29.jpg/960px-Kati_Roll_Company%2C_Soho%2C_London_%282809874428%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "350g Boneless Chicken Breast (cut into strips)",
      "3 Flaky Parathas (Whole Wheat or Lachha)",
      "3 Whole Eggs (1 egg per roll)",
      "1 medium (100g) Red Onion thinly sliced",
      "2 tbsp Curd, 1 tbsp Tikka Masala & 1 tbsp Lemon Juice",
      "1 tsp Chaat Masala & 2 tbsp Oil"
    ],
    steps: [
      "Marinate 350g chicken strips in 2 tbsp curd, tikka masala, ginger-garlic paste, and salt; pan-sear on high heat until charred.",
      "Cook each paratha on a hot tawa, pour 1 beaten egg over one side, and flip for 30 seconds until set.",
      "Remove onto parchment paper with the egg side facing up.",
      "Line the center with seared chicken strips, sliced raw onions, green chillies, chaat masala, and lemon juice.",
      "Roll tightly and serve hot."
    ],
    profiles: { name: "Chef Riya Sen" }
  },
  {
    id: "recipe-bengal-3",
    title: "Chingri Malai Curry (Coconut Prawn Curry)",
    description: "Jumbo prawns poached gently in rich, golden coconut milk infused with cardamom, cinnamon, ghee, and mild ginger-turmeric spices.",
    state: "West Bengal",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 338,
    protein: 27,
    carbs: 8,
    fat: 22,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Chingri_Macher_Malai_Curry.jpg/960px-Chingri_Macher_Malai_Curry.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "600g Large Tiger Prawns (deveined, shell-on tail)",
      "1.5 cups (360ml) Thick Coconut Milk",
      "1 medium (100g) Onion grated & 1 tbsp Ginger Paste",
      "1.5 tbsp Mustard Oil + 1 tbsp Ghee",
      "3 Green Cardamoms, 1 Cinnamon Stick & 2 Bay Leaves",
      "1/2 tsp Turmeric, 1/2 tsp Kashmiri Chilli & 3 Green Chillies"
    ],
    steps: [
      "Rub 600g prawns with 1/2 tsp turmeric and salt; sear in 1.5 tbsp mustard oil for 90 seconds per side and set aside.",
      "In the same oil, temper cardamom, cinnamon, and bay leaf; sauté grated onion and 1 tbsp ginger paste until golden.",
      "Add Kashmiri chilli, turmeric, and a splash of warm water; cook 3 minutes.",
      "Pour in 360ml thick coconut milk and simmer gently on low heat for 4 minutes (do not boil vigorously).",
      "Slide prawns and slit green chillies back in; simmer 4 minutes, finish with 1 tbsp ghee, and serve with gobindobhog rice."
    ],
    profiles: { name: "Chef Subhojit Bose" }
  },
  {
    id: "recipe-bengal-4",
    title: "Bengali Aloo Posto (Poppy Seed Potatoes)",
    description: "Beloved homestyle Bengali comfort dish of cubed potatoes coated in a nutty, creamy white poppy-seed paste with mustard oil and green chillies.",
    state: "West Bengal",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-fiber"],
    preparation_time: 25,
    calories: 278,
    protein: 6,
    carbs: 32,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Aloo_Posto.jpg/960px-Aloo_Posto.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "450g Potatoes (peeled and cut into 1-inch cubes)",
      "4 tbsp (40g) White Poppy Seeds (Posto, soaked 1 hour)",
      "2 tbsp (30ml) Cold-Pressed Mustard Oil",
      "1/2 tsp Kalonji (Nigella Seeds)",
      "4 Green Chillies (2 blended + 2 whole slit)",
      "Salt & Pinch of Sugar to taste"
    ],
    steps: [
      "Grind soaked 40g poppy seeds with 2 green chillies and minimal water into a thick, velvety white paste.",
      "Heat 30ml mustard oil in a pan; crackle 1/2 tsp kalonji and 2 slit green chillies.",
      "Add 450g cubed potatoes and salt; sauté on medium heat for 6–7 minutes until edges turn light golden.",
      "Add 1/2 cup water, cover, and cook 6 minutes until potatoes are 90% tender.",
      "Stir in the poppy seed paste and cook uncovered on low heat for 4 minutes until creamy; finish with a few drops of raw mustard oil."
    ],
    profiles: { name: "Chef Moumita Dutta" }
  },

  // =============================================================
  // GUJARAT (4)
  // =============================================================
  {
    id: "recipe-gujarat-1",
    title: "Steamed Nylon Khaman Dhokla",
    description: "Feather-light, spongy steamed chickpea-flour cakes tempered with mustard seeds, curry leaves, green chillies, and sweet-tangy citrus syrup.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-fiber", "gym-diet"],
    preparation_time: 25,
    calories: 193,
    protein: 9,
    carbs: 28,
    fat: 5,
    average_rating: 4.9,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Gujarati_Dhokla_%28Khaman_Dhokla%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    ingredients: [
      "1.5 cups (180g) Fine Besan (Gram Flour, sifted)",
      "1 tbsp Lemon Juice, 1 tsp Ginger-Chilli Paste & 1/4 tsp Turmeric",
      "1.5 tsp Eno Fruit Salt (for instant aeration)",
      "1 tbsp Oil, 1 tsp Mustard Seeds & 12 Curry Leaves",
      "3 Slit Green Chillies & 1 tbsp Sugar (for tadka water)",
      "2 tbsp Fresh Grated Coconut & Coriander"
    ],
    steps: [
      "Whisk 180g sifted besan, lemon juice, ginger-chilli paste, turmeric, salt, and 1 cup water into a lump-free batter; rest 10 minutes.",
      "Fold in 1.5 tsp Eno gently with 1 tbsp water until batter turns airy and frothy; pour immediately into a greased steamer tin.",
      "Steam on high heat for 15 minutes until a skewer inserted comes out clean; cool 5 minutes and cut into squares.",
      "Heat 1 tbsp oil, crackle mustard seeds, curry leaves, and green chillies; add 1/3 cup water and 1 tbsp sugar to boil.",
      "Spoon the warm tempering syrup evenly over the dhokla squares and garnish with fresh coconut and coriander."
    ],
    profiles: { name: "Chef Nidhi Patel" }
  },
  {
    id: "recipe-gujarat-2",
    title: "Gujarati Methi Thepla",
    description: "Wholesome whole-wheat flatbreads kneaded with fresh fenugreek leaves, yogurt, turmeric, and sesame seeds — ideal for travel and balanced energy.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-fiber", "high-carbs"],
    preparation_time: 25,
    calories: 252,
    protein: 7,
    carbs: 38,
    fat: 8,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Masala_thepla_with_Methi_kela.JPG/960px-Masala_thepla_with_Methi_kela.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "2 cups (240g) Whole Wheat Flour (Atta)",
      "1 cup (60g) Fresh Fenugreek Leaves (Methi, finely chopped)",
      "1/3 cup (80g) Plain Yogurt",
      "1 tbsp White Sesame Seeds & 1 tsp Ajwain",
      "1/2 tsp Turmeric, 1 tsp Red Chilli Powder & 1 tsp Ginger-Chilli Paste",
      "2 tbsp Oil (1 tbsp in dough + 1 tbsp for roasting)"
    ],
    steps: [
      "Combine 240g atta, 60g chopped methi, sesame seeds, ajwain, turmeric, chilli powder, ginger-chilli paste, and salt.",
      "Add 80g yogurt and 1 tbsp oil; knead into a soft, pliable dough using minimal water and rest 15 minutes.",
      "Divide into 8 equal balls and roll each thin like a tortilla.",
      "Roast on a hot tawa for 45 seconds per side, brushing lightly with oil until golden-brown spots appear.",
      "Serve warm with chhundo (sweet mango pickle) or spiced yogurt."
    ],
    profiles: { name: "Chef Jigisha Shah" }
  },
  {
    id: "recipe-gujarat-3",
    title: "Surti Undhiyu (Winter Mixed Veg)",
    description: "Classic Gujarati slow-cooked medley of baby potatoes, purple yam, surti papdi beans, fenugreek muthiyas, and green garlic coconut masala.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-fiber"],
    preparation_time: 55,
    calories: 311,
    protein: 8,
    carbs: 36,
    fat: 15,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Chapdi_Undhiyu_%28Tavo%29.JPG/960px-Chapdi_Undhiyu_%28Tavo%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "250g Surti Papdi (Flat Beans), 150g Purple Yam & 150g Baby Potatoes",
      "100g Methi Muthiya (steamed/lightly fried fenugreek dumplings)",
      "1/2 cup (50g) Fresh Grated Coconut & 1/2 cup Fresh Coriander",
      "3 tbsp Roasted Sesame-Peanut Powder",
      "3 tbsp Oil, 1 tsp Ajwain & Pinch of Asafoetida",
      "2 tbsp Green Garlic-Ginger-Chilli Paste"
    ],
    steps: [
      "Blend grated coconut, coriander, green garlic paste, sesame-peanut powder, cumin, and lemon juice into a vibrant green stuffing masala.",
      "Make cross-slits in baby potatoes and small brinjals and stuff them with half the masala.",
      "Heat 3 tbsp oil in a wide heavy pot; crackle ajwain and asafoetida.",
      "Layer surti papdi, cubed purple yam, stuffed potatoes, and remaining masala; cover and cook on low heat for 25 minutes.",
      "Gently fold in methi muthiyas in the last 5 minutes and steam covered; serve hot with puris."
    ],
    profiles: { name: "Chef Krunal Desai" }
  },
  {
    id: "recipe-gujarat-4",
    title: "Gujarati Baked Handvo",
    description: "Savory, protein-rich fermented lentil-and-rice cake studded with grated bottle gourd, carrots, and topped with crackling sesame-mustard seeds.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "high-fiber"],
    preparation_time: 40,
    calories: 260,
    protein: 11,
    carbs: 36,
    fat: 8,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Handavo3.jpg/960px-Handavo3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "1 cup (180g) Rice + 1/2 cup (90g) Mixed Chana, Toor & Urad Dal (soaked & fermented)",
      "1 cup (120g) Grated Bottle Gourd (Lauki) & 1/2 cup Grated Carrot",
      "1/4 cup (60g) Yogurt & 1 tbsp Ginger-Chilli Paste",
      "2 tbsp Oil, 1 tsp Mustard Seeds & 2 tbsp White Sesame Seeds",
      "10 Curry Leaves, 1/2 tsp Turmeric & 1 tsp Eno Fruit Salt"
    ],
    steps: [
      "Coarsely grind soaked rice and mixed lentils with 60g yogurt and ferment 6–8 hours.",
      "Fold in grated lauki, carrot, ginger-chilli paste, turmeric, and salt.",
      "Stir in 1 tsp Eno right before baking/pan-roasting.",
      "Heat 2 tbsp oil in a heavy skillet, crackle mustard seeds, sesame seeds, and curry leaves; pour batter over the tempering.",
      "Cover and cook on low heat for 12–15 minutes per side (or bake at 190°C for 30 minutes) until crisp golden crust forms."
    ],
    profiles: { name: "Chef Hetal Mehta" }
  },

  // =============================================================
  // KASHMIR (3)
  // =============================================================
  {
    id: "recipe-kashmir-1",
    title: "Authentic Kashmiri Rogan Josh",
    description: "World-renowned Kashmiri lamb curry slow-braised with Kashmiri red chillies, fennel powder, dry ginger, black cardamom, and saffron.",
    state: "Kashmir",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 60,
    calories: 407,
    protein: 33,
    carbs: 8,
    fat: 27,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/43/Mutton_rogan_josh.jpg/960px-Mutton_rogan_josh.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "750g Lamb / Mutton Shoulder (bone-in, 4 servings)",
      "3 tbsp (45ml) Mustard Oil or Ghee",
      "1/2 cup (120g) Whisked Yogurt",
      "2 tbsp Kashmiri Red Chilli Powder (for deep crimson color)",
      "1.5 tsp Fennel Powder (Saunf) & 1 tsp Dry Ginger Powder (Sonth)",
      "3 Black Cardamoms, 1 Cinnamon Stick, 4 Cloves & Pinch of Hing"
    ],
    steps: [
      "Heat 45ml mustard oil until smoking, cool slightly, then temper hing, black cardamoms, cinnamon, and cloves.",
      "Add 750g lamb pieces and sear on high heat for 8 minutes until lightly browned.",
      "Whisk 2 tbsp Kashmiri chilli powder in 1/2 cup warm water and pour over lamb for rich ruby color.",
      "Lower heat, stir in 120g whisked yogurt slowly, plus 1.5 tsp fennel powder and 1 tsp dry ginger powder.",
      "Add 1.5 cups water, cover tightly, and simmer 40 minutes until lamb is fork-tender and oil rises to the top."
    ],
    profiles: { name: "Chef Tariq Wani" }
  },
  {
    id: "recipe-kashmir-2",
    title: "Kashmiri Dum Aloo",
    description: "Golden-fried baby potatoes pierced and slow-simmered in a silky Kashmiri chilli, fennel, dry ginger, and yogurt gravy — zero onion or garlic.",
    state: "Kashmir",
    dietary_type: "vegetarian",
    meal_type: "dinner",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 40,
    calories: 284,
    protein: 6,
    carbs: 38,
    fat: 12,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Dum_Aloo_Kashmiri.jpg/960px-Dum_Aloo_Kashmiri.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "500g Baby Potatoes (par-boiled, peeled & pricked with a fork)",
      "1 cup (240g) Whisked Yogurt",
      "2 tbsp (30ml) Mustard Oil",
      "2 tbsp Kashmiri Red Chilli Powder (dissolved in water)",
      "1.5 tsp Fennel Powder & 1 tsp Dry Ginger Powder",
      "3 Green Cardamoms, 1 Bay Leaf & Pinch of Hing"
    ],
    steps: [
      "Pan-roast or shallow-fry 500g pricked baby potatoes in mustard oil until crisp and golden; set aside.",
      "In 2 tbsp remaining oil, temper hing, green cardamoms, cloves, and bay leaf.",
      "Pour in dissolved Kashmiri chilli paste, then slowly stir in 240g whisked yogurt on low heat.",
      "Add fennel powder, dry ginger powder, and salt; bring to a gentle simmer.",
      "Drop in golden baby potatoes, cover, and dum-cook on low heat for 15 minutes until potatoes absorb the spiced gravy."
    ],
    profiles: { name: "Chef Sunita Kaul" }
  },
  {
    id: "recipe-kashmir-3",
    title: "Kashmiri Chicken Yakhni Pulao",
    description: "Fragrant long-grain basmati rice cooked in an aromatic fennel-cardamom chicken broth (yakhni) with tender chicken, saffron, and toasted almonds.",
    state: "Kashmir",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "high-carbs"],
    preparation_time: 50,
    calories: 454,
    protein: 30,
    carbs: 52,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Chicken_Yakhni_Pulao.jpg/960px-Chicken_Yakhni_Pulao.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "650g Bone-in Chicken",
      "2 cups (380g) Basmati Rice (soaked 30 mins)",
      "1/2 cup (120g) Yogurt",
      "1.5 tbsp Fennel Seeds, 1 tbsp Coriander Seeds & 1 Bay Leaf (tied in muslin)",
      "2 tbsp Pure Ghee & 1 medium (100g) Onion sliced",
      "2 tbsp Slivered Almonds & Saffron in Warm Milk"
    ],
    steps: [
      "Simmer 650g chicken with the muslin spice pouch, 1 sliced onion, ginger, and 4 cups water for 20 minutes to create flavorful yakhni broth.",
      "Strain and reserve both the cooked chicken pieces and aromatic yakhni stock.",
      "Heat 2 tbsp ghee in a pot, lightly sauté chicken with 120g whisked yogurt for 3 minutes.",
      "Add 380g drained basmati rice and 3.5 cups hot yakhni stock; bring to a boil.",
      "Cover tightly and cook on low heat for 12–15 minutes until rice is fluffy; top with saffron milk and toasted almonds."
    ],
    profiles: { name: "Chef Bilal Bhat" }
  },

  // =============================================================
  // GOA (3)
  // =============================================================
  {
    id: "recipe-goa-1",
    title: "Goan Coconut Fish Curry",
    description: "Vibrant coastal Goan curry blending fresh pomfret/kingfish in stone-ground coconut, Kashmiri chilli, tamarind, and tangy kokum petals.",
    state: "Goa",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 315,
    protein: 26,
    carbs: 10,
    fat: 19,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "600g Pomfret or Kingfish Steaks (4 servings)",
      "1 cup (100g) Fresh Grated Coconut",
      "4 Kashmiri Red Chillies & 1 tsp Coriander Seeds",
      "4 Dried Kokum Petals (or 1 tbsp Tamarind Pulp)",
      "1 medium (100g) Onion finely chopped & 2 Slit Green Chillies",
      "1.5 tbsp Coconut Oil & 1/2 tsp Turmeric"
    ],
    steps: [
      "Marinate 600g fish steaks with turmeric and salt for 15 minutes.",
      "Grind 100g fresh coconut, Kashmiri chillies, coriander seeds, turmeric, and garlic into a silky orange paste.",
      "Heat 1.5 tbsp coconut oil in an earthen pot; sauté chopped onion until soft.",
      "Pour in the coconut masala paste with 1.5 cups water and kokum petals; bring to a gentle simmer for 6 minutes.",
      "Slide fish steaks and slit green chillies into the curry; simmer gently for 7 minutes without stirring (swirl the pot instead)."
    ],
    profiles: { name: "Chef Maria Fernandes" }
  },
  {
    id: "recipe-goa-2",
    title: "Goan Chicken Cafreal",
    description: "Herb-packed Indo-Portuguese green chicken marinated in fresh coriander, mint, green chillies, whole spices, and vinegar, then pan-roasted to juicy perfection.",
    state: "Goa",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 35,
    calories: 326,
    protein: 34,
    carbs: 7,
    fat: 18,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Cafreal.jpg/960px-Cafreal.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "700g Chicken Drumsticks & Thighs (slashed)",
      "1.5 cups (60g) Fresh Coriander Leaves + 1/2 cup Mint Leaves",
      "4 Green Chillies, 8 Garlic Cloves & 1 inch Ginger",
      "1 tsp Black Peppercorns, 4 Cloves, 1 Cinnamon Stick & 1 tsp Cumin",
      "2 tbsp Goan Coconut Vinegar (or Apple Cider Vinegar)",
      "2 tbsp Oil & Salt to taste"
    ],
    steps: [
      "Blend coriander, mint, green chillies, garlic, ginger, peppercorns, cloves, cinnamon, cumin, and 2 tbsp vinegar into a vibrant green paste.",
      "Rub the green cafreal masala generously into slashed 700g chicken; marinate 1–2 hours.",
      "Heat 2 tbsp oil in a wide skillet; sear chicken pieces 4 minutes per side until lightly charred.",
      "Cover and cook on medium-low heat for 15 minutes, turning once, until tender and coated in thick green masala.",
      "Serve hot with lime wedges and pan-fried potato rounds."
    ],
    profiles: { name: "Chef Antonio D'Souza" }
  },
  {
    id: "recipe-goa-3",
    title: "Goan Prawn Balchão",
    description: "Tangy, spicy pickled prawn masala cooked with caramelized onions, Kashmiri chillies, roasted spices, and Goan toddy vinegar — bold flavor, high protein.",
    state: "Goa",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 266,
    protein: 26,
    carbs: 9,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Balch%C3%A3o_de_camar%C3%A3o.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    ingredients: [
      "550g Cleaned & Deveined Medium Prawns",
      "6 Kashmiri Red Chillies & 1 tsp Cumin Seeds",
      "3 tbsp Goan Toddy Vinegar (or White Vinegar)",
      "2 medium (160g) Onions finely chopped & 100g Tomato chopped",
      "2 tbsp Oil, 10 Curry Leaves & 1 tsp Sugar"
    ],
    steps: [
      "Grind Kashmiri chillies, cumin, peppercorns, cloves, ginger, and garlic with 3 tbsp vinegar (no water) into a smooth red paste.",
      "Sauté 550g prawns in 1 tbsp oil for 2 minutes until pink; set aside.",
      "Heat remaining 1 tbsp oil, fry curry leaves and 160g chopped onions until deep golden.",
      "Add chopped tomatoes and the vinegar masala paste; cook 6 minutes until oil separates.",
      "Toss in sautéed prawns and 1 tsp sugar; simmer 3–4 minutes until richly glazed."
    ],
    profiles: { name: "Chef Savio Rodrigues" }
  },

  // =============================================================
  // UTTAR PRADESH (4)
  // =============================================================
  {
    id: "recipe-up-1",
    title: "Banarasi Aloo Matar Tikki Chaat",
    description: "Crisp spiced potato-and-green-pea patties smashed and topped with tangy tamarind chutney, mint chutney, whipped yogurt, and roasted cumin.",
    state: "Uttar Pradesh",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 30,
    calories: 298,
    protein: 8,
    carbs: 44,
    fat: 10,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Aloo_Mutter_tikki_chaat_%281%29.JPG/960px-Aloo_Mutter_tikki_chaat_%281%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "4 medium (400g) Boiled Potatoes (mashed)",
      "1/2 cup (75g) Boiled Green Peas (lightly crushed)",
      "2 tbsp Cornflour or Rice Flour (for crisp crust)",
      "1/2 cup (120g) Sweet Whisked Yogurt",
      "3 tbsp Tamarind-Date Chutney & 2 tbsp Mint Chutney",
      "1 tsp Roasted Cumin Powder, Chaat Masala & 2 tbsp Ghee/Oil"
    ],
    steps: [
      "Mix 400g mashed potatoes, 2 tbsp cornflour, ginger, green chillies, and salt; stuff the center with spiced crushed green peas.",
      "Shape into flat round tikkis and shallow-fry in 2 tbsp ghee/oil on a tawa until deep golden and crunchy on both sides.",
      "Place 2 hot tikkis on a serving plate and lightly crack them open.",
      "Drizzle generously with chilled whisked yogurt, sweet tamarind chutney, and spicy green mint chutney.",
      "Sprinkle roasted cumin powder, chaat masala, pomegranate seeds, and crisp sev."
    ],
    profiles: { name: "Chef Rajeshwari Tiwari" }
  },
  {
    id: "recipe-up-2",
    title: "Lucknowi Galouti Kebab",
    description: "Legendary melt-in-the-mouth Awadhi minced meat kebabs tenderized with raw papaya, rose water, saffron, and potli-ka-masala, pan-seared in ghee.",
    state: "Uttar Pradesh",
    dietary_type: "non-vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 45,
    calories: 325,
    protein: 28,
    carbs: 6,
    fat: 21,
    average_rating: 4.9,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Mouth_Watering_Gauloti_Kababs.jpg/960px-Mouth_Watering_Gauloti_Kababs.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "600g Fine Minced Lamb or Chicken",
      "2 tbsp Raw Papaya Paste (natural tenderizer)",
      "3 tbsp Roasted Gram Flour (Bhuna Besan)",
      "2 tbsp Fried Onion Paste & 1.5 tbsp Ginger-Garlic Paste",
      "1 tbsp Lucknowi Garam Masala (Potli Masala) & 1 tsp Rose Water",
      "3 tbsp Pure Desi Ghee for pan-searing"
    ],
    steps: [
      "Combine 600g fine mince with 2 tbsp raw papaya paste, ginger-garlic paste, fried onion paste, potli masala, rose water, and salt.",
      "Mix in 3 tbsp roasted besan as a light binder and refrigerate 1 hour so papaya tenderizes the meat.",
      "Divide into soft, flat round patties with oiled palms.",
      "Heat 3 tbsp ghee on a flat tawa; gently sear kebabs 3 minutes per side on medium-low heat until golden brown.",
      "Serve warm with ulte tawe ka paratha, mint chutney, and pickled onion rings."
    ],
    profiles: { name: "Chef Imran Siddiqui" }
  },
  {
    id: "recipe-up-3",
    title: "Mathura Bedmi Puri & Aloo Bhaji",
    description: "Crisp spiced urad-dal stuffed whole-wheat puris served with tangy, aromatic no-onion-garlic spiced potato curry.",
    state: "Uttar Pradesh",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 35,
    calories: 416,
    protein: 10,
    carbs: 58,
    fat: 16,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Puri_Bhaji.JPG/960px-Puri_Bhaji.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "2 cups (240g) Whole Wheat Flour + 1/3 cup (60g) Coarse Urad Dal Paste",
      "4 medium (400g) Boiled Potatoes (roughly broken)",
      "2 medium (160g) Tomatoes pureed & 1 tsp Amchur",
      "1 tsp Fennel Seeds, 1 tsp Coriander Seeds & Pinch of Hing",
      "2 tbsp Oil for bhaji + Oil for deep-frying puris"
    ],
    steps: [
      "Knead 240g atta, 60g spiced urad dal paste (with fennel, chilli, hing), 1 tbsp oil, and salt into a stiff dough; rest 20 minutes.",
      "For bhaji: heat 2 tbsp oil, crackle cumin, hing, and crushed coriander; add pureed tomatoes and cook 5 minutes.",
      "Toss in 400g broken boiled potatoes, 1.5 cups water, amchur, and garam masala; simmer 10 minutes.",
      "Roll dough into thick puris and deep-fry in hot oil until puffed and crisp golden.",
      "Serve hot puris with tangy aloo bhaji and mango pickle."
    ],
    profiles: { name: "Chef Ananya Mishra" }
  },
  {
    id: "recipe-up-4",
    title: "Awadhi Zafrani Veg Biryani",
    description: "Delicately spiced Lucknowi dum biryani with aged basmati rice, seasonal vegetables, paneer cubes, saffron milk, kewra water, and caramelized onions.",
    state: "Uttar Pradesh",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 50,
    calories: 392,
    protein: 11,
    carbs: 60,
    fat: 12,
    average_rating: 4.8,
    image_url: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8b/Awadhi_Vegetable_Biryani.jpg/960px-Awadhi_Vegetable_Biryani.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    ingredients: [
      "2 cups (380g) Long-Grain Basmati Rice (soaked 30 mins)",
      "350g Mixed Carrot, Beans, Cauliflower, Peas & 100g Paneer Cubes",
      "1/2 cup (120g) Yogurt & 100g Fried Onions",
      "2 tbsp Pure Ghee, 1 pinch Saffron in Warm Milk & 1/2 tsp Kewra Water",
      "1.5 tbsp Awadhi Garam Masala & Fresh Mint"
    ],
    steps: [
      "Sauté 350g mixed vegetables and 100g paneer cubes lightly in 1 tbsp ghee; mix with 120g yogurt, Awadhi masala, and half the fried onions.",
      "Boil 380g soaked basmati rice with bay leaf and cardamom until 75% done; drain.",
      "Layer spiced vegetables at the bottom of a heavy pot and top with par-cooked rice.",
      "Drizzle saffron milk, kewra water, remaining 1 tbsp ghee, fried onions, and mint.",
      "Seal and cook on dum for 15 minutes on low heat; serve with burhani raita."
    ],
    profiles: { name: "Chef Farooq Ahmad" }
  }
];
