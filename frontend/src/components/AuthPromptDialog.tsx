import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChefHat, Heart, MessageSquare, PlusCircle, Star } from 'lucide-react';

export type AuthPromptAction = 'favorite' | 'comment' | 'rate' | 'upload' | 'general';

interface AuthPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action?: AuthPromptAction;
}

export function AuthPromptDialog({
  open,
  onOpenChange,
  action = 'general',
}: AuthPromptDialogProps) {
  const navigate = useNavigate();

  const getActionDetails = () => {
    switch (action) {
      case 'favorite':
        return {
          icon: Heart,
          title: 'Save to Your Wishlist',
          description:
            'Create your personalized cookbook. Sign in or create a free account to bookmark recipes and access them anytime on any device.',
        };
      case 'comment':
        return {
          icon: MessageSquare,
          title: 'Join the Discussion',
          description:
            'Connect with the chef and fellow food lovers. Sign in to ask questions, share cooking tips, or leave a review.',
        };
      case 'rate':
        return {
          icon: Star,
          title: 'Rate This Recipe',
          description:
            'Help the community discover the best dishes. Sign in to submit your 1 to 5 star rating.',
        };
      case 'upload':
        return {
          icon: PlusCircle,
          title: 'Share Your Recipe',
          description:
            'Got a culinary masterpiece? Join our verified community of home chefs and inspire thousands of food lovers.',
        };
      default:
        return {
          icon: ChefHat,
          title: 'Unlock Full Community Access',
          description:
            'Sign in to save favorites, review recipes, calculate custom meal plans with our AI Dietician, and share your own cooking.',
        };
    }
  };

  const details = getActionDetails();
  const Icon = details.icon;

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  const handleSignUp = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-6 sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <DialogHeader className="text-center sm:text-center space-y-2">
          <DialogTitle className="text-2xl font-display font-bold">
            {details.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5 pt-4">
          <Button
            onClick={handleSignIn}
            className="w-full h-11 font-medium shadow-warm text-base"
          >
            Sign In / Sign Up
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Continue Browsing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
