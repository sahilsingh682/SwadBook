import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    ingredients: string[];
    preparation_time: number;
    image_url: string | null;
    average_rating: number;
    profiles?: {
      name: string;
    };
  };
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

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
    if (!user) return;
    if (isFavorite) {
      const { error } = await supabase.from('favorites').delete().eq('recipe_id', recipe.id).eq('user_id', user.id);
      if (error) { toast.error('Failed to update favorites'); return; }
      toast.success('Removed from favorites');
      setIsFavorite(false);
    } else {
      const { error } = await supabase.from('favorites').insert({ recipe_id: recipe.id, user_id: user.id });
      if (error) { toast.error('Failed to update favorites'); return; }
      toast.success('Added to favorites');
      setIsFavorite(true);
    }
  };

  return (
    <Card
      className="overflow-hidden border bg-card cursor-pointer group shadow-card hover:shadow-card-hover transition-smooth"
      onClick={() => navigate(`/recipe/${recipe.id}`)}
    >
      {/* Image */}
      <div className="aspect-[4/3] relative overflow-hidden bg-muted">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center gradient-primary">
            <span className="text-5xl">🍳</span>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />

        {/* Favorite */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-card/70 backdrop-blur-sm hover:bg-card shadow-sm"
          onClick={toggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
        </Button>

        {/* Time badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-sm text-xs font-medium">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{recipe.preparation_time} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-smooth">
          {recipe.title}
        </h3>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="font-medium">{recipe.average_rating.toFixed(1)}</span>
          </div>
          <span className="text-border">·</span>
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span className="truncate max-w-[120px]">{recipe.profiles?.name || 'Anonymous Chef'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
            <Badge key={idx} variant="secondary" className="text-xs font-normal px-2 py-0.5 rounded-full">
              {ingredient}
            </Badge>
          ))}
          {recipe.ingredients.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal px-2 py-0.5 rounded-full">
              +{recipe.ingredients.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
