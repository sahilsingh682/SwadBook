import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, User, Download, Pencil, Trash2, Flame, Beef, Wheat, Droplet, ChefHat, X, ArrowLeft, Heart, MessageCircle, Send, Link2, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { commentSchema } from '@/lib/validations';
import SharePreviewModal from '@/components/SharePreviewModal';
import { Share2 } from 'lucide-react';
import { AuthPromptDialog, AuthPromptAction } from '@/components/AuthPromptDialog';
import { FAMOUS_RECIPES } from '@/data/famousRecipes';
import { shareToWhatsApp, shareToTwitter, copyToClipboard } from '@/lib/share';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const isUuid = (val?: string) =>
  !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isSuspended } = useAuth();
  const [recipe, setRecipe] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Auth Dialog prompt for guests
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authAction, setAuthAction] = useState<AuthPromptAction>('general');

  useEffect(() => {
    if (id) {
      fetchRecipe();
      fetchComments();
      if (user) {
        fetchUserRating();
        checkAdminRole();
        checkFavorite();
      }
    }
  }, [id, user]);

  const checkAdminRole = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    setIsAdmin(!!data);
  };

  const checkFavorite = async () => {
    if (!user || !id) return;
    if (!isUuid(id)) {
      try {
        const stored = JSON.parse(localStorage.getItem(`recipe_rebel_favs_${user.id}`) || '[]');
        setIsFavorite(Array.isArray(stored) && stored.includes(id));
      } catch {
        setIsFavorite(false);
      }
      return;
    }
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      setAuthAction('favorite');
      setAuthDialogOpen(true);
      return;
    }
    if (isSuspended) {
      toast.error('Your account is on hold. Favoriting recipes is currently disabled.');
      return;
    }
    if (!isUuid(id)) {
      try {
        const key = `recipe_rebel_favs_${user.id}`;
        const stored: string[] = JSON.parse(localStorage.getItem(key) || '[]');
        if (isFavorite) {
          localStorage.setItem(key, JSON.stringify(stored.filter((x) => x !== id)));
          toast.success('Removed from favorites');
          setIsFavorite(false);
        } else {
          localStorage.setItem(key, JSON.stringify([...new Set([...stored, id])]));
          toast.success('Added to favorites');
          setIsFavorite(true);
        }
      } catch {
        toast.error('Failed to update favorites');
      }
      return;
    }
    if (isFavorite) {
      const { error } = await supabase.from('favorites').delete().eq('recipe_id', id).eq('user_id', user.id);
      if (error) { toast.error('Failed to update favorites'); return; }
      toast.success('Removed from favorites');
      setIsFavorite(false);
    } else {
      const { error } = await supabase.from('favorites').insert({ recipe_id: id, user_id: user.id });
      if (error) { toast.error('Failed to update favorites'); return; }
      toast.success('Added to favorites');
      setIsFavorite(true);
    }
  };

  const fetchRecipe = async () => {
    try {
      const { data } = await supabase
        .from('recipes')
        .select('*, profiles:author_id(name)')
        .eq('id', id)
        .maybeSingle();
      if (data) {
        setRecipe(data);
        return;
      }
    } catch {
      // continue to fallback
    }
    const fallback = FAMOUS_RECIPES.find((r) => r.id === id);
    if (fallback) {
      setRecipe(fallback);
    }
  };

  const fetchComments = async () => {
    if (!id) return;
    if (!isUuid(id)) {
      try {
        const stored = localStorage.getItem(`recipe_rebel_comments_${id}`);
        setComments(stored ? JSON.parse(stored) : []);
      } catch {
        setComments([]);
      }
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles:user_id(name)')
      .eq('recipe_id', id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching comments:', error);
    }
    setComments(data || []);
  };

  const fetchUserRating = async () => {
    if (!id || !user) return;
    if (!isUuid(id)) {
      try {
        const stored = localStorage.getItem(`recipe_rebel_rating_${id}_${user.id}`);
        if (stored) setUserRating(Number(stored));
      } catch {
        // ignore storage errors
      }
      return;
    }

    const { data } = await supabase
      .from('ratings')
      .select('rating')
      .eq('recipe_id', id)
      .eq('user_id', user?.id)
      .maybeSingle();
    if (data) setUserRating(data.rating);
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      setAuthAction('rate');
      setAuthDialogOpen(true);
      return;
    }
    if (isSuspended) {
      toast.error('Your account is on hold. Rating recipes is currently disabled.');
      return;
    }

    if (!isUuid(id)) {
      localStorage.setItem(`recipe_rebel_rating_${id}_${user.id}`, String(rating));
      setUserRating(rating);
      toast.success('Rating saved!');
      return;
    }

    const { data: existing } = await supabase
      .from('ratings')
      .select('id')
      .eq('recipe_id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from('ratings')
        .update({ rating })
        .eq('recipe_id', id)
        .eq('user_id', user.id));
    } else {
      ({ error } = await supabase
        .from('ratings')
        .insert({ recipe_id: id, user_id: user.id, rating }));
    }

    if (!error) {
      setUserRating(rating);
      toast.success('Rating saved!');
      fetchRecipe();
    } else {
      console.error('Rating error:', error);
      toast.error('Failed to save rating');
    }
  };

  const handleComment = async () => {
    if (!user) {
      setAuthAction('comment');
      setAuthDialogOpen(true);
      return;
    }
    if (isSuspended) {
      toast.error('Your account is on hold. Posting comments is currently disabled.');
      return;
    }

    const validationResult = commentSchema.safeParse({ text: newComment });
    if (!validationResult.success) {
      toast.error(validationResult.error.errors[0].message);
      return;
    }

    setCommentLoading(true);
    try {
      if (!isUuid(id)) {
        const displayName =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Chef';
        const localComment = {
          id: `local-${Date.now()}`,
          recipe_id: id,
          user_id: user.id,
          text: validationResult.data.text,
          created_at: new Date().toISOString(),
          profiles: { name: displayName },
        };
        const updated = [localComment, ...comments];
        localStorage.setItem(`recipe_rebel_comments_${id}`, JSON.stringify(updated));
        setComments(updated);
        setNewComment('');
        toast.success('Comment added!');
        return;
      }

      let { error } = await supabase
        .from('comments')
        .insert({ recipe_id: id, user_id: user.id, text: validationResult.data.text });

      // If user's profile row doesn't exist yet (e.g., OAuth signup before trigger), create it and retry
      if (error && (error.code === '23503' || error.message?.includes('comments_user_id_fkey'))) {
        const displayName =
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Chef';
        await supabase.from('profiles').upsert({ id: user.id, name: displayName });
        const retry = await supabase
          .from('comments')
          .insert({ recipe_id: id, user_id: user.id, text: validationResult.data.text });
        error = retry.error;
      }

      if (!error) {
        setNewComment('');
        await fetchComments();
        toast.success('Comment added!');
      } else {
        console.error('Comment insert error:', error);
        toast.error(error.message || 'Failed to add comment');
      }
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDownloadIngredients = () => {
    if (!recipe) return;
    const content = `Ingredients for: ${recipe.title}\n\n${recipe.ingredients.map((ing: string, idx: number) => `${idx + 1}. ${ing}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_')}_ingredients.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Ingredients downloaded!');
  };

  const handleDelete = async () => {
    if (!recipe) return;
    const { error } = await supabase.from('recipes').delete().eq('id', recipe.id);
    if (!error) {
      toast.success('Recipe deleted successfully');
      navigate('/');
    } else {
      toast.error('Failed to delete recipe');
    }
  };

  const handleShareWhatsApp = () => {
    shareToWhatsApp(recipe?.title || 'SwadBook Recipe');
  };

  const handleShareTwitter = () => {
    shareToTwitter(recipe?.title || 'SwadBook Recipe');
  };

  const handleCopyLink = () => {
    copyToClipboard(window.location.href);
  };

  const canEditDelete = user && (user.id === recipe?.author_id || isAdmin);

  if (!recipe) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary animate-pulse" />
          <p className="text-muted-foreground text-sm">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Admin Moderation Banner */}
      {isAdmin && recipe?.status === 'pending' && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500 text-white font-medium text-xs">
                Pending Admin Verification
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">ID: {recipe.id}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This recipe is not yet listed on the public platform. Verify the recipe content and approve to publish.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={async () => {
                const { error } = await supabase.from('recipes').update({ status: 'approved' }).eq('id', id);
                if (!error) {
                  toast.success('Recipe approved & listed publicly!');
                  fetchRecipe();
                } else {
                  toast.error('Failed to approve recipe');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 font-medium"
            >
              Approve & Publish
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                const { error } = await supabase.from('recipes').update({ status: 'rejected' }).eq('id', id);
                if (!error) {
                  toast.success('Recipe rejected');
                  fetchRecipe();
                } else {
                  toast.error('Failed to reject recipe');
                }
              }}
              className="h-9 px-4 font-medium"
            >
              Reject
            </Button>
          </div>
        </div>
      )}

      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-card">
        <div className="aspect-video w-full">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <span className="text-8xl">🍳</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Floating actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-card/70 backdrop-blur-sm hover:bg-card shadow-sm"
            onClick={toggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground'}`} />
          </Button>
          {canEditDelete && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-card/70 backdrop-blur-sm hover:bg-card shadow-sm"
                onClick={() => navigate(`/recipe/${id}/edit`)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-destructive/70 backdrop-blur-sm hover:bg-destructive shadow-sm text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this recipe? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {recipe.state && (
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                📍 {recipe.state}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md border ${
                recipe.dietary_type === 'non-vegetarian'
                  ? 'bg-red-950/70 text-red-200 border-red-500/50'
                  : 'bg-emerald-950/70 text-emerald-200 border-emerald-500/50'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  recipe.dietary_type === 'non-vegetarian' ? 'bg-red-400' : 'bg-emerald-400'
                }`}
              />
              <span>{recipe.dietary_type === 'non-vegetarian' ? 'Non-Vegetarian' : 'Vegetarian'}</span>
            </span>
            {recipe.tags && recipe.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20 capitalize"
              >
                {tag.replace('-', ' ')}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <User className="h-4 w-4" />
              <span>{recipe.profiles?.name || 'Anonymous Chef'}</span>
            </div>
            <span className="text-white/40">·</span>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <Clock className="h-4 w-4" />
              <span>{recipe.preparation_time} min</span>
            </div>
            <span className="text-white/40">·</span>
            <div className="flex items-center gap-1.5 text-white/90 text-sm">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span>{(recipe.average_rating ?? 0).toFixed(1)}</span>
            </div>
            {recipe.meal_type && (
              <Badge className="capitalize bg-white/20 text-white border-white/30 backdrop-blur-sm">{recipe.meal_type}</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground font-medium">Share:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-4.51-1.07l-.323-.193-3.35.881.895-3.265-.21-.333A8.152 8.152 0 012.358 12c0-4.491 3.648-8.136 8.136-8.136 2.168 0 4.208.847 5.743 2.385a8.04 8.04 0 012.382 5.741c-.002 4.49-3.648 8.134-8.137 8.134m0-18.27C5.9 3.515.515 8.9.515 15.636c0 1.983.52 3.918 1.504 5.611l-1.594 5.81 5.935-1.562a13.39 13.39 0 006.378 1.613h.006c7.387 0 13.397-6.01 13.397-13.398C26.136 9.01 20.125 3 12.738 3"/>
          </svg>
          WhatsApp
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareTwitter}
          className="gap-2 text-sky-500 border-sky-200 hover:bg-sky-50 hover:text-sky-600"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          <Link2 className="h-4 w-4" />
          Copy Link
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => setShareModalOpen(true)}
          className="gap-2 ml-auto"
        >
          <Share2 className="h-4 w-4" />
          Preview & Share
        </Button>
      </div>

      <SharePreviewModal open={shareModalOpen} onOpenChange={setShareModalOpen} recipe={recipe} />

      {/* Content Grid */}
      <div className="grid gap-6">
        {/* Nutrition Info */}
        {(recipe.calories || recipe.protein || recipe.carbs || recipe.fat) && (
          <Card className="shadow-card">
            <CardContent className="p-5">
              <h3 className="text-lg font-display font-semibold mb-4">Nutrition per Serving</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recipe.calories && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Calories</p>
                      <p className="font-semibold">{recipe.calories} kcal</p>
                    </div>
                  </div>
                )}
                {recipe.protein && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10">
                    <Beef className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Protein</p>
                      <p className="font-semibold">{recipe.protein}g</p>
                    </div>
                  </div>
                )}
                {recipe.carbs && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10">
                    <Wheat className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{recipe.carbs}g</p>
                    </div>
                  </div>
                )}
                {recipe.fat && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10">
                    <Droplet className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fat</p>
                      <p className="font-semibold">{recipe.fat}g</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ingredients */}
        <Card className="shadow-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold">Ingredients</h2>
              <Button variant="outline" size="sm" onClick={handleDownloadIngredients} className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.map((ing: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm">{ing}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        {recipe.steps && recipe.steps.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-5">
                <ChefHat className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-display font-semibold">How to Make</h2>
              </div>
              <div className="space-y-4">
                {recipe.steps.map((step: string, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-foreground leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rating */}
        <Card className="shadow-card">
          <CardContent className="p-5">
            <h3 className="text-lg font-display font-semibold mb-3">Rate this Recipe</h3>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-7 w-7 cursor-pointer transition-all duration-200 hover:scale-110 ${
                      (hoverRating || userRating) >= rating
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground/40'
                    }`}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleRate(rating)}
                  />
                ))}
              </div>
              {userRating > 0 && (
                <span className="text-sm text-muted-foreground">You rated {userRating}/5</span>
              )}
              {!user && (
                <span className="text-sm text-muted-foreground">Sign in to rate</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="shadow-card">
          <CardContent className="p-5 space-y-5">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">Comments</h2>
              <Badge variant="secondary" className="ml-1">{comments.length}</Badge>
            </div>

            {/* Comment input — always visible */}
            <div className="flex gap-3">
              <Textarea
                placeholder={user ? "Share your thoughts about this recipe..." : "Sign in to leave a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={!user}
              />
              <Button
                onClick={handleComment}
                disabled={commentLoading || !newComment.trim()}
                size="icon"
                className="h-10 w-10 self-end shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{comment.profiles?.name || 'Anonymous'}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                        {user && (user.id === comment.user_id || isAdmin) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive"
                            onClick={async () => {
                              if (!isUuid(id)) {
                                const updated = comments.filter((c) => c.id !== comment.id);
                                localStorage.setItem(`recipe_rebel_comments_${id}`, JSON.stringify(updated));
                                setComments(updated);
                                toast.success('Comment deleted');
                                return;
                              }
                              const { error } = await supabase.from('comments').delete().eq('id', comment.id);
                              if (!error) {
                                toast.success('Comment deleted');
                                fetchComments();
                              } else {
                                toast.error('Failed to delete comment');
                              }
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Auth Prompt Dialog for Unauthenticated Users */}
      <AuthPromptDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        action={authAction}
      />
    </div>
  );
}
