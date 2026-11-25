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
  // -------------------------------------------------------------
  // PUNJAB
  // -------------------------------------------------------------
  {
    id: "recipe-punjab-1",
    title: "Amritsari Butter Chicken (Murgh Makhani)",
    description: "Tender chicken morsels roasted in tandoor and simmered in a luscious, velvety tomato-butter gravy scented with kasuri methi.",
    state: "Punjab",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 45,
    calories: 480,
    protein: 38,
    carbs: 14,
    fat: 28,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "750g Boneless Chicken Breast/Thighs",
      "1 cup Fresh Tomato Puree",
      "3 tbsp Butter & 2 tbsp Heavy Cream",
      "1 cup Greek Yogurt (Marinade)",
      "2 tbsp Kasuri Methi (Fenugreek)",
      "1 tbsp Kashmiri Red Chilli & Garam Masala",
      "2 tbsp Ginger-Garlic Paste",
    ],
    steps: [
      "Marinate chicken in yogurt, red chilli, ginger-garlic paste and salt for 1 hour.",
      "Sear marinated chicken in a pan or oven at 200°C for 15 minutes until charred.",
      "In a heavy bottom pan, melt butter, add pureed tomatoes, mild spices, and simmer for 15 minutes.",
      "Add cooked chicken and fresh cream, garnish with toasted kasuri methi and serve warm with naan."
    ],
    profiles: { name: "Chef Harpreet Singh" }
  },
  {
    id: "recipe-punjab-2",
    title: "Classic Dal Makhani",
    description: "Slow-simmered black lentils and kidney beans slow cooked overnight with butter, cream, and aromatic North Indian spices.",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "dinner",
    tags: ["high-fiber", "high-protein"],
    preparation_time: 60,
    calories: 340,
    protein: 16,
    carbs: 42,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1 cup Whole Black Urad Dal",
      "1/4 cup Rajma (Kidney Beans)",
      "2 tbsp Butter & 2 tbsp Fresh Cream",
      "1 cup Tomato Puree",
      "1 tsp Cumin Seeds, Ginger, and Garam Masala",
    ],
    steps: [
      "Soak urad dal and rajma overnight. Pressure cook with salt and water for 6-8 whistles until soft.",
      "Heat butter in a pan, add cumin, ginger-garlic, and tomato puree. Cook until butter separates.",
      "Pour in cooked dal, mash lightly with a ladle, and simmer on low flame for 45 minutes.",
      "Finish with fresh cream, butter, and a pinch of fenugreek leaves."
    ],
    profiles: { name: "Amritsar Dhaba Kitchen" }
  },
  {
    id: "recipe-punjab-3",
    title: "Peshawari Chole Bhature",
    description: "Spicy and tangy chickpea curry infused with tea liquor and dry spices, paired with puffy golden bhaturas.",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 40,
    calories: 520,
    protein: 15,
    carbs: 76,
    fat: 18,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups Kabuli Chana (Chickpeas)",
      "1 Tea Bag (for authentic dark color)",
      "2 tbsp Chole Masala & Anardana Powder",
      "2 cups Flour & 2 tbsp Yogurt (for Bhature)",
      "Onion, Tomatoes, Green Chillies",
    ],
    steps: [
      "Boil soaked chickpeas with a tea bag, bay leaf, and cinnamon until meltingly tender.",
      "Saute finely chopped onions, ginger, and tomato paste with chole masala and anardana powder.",
      "Add cooked chickpeas and simmer for 20 minutes until a rich dark sauce forms.",
      "Roll dough into oval discs and deep fry in hot oil until they puff up golden."
    ],
    profiles: { name: "Chef Gurpreet Dhillon" }
  },
  {
    id: "recipe-punjab-4",
    title: "Tandoori Paneer Tikka",
    description: "High-protein cubes of fresh cottage cheese, bell peppers, and onions tossed in a smoky spiced mustard oil and yogurt marinade.",
    state: "Punjab",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 280,
    protein: 24,
    carbs: 10,
    fat: 16,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "350g Firm Paneer (Cottage Cheese)",
      "1 Green & 1 Red Bell Pepper, diced",
      "1 Red Onion, cubed",
      "1/2 cup Hung Curd (Greek Yogurt)",
      "1 tbsp Smoked Mustard Oil",
      "1 tbsp Chaat Masala & Ajwain (Carom Seeds)",
    ],
    steps: [
      "Mix hung curd, roasted gram flour, mustard oil, ajwain, red chilli, and garam masala.",
      "Coat paneer cubes, peppers, and onions gently in the marinade; chill for 30 minutes.",
      "Thread onto skewers and roast on a hot grill or air-fryer at 200°C for 10-12 minutes.",
      "Sprinkle chaat masala and fresh lemon juice before serving."
    ],
    profiles: { name: "Fitness Chef Rahul" }
  },

  // -------------------------------------------------------------
  // MAHARASHTRA
  // -------------------------------------------------------------
  {
    id: "recipe-maha-1",
    title: "Mumbai Iconic Vada Pav",
    description: "The definitive heart of Mumbai street food — spiced mashed potato ball coated in crispy chickpea batter inside buttered pav with spicy garlic chutney.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-carbs"],
    preparation_time: 25,
    calories: 290,
    protein: 8,
    carbs: 44,
    fat: 10,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "4 Boiled Potatoes, mashed",
      "1 cup Besan (Chickpea Flour)",
      "Mustard Seeds, Curry Leaves, Green Chillies",
      "Dry Red Garlic Chutney & Green Mint Chutney",
      "4 Fresh Ladi Pav",
    ],
    steps: [
      "Temper mustard seeds, curry leaves, ginger, and turmeric; mix thoroughly into mashed potatoes.",
      "Shape into spheres and dip in seasoned chickpea flour batter.",
      "Deep fry in hot oil until light golden and crispy.",
      "Slice pav, slather with spicy red garlic chutney, insert hot vada, and serve with fried chillies."
    ],
    profiles: { name: "Shivaji Park Street Kitchen" }
  },
  {
    id: "recipe-maha-2",
    title: "Kolhapuri Chicken Sukka",
    description: "Fiery Maharashtrian chicken pan-roast packed with toasted coconut, stone flower, and freshly ground Kolhapuri lavangi masala.",
    state: "Maharashtra",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 40,
    calories: 380,
    protein: 36,
    carbs: 8,
    fat: 22,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "600g Tender Bone-in Chicken",
      "1/2 cup Dry Roasted Coconut (Khobro)",
      "2 tbsp Kolhapuri Kanda-Lasun Masala",
      "2 Finely sliced Onions",
      "Fresh Coriander, Ginger, and Garlic",
    ],
    steps: [
      "Marinate chicken in turmeric, ginger-garlic paste and sea salt for 20 minutes.",
      "Dry roast coconut, coriander seeds, cloves, and black pepper; blend into a coarse paste.",
      "Brown sliced onions in oil, add chicken, and sear on high heat for 6 minutes.",
      "Add roasted coconut paste, cover and cook in its own juices until thick and dry."
    ],
    profiles: { name: "Chef Tanvi Shinde" }
  },
  {
    id: "recipe-maha-3",
    title: "Spicy Kolhapuri Misal Pav",
    description: "High-protein sprouted moth bean curry simmered with fiery 'kat' gravy, garnished with farsan, chopped onions, and lemon.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-protein", "high-fiber", "gym-diet"],
    preparation_time: 30,
    calories: 340,
    protein: 15,
    carbs: 48,
    fat: 10,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups Sprouted Matki (Moth Beans)",
      "1 cup Farsan (Crispy Savory Mix)",
      "2 tbsp Misal Masala & Red Chilli Powder",
      "Onion, Coconut, and Ginger-Garlic Paste",
      "Warm Pav bread & Lemon wedges",
    ],
    steps: [
      "Boil sprouted moth beans with turmeric and salt until tender.",
      "Cook spiced onion-coconut paste in oil until oil surfaces (forming the spicy rassa/kat).",
      "Assemble: layer cooked sprouts in a bowl, ladle fiery hot kat on top, and crown with crunchy farsan and diced onions.",
      "Serve piping hot with fresh soft pav."
    ],
    profiles: { name: "Chef Aakash Patil" }
  },
  {
    id: "recipe-maha-4",
    title: "Mumbai Style Pav Bhaji",
    description: "Rich buttery blend of spiced mashed seasonal vegetables cooked on a huge flat iron griddle, served with toasted butter pav.",
    state: "Maharashtra",
    dietary_type: "vegetarian",
    meal_type: "dinner",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 35,
    calories: 380,
    protein: 9,
    carbs: 58,
    fat: 14,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "3 Potatoes, 1/2 Cauliflower, 1/2 cup Green Peas, boiled",
      "2 Bell Peppers & 3 Tomatoes, finely diced",
      "3 tbsp Pav Bhaji Masala",
      "4 tbsp Salted Amul Butter",
      "Fresh Pav, chopped coriander, and onions",
    ],
    steps: [
      "Boil potatoes, cauliflower, and green peas; mash thoroughly with a potato masher.",
      "Melt butter on a pan, saute diced onions, bell peppers, tomatoes, and pav bhaji masala.",
      "Combine the mashed veggies, add a dash of water and extra butter, and simmer for 15 minutes.",
      "Serve with hot butter-griddled pav and fresh lemon wedges."
    ],
    profiles: { name: "Juhu Chowpatty Kitchen" }
  },

  // -------------------------------------------------------------
  // TAMIL NADU & SOUTH INDIA
  // -------------------------------------------------------------
  {
    id: "recipe-south-1",
    title: "Crispy Mysore Masala Dosa",
    description: "Crispy fermented rice and lentil crepe smeared with spicy red garlic chutney and stuffed with seasoned potato masala.",
    state: "Tamil Nadu",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 30,
    calories: 310,
    protein: 8,
    carbs: 52,
    fat: 8,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups Fermented Dosa Batter",
      "2 Boiled Potatoes, tempered with mustard and curry leaves",
      "2 tbsp Spicy Mysore Red Chutney",
      "Ghee or Sesame Oil for roasting",
      "Fresh Coconut Chutney & Piping Hot Sambar",
    ],
    steps: [
      "Pour a ladle of batter onto a hot cast-iron tawa and spread outward into a thin circle.",
      "Drizzle ghee around the edges; spread a spoonful of red spicy chutney over the surface.",
      "Place spiced potato filling in the center, fold when the bottom turns golden-crisp.",
      "Serve immediately with fresh coconut chutney and vegetable sambar."
    ],
    profiles: { name: "Madras Tiffin Room" }
  },
  {
    id: "recipe-south-2",
    title: "Chettinad Pepper Chicken",
    description: "Legendary Chettinad style chicken pan-roast loaded with freshly crushed black peppercorns, curry leaves, and fennel.",
    state: "Tamil Nadu",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 35,
    calories: 390,
    protein: 35,
    carbs: 9,
    fat: 23,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "600g Chicken, cut into bite-sized pieces",
      "2 tbsp Freshly crushed Black Peppercorns",
      "1 tbsp Fennel Seeds & Cumin Seeds",
      "Generous handful of fresh Curry Leaves",
      "Small Shallots (Sambar Onions) & Garlic",
    ],
    steps: [
      "Dry roast black pepper, fennel, and cumin; grind into a coarse aromatic masala.",
      "Saute shallots and curry leaves in sesame oil until caramelized.",
      "Add chicken and ground pepper masala, cook on high flame for 5 minutes.",
      "Lower heat, cover and simmer until chicken is tender and coated in black pepper glaze."
    ],
    profiles: { name: "Chef Karthik Raman" }
  },
  {
    id: "recipe-south-3",
    title: "Steamed Soft Idli with Vegetable Sambar",
    description: "Pillowy, fermented steamed cakes of rice and urad dal served with protein-rich lentil vegetable sambar. The quintessential healthy Indian breakfast.",
    state: "Tamil Nadu",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["gym-diet", "high-fiber"],
    preparation_time: 20,
    calories: 210,
    protein: 10,
    carbs: 40,
    fat: 2,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "3 cups Idli Rice & 1 cup Urad Dal (fermented batter)",
      "1 cup Toor Dal (for Sambar)",
      "Drumstick, Carrots, Shallots, and Pumpkin",
      "2 tbsp Sambar Masala & Tamarind pulp",
    ],
    steps: [
      "Pour fermented batter into greased idli molds; steam for 10-12 minutes until light and fluffy.",
      "Boil toor dal with vegetables, turmeric, and sambar powder.",
      "Add tamarind extract and temper with mustard, curry leaves, and asafoetida.",
      "Serve warm idlis dunked in steaming sambar."
    ],
    profiles: { name: "Sangeetha Heritage Kitchen" }
  },

  // -------------------------------------------------------------
  // ANDHRA PRADESH & TELANGANA
  // -------------------------------------------------------------
  {
    id: "recipe-andhra-1",
    title: "Hyderabadi Chicken Dum Biryani",
    description: "Aromatic long-grain basmati rice and marinated chicken slow cooked on 'dum' with saffron, caramelised onions, and fresh mint.",
    state: "Andhra Pradesh",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "high-carbs"],
    preparation_time: 55,
    calories: 560,
    protein: 32,
    carbs: 64,
    fat: 20,
    average_rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "750g Chicken pieces, marinated in yogurt and spices",
      "2.5 cups Aged Basmati Rice (70% parboiled)",
      "1 cup Birista (Golden fried onions)",
      "1/4 cup Saffron milk & Pure Ghee",
      "Star anise, Shahi Jeera, Cardamom, and Mint leaves",
    ],
    steps: [
      "Marinate chicken with yogurt, ginger-garlic, biryani masala, and mint for 2 hours.",
      "Layer the marinated chicken at the bottom of a heavy handi; top with parboiled aromatic rice.",
      "Drizzle saffron milk, pure ghee, fried onions, and seal lid with dough.",
      "Cook on high heat for 10 minutes, then low heat on a tawa for 25 minutes for perfect steam infusion."
    ],
    profiles: { name: "Nizam Royal Kitchen" }
  },
  {
    id: "recipe-andhra-2",
    title: "Andhra Chilli Chicken",
    description: "Fiery green chilli-infused chicken stir fry with garlic, curry leaves, and a tangy tamarind kick.",
    state: "Andhra Pradesh",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 310,
    protein: 34,
    carbs: 6,
    fat: 16,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "500g Boneless Chicken Cubes",
      "10-12 Spicy Green Chillies, slit",
      "2 tbsp Soya Sauce & 1 tbsp Vinegar",
      "1 tbsp Cornstarch (light coating)",
      "Generous curry leaves and garlic",
    ],
    steps: [
      "Lightly coat chicken in cornstarch, egg white, salt, and flash fry for 4 minutes.",
      "In a wok, heat oil, toss slit green chillies, garlic, and curry leaves until fragrant.",
      "Toss chicken in the wok with light soya sauce and black pepper on intense heat.",
      "Serve piping hot as a high-protein dinner or appetizer."
    ],
    profiles: { name: "Chef Srinivas Rao" }
  },

  // -------------------------------------------------------------
  // RAJASTHAN
  // -------------------------------------------------------------
  {
    id: "recipe-raj-1",
    title: "Authentic Dal Baati Churma",
    description: "Traditional baked whole wheat dough balls drenched in pure desi ghee, served with panchmel dal and sweet jaggery churma.",
    state: "Rajasthan",
    dietary_type: "vegetarian",
    meal_type: "lunch",
    tags: ["high-carbs", "high-fiber"],
    preparation_time: 50,
    calories: 580,
    protein: 14,
    carbs: 82,
    fat: 22,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups Coarse Whole Wheat Flour & Sooji",
      "1/2 cup Ghee for knead and dipping",
      "Panchmel Dal (Mix of 5 lentils: Moong, Chana, Toor, Urad, Masoor)",
      "1/2 cup Jaggery and Cardamom for Churma",
    ],
    steps: [
      "Knead tight dough with wheat flour, ghee, and ajwain; shape into round baatis.",
      "Bake baatis in a tandoor or oven at 200°C until golden and cracked.",
      "Dip hot crushed baatis generously in warm desi ghee.",
      "Pair with spicy 5-lentil dal and sweet powdered churma."
    ],
    profiles: { name: "Marwar Palace Chef" }
  },
  {
    id: "recipe-raj-2",
    title: "Rajasthani Laal Maas",
    description: "Legendary royal Rajput warrior mutton curry simmered with Mathania dry red chillies, garlic, and mustard oil.",
    state: "Rajasthan",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 60,
    calories: 420,
    protein: 36,
    carbs: 8,
    fat: 26,
    average_rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "750g Mutton (Goat Meat) pieces",
      "15 Mathania Dried Red Chillies (soaked & pureed)",
      "1 cup Whisked Yogurt",
      "3 tbsp Mustard Oil & 2 tbsp Ghee",
      "Whole cloves, cardamom, and garlic paste",
    ],
    steps: [
      "Heat mustard oil to smoking point; crackle whole garam masalas and sliced onions.",
      "Add mutton pieces and sear on high heat until browned.",
      "Stir in Mathania red chilli paste and garlic; cook until the vibrant red oil surfaces.",
      "Slow simmer on low heat with whisked yogurt for 45 minutes until meat falls off the bone."
    ],
    profiles: { name: "Udaipur Heritage Kitchen" }
  },

  // -------------------------------------------------------------
  // WEST BENGAL
  // -------------------------------------------------------------
  {
    id: "recipe-bengal-1",
    title: "Bengali Machher Jhol",
    description: "Light, comforting Rohu/Katla fish curry cooked with potato wedges, cauliflower, turmeric, and freshly tempered kalonji.",
    state: "West Bengal",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 30,
    calories: 260,
    protein: 28,
    carbs: 12,
    fat: 10,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "500g Fresh Rohu or Katla Fish Steaks",
      "2 Potatoes, cut into wedges",
      "1 tsp Kalonji (Nigella seeds)",
      "Fresh Green Chillies, Turmeric, and Cumin paste",
      "Mustard Oil for shallow fry and gravy",
    ],
    steps: [
      "Marinate fish steaks with turmeric and sea salt; shallow fry lightly in mustard oil.",
      "In the remaining oil, temper nigella seeds and green chillies; sauté potato wedges.",
      "Add cumin-turmeric paste with water, cover, and cook until potatoes are tender.",
      "Slide in the fried fish and simmer gently for 5 minutes. Serve with hot steamed rice."
    ],
    profiles: { name: "Chef Debolina Sen" }
  },
  {
    id: "recipe-bengal-2",
    title: "Kolkata Egg Chicken Roll",
    description: "Flaky paratha layered with fried egg, juicy spiced chicken tikka strips, sliced red onions, and tangy green chilli sauce.",
    state: "West Bengal",
    dietary_type: "non-vegetarian",
    meal_type: "snacks",
    tags: ["high-protein"],
    preparation_time: 25,
    calories: 410,
    protein: 22,
    carbs: 46,
    fat: 15,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 Whole Wheat Parathas",
      "2 Eggs, beaten",
      "250g Cooked Boneless Chicken strips",
      "Thinly sliced onions & fresh green chillies",
      "Chaat masala and lemon juice",
    ],
    steps: [
      "Cook paratha on a hot tawa; flip and pour beaten egg directly over it, cooking until set.",
      "Place warm egg paratha on butter paper; arrange spiced chicken strips along the center.",
      "Scatter crunchy onions, green chillies, chaat masala, and a dash of lemon juice.",
      "Roll tightly in butter paper and enjoy street-style on the go."
    ],
    profiles: { name: "Park Street Rolls" }
  },

  // -------------------------------------------------------------
  // GUJARAT
  // -------------------------------------------------------------
  {
    id: "recipe-gujarat-1",
    title: "Steamed Nylon Khaman Dhokla",
    description: "Ultra-spongy, juicy steamed chickpea flour cakes tempered with mustard seeds, curry leaves, and green chillies. Light, healthy, and low in calories.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "breakfast",
    tags: ["gym-diet", "high-fiber"],
    preparation_time: 20,
    calories: 160,
    protein: 8,
    carbs: 26,
    fat: 3,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1.5 cups Besan (Fine Gram Flour)",
      "1 tsp Eno fruit salt & pinch of Turmeric",
      "1 tbsp Lemon juice & Sugar",
      "Mustard seeds, green chillies, and curry leaves for tadka",
      "Grated fresh coconut and chopped coriander",
    ],
    steps: [
      "Whisk besan with water, ginger-chilli paste, lemon juice, and a pinch of turmeric.",
      "Add Eno fruit salt, whisk rapidly until frothy, and pour immediately into a greased pan.",
      "Steam for 15 minutes on medium flame until an inserted toothpick emerges clean.",
      "Pour hot sweet-tangy mustard tadka water evenly over the sliced dhokla."
    ],
    profiles: { name: "Ahmedabad Farsan House" }
  },
  {
    id: "recipe-gujarat-2",
    title: "Gujarati Methi Thepla",
    description: "Soft, fragrant flatbreads made with fresh fenugreek leaves, whole wheat flour, and warm spices. Perfect for travel and high in dietary fiber.",
    state: "Gujarat",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-fiber", "gym-diet"],
    preparation_time: 20,
    calories: 190,
    protein: 6,
    carbs: 32,
    fat: 5,
    average_rating: 4.8,
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "2 cups Whole Wheat Flour",
      "1 cup Fresh Methi (Fenugreek) Leaves, finely chopped",
      "2 tbsp Yogurt & 1 tbsp Sesame Seeds (Til)",
      "Ajwain, Turmeric, and Red Chilli Powder",
    ],
    steps: [
      "Knead wheat flour with washed methi leaves, yogurt, spices, and a little oil into a soft dough.",
      "Roll into thin circular discs.",
      "Cook on a medium hot griddle with a few drops of oil until golden brown spots appear on both sides.",
      "Serve with mango pickle (chhunda) and plain yogurt."
    ],
    profiles: { name: "Chef Dipti Mehta" }
  },

  // -------------------------------------------------------------
  // KASHMIR
  // -------------------------------------------------------------
  {
    id: "recipe-kashmir-1",
    title: "Authentic Kashmiri Rogan Josh",
    description: "The crown jewel of Kashmiri Wazwan — succulent lamb slow braised in aromatic Kashmiri red chilli oil, fennel powder, and dried ginger.",
    state: "Kashmir",
    dietary_type: "non-vegetarian",
    meal_type: "dinner",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 55,
    calories: 410,
    protein: 34,
    carbs: 8,
    fat: 25,
    average_rating: 5.0,
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "750g Mutton/Lamb Shoulder, bone-in",
      "2 tbsp Kashmiri Red Chilli Powder (Ratanjot optional)",
      "1.5 tbsp Fennel Seed (Saunf) powder",
      "1 tsp Dry Ginger (Sonth) powder",
      "1/2 cup Whisked Yogurt & Mustard Oil",
    ],
    steps: [
      "Heat mustard oil, brown the meat pieces with green and black cardamoms and cloves.",
      "Lower heat, whisk in yogurt, and stir continuously until incorporated.",
      "Mix Kashmiri red chilli powder with warm water; pour into the pan to give the signature red color.",
      "Add ground fennel and dry ginger, cover tightly, and slow-cook on low flame for 45 minutes."
    ],
    profiles: { name: "Wazwan Master Ghulam" }
  },

  // -------------------------------------------------------------
  // GOA & COASTAL
  // -------------------------------------------------------------
  {
    id: "recipe-goa-1",
    title: "Goan Coconut Prawn Curry",
    description: "Plump juicy prawns simmered in a velvety coconut milk gravy spiked with raw mango, fresh coriander, and spicy Kashmiri chillies.",
    state: "Goa",
    dietary_type: "non-vegetarian",
    meal_type: "lunch",
    tags: ["high-protein", "gym-diet"],
    preparation_time: 25,
    calories: 330,
    protein: 31,
    carbs: 10,
    fat: 18,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "500g Jumbo Tiger Prawns, peeled & deveined",
      "1 cup Fresh Coconut Milk",
      "1/2 cup Grated Coconut ground with dried chillies & coriander seeds",
      "2 Kokum rinds or Raw Mango slices",
      "Fresh ginger, garlic, and turmeric",
    ],
    steps: [
      "Season cleaned prawns with turmeric and sea salt.",
      "Simmer the freshly ground coconut spice paste with kokum and a little water for 8 minutes.",
      "Pour in thick coconut milk and bring to a gentle simmer.",
      "Add prawns and cook for exactly 4-5 minutes until plump and tender. Serve with rice."
    ],
    profiles: { name: "Chef Maria Fernandes" }
  },

  // -------------------------------------------------------------
  // UTTAR PRADESH
  // -------------------------------------------------------------
  {
    id: "recipe-up-1",
    title: "Moradabadi High-Protein Moong Dal Chaat",
    description: "Nutritious, high-fiber, high-protein steamed yellow moong dal served piping hot with lemon, raw onions, and zesty chutneys. A gym enthusiast favorite.",
    state: "Uttar Pradesh",
    dietary_type: "vegetarian",
    meal_type: "snacks",
    tags: ["high-protein", "high-fiber", "gym-diet"],
    preparation_time: 20,
    calories: 210,
    protein: 18,
    carbs: 32,
    fat: 3,
    average_rating: 4.9,
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    ingredients: [
      "1 cup Yellow Moong Dal, washed and boiled soft",
      "1 tbsp Cumin and Chaat Masala",
      "1 tbsp Mint-Coriander Chutney",
      "Chopped Onions, Tomatoes, and Green Chillies",
      "Squeeze of fresh Lemon & a dab of Butter",
    ],
    steps: [
      "Pressure cook moong dal with turmeric and salt until velvety and soft.",
      "Ladle hot dal into bowls, add a small touch of butter or ghee.",
      "Top with fresh crunchy onions, tomatoes, green chillies, and chaat masala.",
      "Drizzle tangy mint chutney and lemon juice for an energizing high-protein snack."
    ],
    profiles: { name: "Chef Vikram Verma" }
  }
];
