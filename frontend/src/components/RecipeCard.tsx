import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, User, Heart, Dumbbell, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { AuthPromptDialog } from '@/components/AuthPromptDialog';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    description?: string | null;
    ingredients: string[];
    preparation_time: number;
    image_url: string | null;
    average_rating: number | null;
    meal_type?: string | null;
    dietary_type?: string | null;
    state?: string | null;
    tags?: string[] | null;
    calories?: number | null;
    protein?: number | null;
    profiles?: {
      name: string;
    } | null;
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const { user, isSuspended } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  useEffect(() => {
    if (user) checkFavorite();
  }, [user, recipe.id]);

  const checkFavorite = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('recipe_id', recipe.id)
      .eq('user_id', user?.id)
      .maybeSingle();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setAuthPromptOpen(true);
      return;
    }

    if (isSuspended) {
      toast.error('Your account is on hold. Favoriting recipes is currently disabled.');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('recipe_id', recipe.id)
        .eq('user_id', user.id);
      if (error) {
        toast.error('Failed to update favorites');
        return;
      }
      toast.success('Removed from favorites');
      setIsFavorite(false);
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({ recipe_id: recipe.id, user_id: user.id });
      if (error) {
        toast.error('Failed to update favorites');
        return;
      }
      toast.success('Added to favorites!');
      setIsFavorite(true);
    }
  };

  const isNonVeg = recipe.dietary_type === 'non-vegetarian';

  return (
    <>
      <Card
        className="overflow-hidden border bg-card cursor-pointer group shadow-card hover:shadow-card-hover transition-smooth h-full flex flex-col rounded-2xl"
        onClick={() => navigate(`/recipe/${recipe.id}`)}
      >
        {/* Image Container */}
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center gradient-primary text-primary-foreground">
              <span className="text-5xl">🍳</span>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

          {/* Top Left: Dietary Emblem (Veg/Non-Veg) & State Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <span
              className={`h-5 w-5 rounded-md border-2 p-0.5 flex items-center justify-center bg-card/90 backdrop-blur-md shadow-sm ${
                isNonVeg ? 'border-red-600' : 'border-emerald-600'
              }`}
              title={isNonVeg ? 'Non-Vegetarian' : 'Vegetarian'}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isNonVeg ? 'bg-red-600' : 'bg-emerald-600'
                }`}
              />
            </span>

            {recipe.state && (
              <span className="px-2.5 py-0.5 rounded-full bg-card/90 backdrop-blur-md text-[10px] font-bold text-foreground shadow-sm flex items-center gap-1">
                <span>📍</span>
                <span>{recipe.state}</span>
              </span>
            )}
          </div>

          {/* Top Right: Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/80 backdrop-blur-md hover:bg-card shadow-sm transition-smooth hover:scale-110 z-10"
            onClick={toggleFavorite}
            title={user ? (isFavorite ? 'Remove from wishlist' : 'Add to wishlist') : 'Sign in to save'}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-primary text-primary' : 'text-foreground'
              }`}
            />
          </Button>

          {/* Bottom Left: Meal Type & Prep Time */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 z-10">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/85 backdrop-blur-md text-xs font-medium shadow-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span>{recipe.preparation_time}m</span>
            </div>
            {recipe.meal_type && (
              <span className="px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                {recipe.meal_type}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-2.5">
          <div>
            <h3 className="font-display font-semibold text-lg line-clamp-1 group-hover:text-primary transition-smooth">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {recipe.description}
              </p>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span>{(recipe.average_rating ?? 0).toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-2">
              {recipe.calories && (
                <span className="font-medium text-foreground">
                  {recipe.calories} kcal
                </span>
              )}
              {recipe.protein && (
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-[10px] px-1.5 py-0 font-bold">
                  {recipe.protein}g protein
                </Badge>
              )}
            </div>
          </div>

          {/* Fitness & Dietary Tags */}
          <div className="flex flex-wrap gap-1 pt-1 mt-auto">
            {recipe.tags && recipe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground capitalize"
              >
                {tag.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Auth Prompt Dialog when Guest clicks favorite */}
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        action="favorite"
      />
    </>
  );
}
