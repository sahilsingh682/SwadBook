import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/RecipeCard';
import { Search, Plus, SlidersHorizontal, ArrowRight, ChefHat, Utensils, Sparkles } from 'lucide-react';
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

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  preparation_time: number;
  image_url: string | null;
  average_rating: number | null;
  author_id: string;
  meal_type: string | null;
  profiles: {
    name: string;
  };
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealTypeFilter, setMealTypeFilter] = useState<string>('all');
  const [maxPrepTime, setMaxPrepTime] = useState<number>(120);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`*, profiles:author_id (name)`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.some((ing) => ing.toLowerCase().includes(query));
    const matchesMealType = mealTypeFilter === 'all' || recipe.meal_type === mealTypeFilter;
    const matchesPrepTime = recipe.preparation_time <= maxPrepTime;
    return matchesSearch && matchesMealType && matchesPrepTime;
  });

  // Landing page for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-8rem)]">
        {/* Hero */}
        <section className="relative gradient-hero overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(18 82% 53% / 0.3), transparent 50%), radial-gradient(circle at 80% 20%, hsl(38 92% 55% / 0.2), transparent 50%)' }} />
          <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Recipe Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground leading-[1.1] mb-6 opacity-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                Cook Bold.<br />
                <span className="text-gradient">Rebel Different.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto mb-10 opacity-0 animate-fade-up" style={{ animationDelay: '0.35s' }}>
                Share your recipes, discover new flavors, and get personalized diet advice from our AI Dietician.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-up" style={{ animationDelay: '0.5s' }}>
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="shadow-warm text-base px-8 h-12 rounded-lg"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Utensils, title: 'Share Recipes', desc: 'Upload your creations with photos, ingredients, and step-by-step instructions.' },
                { icon: Sparkles, title: 'AI Dietician', desc: 'Get personalized nutrition advice and meal recommendations powered by AI.' },
                { icon: ChefHat, title: 'Community', desc: 'Rate, comment, and save your favorite recipes from talented home cooks.' },
              ].map((f, i) => (
                <div key={i} className="text-center p-6 rounded-xl border bg-card shadow-card opacity-0 animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg gradient-primary mb-4">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated home
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Discover Recipes
        </h1>
        <p className="text-muted-foreground">
          Explore dishes from our community of home cooks
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={mealTypeFilter} onValueChange={setMealTypeFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Meal Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Meals</SelectItem>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => navigate('/upload')} className="shadow-warm">
          <Plus className="h-4 w-4 mr-2" />
          Upload
        </Button>
        <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {showFilters && (
        <div className="mb-8 p-4 bg-card rounded-lg border shadow-card max-w-md">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Max Prep Time</span>
              <span className="text-sm text-muted-foreground">{maxPrepTime} min</span>
            </div>
            <Slider value={[maxPrepTime]} onValueChange={(v) => setMaxPrepTime(v[0])} max={180} min={5} step={5} />
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-20">
          <Utensils className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery || mealTypeFilter !== 'all' ? 'No recipes match your filters.' : 'No recipes yet. Be the first to share!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe, i) => (
            <div key={recipe.id} className="opacity-0 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
