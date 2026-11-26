import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from '@/components/RecipeCard';
import { FAMOUS_RECIPES, FamousRecipe } from '@/data/famousRecipes';
import {
  Search,
  Plus,
  SlidersHorizontal,
  ArrowRight,
  ChefHat,
  Utensils,
  Sparkles,
  ShieldCheck,
  Flame,
  Star,
  CheckCircle2,
  Dumbbell,
  Wheat,
  Activity,
  MapPin,
  X,
  Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthPromptDialog } from '@/components/AuthPromptDialog';
import authHero from '@/assets/auth-hero.jpg';

const INDIAN_STATES = [
  'All States',
  'Punjab',
  'Maharashtra',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Rajasthan',
  'West Bengal',
  'Gujarat',
  'Kashmir',
  'Goa',
  'Uttar Pradesh',
];

const HEALTH_GOALS = [
  { id: 'all', label: 'All Diets', icon: Activity },
  { id: 'high-protein', label: 'High Protein', icon: Dumbbell },
  { id: 'gym-diet', label: 'Gym Diet', icon: Flame },
  { id: 'high-fiber', label: 'High Fiber', icon: Wheat },
  { id: 'high-carbs', label: 'High Carbs', icon: Sparkles },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const recipesSectionRef = useRef<HTMLDivElement>(null);

  // Recipes state
  const [allRecipes, setAllRecipes] = useState<any[]>(FAMOUS_RECIPES);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'vegetarian' | 'non-vegetarian'>('all');
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('All States');
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Auth Dialog trigger for unauthenticated uploads
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogAction, setAuthDialogAction] = useState<'upload' | 'general' | 'favorite'>('general');

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id, title, description, ingredients, preparation_time, image_url,
          average_rating, author_id, meal_type, dietary_type, tags, state,
          calories, protein, carbs, fat,
          profiles:author_id (name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, using curated database:', error);
        setAllRecipes(FAMOUS_RECIPES);
      } else if (data && data.length > 0) {
        // Keep only community user-submitted recipes from DB; curated 38 dishes come from FAMOUS_RECIPES
        const MASTER_CHEF_ID = '00000000-0000-0000-0000-000000000001';
        const curatedTitles = new Set(FAMOUS_RECIPES.map((r) => r.title.trim().toLowerCase()));
        const curatedIds = new Set(FAMOUS_RECIPES.map((r) => r.id));
        const communityOnly = data.filter(
          (r: any) =>
            r.author_id !== MASTER_CHEF_ID &&
            r.profiles?.name !== 'Master Chef Rebel' &&
            !curatedIds.has(r.id) &&
            !curatedTitles.has((r.title || '').trim().toLowerCase())
        );
        setAllRecipes([...FAMOUS_RECIPES, ...communityOnly]);
      } else {
        setAllRecipes(FAMOUS_RECIPES);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setAllRecipes(FAMOUS_RECIPES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  // Reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dietaryFilter, mealTypeFilter, healthFilter, stateFilter, maxPrepTime, sortBy]);

  const scrollToRecipes = () => {
    recipesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUploadClick = () => {
    if (!user) {
      setAuthDialogAction('upload');
      setAuthDialogOpen(true);
      return;
    }
    navigate('/upload');
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setDietaryFilter('all');
    setMealTypeFilter('all');
    setHealthFilter('all');
    setStateFilter('All States');
    setMaxPrepTime(120);
    setSortBy('newest');
  };

  const activeFiltersCount = [
    dietaryFilter !== 'all',
    mealTypeFilter !== 'all',
    healthFilter !== 'all',
    stateFilter !== 'All States',
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  // Filter and Sort Engine
  const filteredRecipes = allRecipes
    .filter((recipe) => {
      // 1. Search Query (matches title, ingredients, state, or tags)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        (recipe.state && recipe.state.toLowerCase().includes(q)) ||
        recipe.ingredients.some((ing: string) => ing.toLowerCase().includes(q)) ||
        (recipe.tags && recipe.tags.some((t: string) => t.toLowerCase().includes(q)));

      // 2. Dietary Filter (Vegetarian vs Non-Vegetarian)
      const matchesDietary =
        dietaryFilter === 'all' ||
        (dietaryFilter === 'vegetarian' && recipe.dietary_type !== 'non-vegetarian') ||
        (dietaryFilter === 'non-vegetarian' && recipe.dietary_type === 'non-vegetarian');

      // 3. Meal Type (Breakfast, Lunch, Snacks, Dinner)
      const matchesMeal =
        mealTypeFilter === 'all' || recipe.meal_type === mealTypeFilter;

      // 4. Health / Fitness Tag Filter (high-protein, gym-diet, high-fiber, high-carbs)
      const matchesHealth =
        healthFilter === 'all' ||
        (recipe.tags && recipe.tags.includes(healthFilter));

      // 5. State / Region Filter
      const matchesState =
        stateFilter === 'All States' || recipe.state === stateFilter;

      // 6. Max Prep Time
      const matchesTime = recipe.preparation_time <= maxPrepTime;

      return matchesSearch && matchesDietary && matchesMeal && matchesHealth && matchesState && matchesTime;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.average_rating || 0) - (a.average_rating || 0);
      }
      if (sortBy === 'time') {
        return a.preparation_time - b.preparation_time;
      }
      if (sortBy === 'protein') {
        return (b.protein || 0) - (a.protein || 0);
      }
      return 0; // Default: newest
    });

  return (
    <div className="min-h-screen">
      {/* ======================================================== */}
      {/* 1. HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-card via-background to-background pt-8 pb-16 md:py-24 border-b">
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 15% 30%, hsl(24 95% 53% / 0.35), transparent 45%), radial-gradient(circle at 85% 60%, hsl(38 92% 50% / 0.25), transparent 45%)'
        }} />

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Famous Indian Regional Cuisine & AI Nutrition</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight leading-[1.08] text-foreground">
                Taste India.<br />
                <span className="text-primary">Share Recipes.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover iconic dishes from Punjab, Maharashtra, Tamil Nadu, Bengal, and across India. Filter by <strong>Gym Diet</strong>, <strong>High Protein</strong>, or <strong>High Fiber</strong> with 100% verified photography and exact macro breakdowns.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  onClick={scrollToRecipes}
                  className="shadow-warm h-12 px-7 text-base font-medium rounded-xl gap-2"
                >
                  <Utensils className="h-4 w-4" />
                  Explore Famous Dishes
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleUploadClick}
                  className="h-12 px-7 text-base font-medium rounded-xl border-border hover:bg-muted/60 gap-2"
                >
                  <Plus className="h-4 w-4 text-primary" />
                  Share a Recipe
                </Button>
              </div>

              {/* Key Trust Signals */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                    10+ States
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Iconic Cuisines
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-primary">
                    100% Accurate
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    High-Res Dish Photos
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-1">
                    4.9 <Star className="h-4 w-4 fill-accent text-accent inline" />
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Chef Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card (Famous Vegetarian Dish) */}
            <div className="lg:col-span-5 relative">
              <div
                onClick={() => navigate('/recipe/recipe-punjab-4')}
                className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-border/80 bg-card group cursor-pointer"
              >
                <img
                  src="https://rxtzrpvaaumxwtulkmgy.supabase.co/storage/v1/object/public/recipe-images/curated/recipe-punjab-4.jpg"
                  alt="Authentic Tandoori Paneer Tikka"
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Floating Micro-Badge */}
                <div className="absolute top-4 right-4 backdrop-blur-md bg-black/60 border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Veg · Punjab Classic · 23g Protein</span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Featured Vegetarian Dish
                  </span>
                  <h3 className="text-xl font-display font-bold leading-tight">
                    Tandoori Paneer Tikka
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/80 pt-1">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-primary" /> 294 kcal
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Dumbbell className="h-3 w-3 text-emerald-400" /> 23g Protein
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" /> 4.8 Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE RECIPE EXPLORER & COMPREHENSIVE FILTER ENGINE */}
      {/* ======================================================== */}
      <section ref={recipesSectionRef} id="explore-recipes" className="py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-display font-bold">
                  Famous Regional & Fitness Recipes
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Filter by Indian state, dietary preference, fitness goals (Gym Diet, High Protein, Fiber), and meal types.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[170px] h-10 font-medium">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Featured & Newest</SelectItem>
                  <SelectItem value="rating">Top Rated (★)</SelectItem>
                  <SelectItem value="protein">Highest Protein</SelectItem>
                  <SelectItem value="time">Quickest Prep</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ======================================================== */}
          {/* FILTER CONTROL CENTER */}
          {/* ======================================================== */}
          <div className="bg-card border rounded-2xl p-5 shadow-card mb-8 space-y-4">
            {/* Row 1: Search Bar + State Dropdown + Vegetarian Toggle */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by dish name, state (e.g. Punjab, Maharashtra), or ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-muted/30 border-border/70"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* State Filter */}
              <Select value={stateFilter} onValueChange={setStateFilter}>
                <SelectTrigger className="w-full lg:w-[200px] h-11 bg-muted/30 font-medium">
                  <MapPin className="h-4 w-4 text-primary mr-1 flex-shrink-0" />
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Dietary Toggle (All / Vegetarian / Non-Vegetarian) */}
              <div className="flex p-1 bg-muted/60 rounded-xl items-center border self-start lg:self-auto w-full sm:w-auto">
                <button
                  onClick={() => setDietaryFilter('all')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-smooth ${
                    dietaryFilter === 'all'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('vegetarian')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth ${
                    dietaryFilter === 'vegetarian'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Veg Only
                </button>
                <button
                  onClick={() => setDietaryFilter('non-vegetarian')}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth ${
                    dietaryFilter === 'non-vegetarian'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Non-Veg
                </button>
              </div>

              {/* Filter Drawer Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`h-11 w-11 ${showFilters ? 'bg-primary/10 border-primary/40 text-primary' : ''}`}
                title="Toggle Advanced Prep Time Filter"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Row 2: Health & Fitness Category Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Health & Fitness Categories
              </span>
              <div className="flex flex-wrap gap-2">
                {HEALTH_GOALS.map((goal) => {
                  const Icon = goal.icon;
                  const isActive = healthFilter === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setHealthFilter(goal.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-smooth border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Meal Type Pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                Meal Type
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Meals' },
                  { id: 'breakfast', label: 'Breakfast' },
                  { id: 'lunch', label: 'Lunch' },
                  { id: 'snacks', label: 'Snacks & Street Food' },
                  { id: 'dinner', label: 'Dinner' },
                ].map((meal) => (
                  <button
                    key={meal.id}
                    onClick={() => setMealTypeFilter(meal.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-smooth border ${
                      mealTypeFilter === meal.id
                        ? 'bg-foreground text-background border-foreground font-semibold shadow-sm'
                        : 'bg-muted/40 text-muted-foreground border-transparent hover:text-foreground'
                    }`}
                  >
                    {meal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Prep Time Filter */}
            {showFilters && (
              <div className="pt-3 border-t border-border/50 max-w-sm">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span className="text-muted-foreground">Max Cooking Time</span>
                  <span className="text-primary font-bold">{maxPrepTime} minutes</span>
                </div>
                <Slider
                  value={[maxPrepTime]}
                  onValueChange={(val) => setMaxPrepTime(val[0])}
                  min={5}
                  max={180}
                  step={5}
                />
              </div>
            )}
          </div>

          {/* Active Filter Indicators & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground mb-6 px-1">
            <div className="flex items-center gap-2">
              <span>
                Found <strong>{filteredRecipes.length}</strong> matching dishes
              </span>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAllFilters}
                  className="h-7 text-xs text-primary hover:text-primary/80 gap-1 px-2"
                >
                  <X className="h-3 w-3" /> Clear All Filters ({activeFiltersCount})
                </Button>
              )}
            </div>

            {!user && (
              <span className="italic hidden sm:inline">
                💡 Anyone can browse! Sign in only when you want to bookmark, rate, or comment.
              </span>
            )}
          </div>

          {/* Recipe Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border bg-card overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-2xl border p-8">
              <ChefHat className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="font-display font-semibold text-xl mb-1">
                No recipes match your selected filters
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Try switching the state, selecting "All Meals", or resetting the dietary filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAllFilters}
                className="gap-2"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes
                  .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                  .map((recipe) => (
                    <div key={recipe.id} className="transition-all">
                      <RecipeCard recipe={recipe} />
                    </div>
                  ))}
              </div>

              {filteredRecipes.length > ITEMS_PER_PAGE && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      className="w-9"
                      onClick={() => {
                        setCurrentPage(page);
                        document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE)}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE), p + 1));
                      document.getElementById('recipes-grid')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PRODUCT & PLATFORM HIGHLIGHTS */}
      {/* ======================================================== */}
      <section className="py-16 bg-card/50 border-t border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Trust & Transparency
            </span>
            <h2 className="text-3xl font-display font-bold">
              Why Food Lovers Choose SwadBook
            </h2>
            <p className="text-sm text-muted-foreground">
              Every dish is authenticated, tagged with nutritional macros, and paired with smart AI culinary assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border shadow-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                📍
              </div>
              <h3 className="font-display font-bold text-base">Regional Authenticity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                From Amritsari kulchas to Chettinad pepper chicken, explore true state recipes with zero dilution.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border shadow-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl">
                💪
              </div>
              <h3 className="font-display font-bold text-base">Gym & Fitness Focused</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Filter by high-protein or gym diet options with exact protein and carb counts for clean muscle building.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border shadow-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <h3 className="font-display font-bold text-base">100% Admin Verified</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every community submission passes through our admin moderation queue before getting listed on the feed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border shadow-card space-y-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                🤖
              </div>
              <h3 className="font-display font-bold text-base">Gemini AI Dietician</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instant nutritional guidance, personalized diet plans, and ingredient swaps 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Prompt Dialog for Unauthenticated Users */}
      <AuthPromptDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        action={authDialogAction}
      />
    </div>
  );
}
