import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Link2, Twitter, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface SharePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: {
    title: string;
    image_url?: string | null;
    preparation_time: number;
    average_rating?: number | null;
    meal_type?: string | null;
    profiles?: { name: string } | null;
  } | null;
}

export default function SharePreviewModal({ open, onOpenChange, recipe }: SharePreviewModalProps) {
  if (!recipe) return null;

  const url = window.location.href;
  const text = `Check out this recipe: ${recipe.title}`;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4 text-primary" />
            Share Preview
          </DialogTitle>
        </DialogHeader>

        {/* Preview Card — mimics social media card */}
        <div className="mx-5 rounded-xl border overflow-hidden shadow-sm bg-card">
          <div className="aspect-[1.91/1] w-full bg-muted relative">
            {recipe.image_url ? (
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-5xl">🍳</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="text-white font-display font-bold text-lg leading-tight line-clamp-2">{recipe.title}</h3>
            </div>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {recipe.preparation_time} min
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {(recipe.average_rating ?? 0).toFixed(1)}
              </span>
              {recipe.meal_type && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize h-4">{recipe.meal_type}</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              reciperebel.lovable.app • by {recipe.profiles?.name || 'Anonymous Chef'}
            </p>
          </div>
        </div>

        {/* Share buttons */}
        <div className="p-5 pt-3 flex gap-2">
          <Button onClick={handleWhatsApp} size="sm" className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-4.51-1.07l-.323-.193-3.35.881.895-3.265-.21-.333A8.152 8.152 0 012.358 12c0-4.491 3.648-8.136 8.136-8.136 2.168 0 4.208.847 5.743 2.385a8.04 8.04 0 012.382 5.741c-.002 4.49-3.648 8.134-8.137 8.134m0-18.27C5.9 3.515.515 8.9.515 15.636c0 1.983.52 3.918 1.504 5.611l-1.594 5.81 5.935-1.562a13.39 13.39 0 006.378 1.613h.006c7.387 0 13.397-6.01 13.397-13.398C26.136 9.01 20.125 3 12.738 3"/>
            </svg>
            WhatsApp
          </Button>
          <Button onClick={handleTwitter} size="sm" className="flex-1 gap-2 bg-sky-500 hover:bg-sky-600 text-white">
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button onClick={handleCopy} variant="outline" size="sm" className="flex-1 gap-2">
            <Link2 className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
