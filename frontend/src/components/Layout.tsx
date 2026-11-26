import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ChefHat, Home, Upload, User, LogOut, Shield, AlertTriangle } from 'lucide-react';
import { AIChatbot } from './AIChatbot';
import { AuthPromptDialog } from './AuthPromptDialog';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { BrandLogo } from './BrandLogo';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAdmin, isSuspended, suspensionReason, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/reset-password';

  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authDialogAction, setAuthDialogAction] = useState<'upload' | 'general'>('general');

  if (isAuthPage) return <>{children}</>;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      setAuthDialogAction('upload');
      setAuthDialogOpen(true);
      return;
    }
    navigate('/upload');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      {/* Account Suspended / On Hold Warning Banner */}
      {user && isSuspended && (
        <div className="bg-destructive text-destructive-foreground px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-sm text-center">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Account On Hold:</strong> {suspensionReason || 'A policy violation was detected'}. You can browse recipes, but uploading, rating, and commenting are temporarily disabled.
          </span>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="group transition-smooth hover:opacity-95">
            <BrandLogo size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="hidden md:inline-flex transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Home className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Explore</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleUploadClick}
              className="hidden md:inline-flex transition-smooth text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-4 w-4 mr-1.5" />
              <span className="text-sm">Upload Recipe</span>
            </Button>

            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:inline-flex transition-smooth text-muted-foreground hover:text-foreground"
                >
                  <User className="h-4 w-4 mr-1.5" />
                  <span className="text-sm">Dashboard</span>
                </Button>

                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="hidden md:inline-flex transition-smooth text-amber-500 hover:text-amber-600 hover:bg-amber-500/10 font-semibold"
                  >
                    <Shield className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Admin</span>
                  </Button>
                )}

                <div className="w-px h-6 bg-border mx-1 hidden md:block" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="transition-smooth text-muted-foreground hover:text-destructive text-sm"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="text-sm font-medium"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="shadow-warm text-sm font-medium rounded-lg"
                >
                  Join Free
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* AI Chatbot - Available to all users */}
      <AIChatbot />

      {/* PWA Download / Install Popup */}
      <PWAInstallPrompt />

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/85 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-around h-16 px-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${
              location.pathname === '/' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-[11px] leading-none">Explore</span>
          </button>

          <button
            type="button"
            onClick={handleUploadClick}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${
              location.pathname === '/upload' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Upload className="h-5 w-5" />
            <span className="text-[11px] leading-none">Upload</span>
          </button>

          {user ? (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/dashboard' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[11px] leading-none">Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/auth' ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-[11px] leading-none">Sign In</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1.5 rounded-xl transition-colors ${
                location.pathname === '/admin' ? 'text-amber-500 font-semibold' : 'text-amber-500/80 hover:text-amber-500'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span className="text-[11px] leading-none">Admin</span>
            </button>
          )}
        </div>
      </nav>

      {/* Auth Prompt Modal */}
      <AuthPromptDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        action={authDialogAction}
      />

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" />
            <p className="text-xs text-muted-foreground">
              India&apos;s Shared Recipe Book &nbsp;·&nbsp; © {new Date().getFullYear()} SwadBook. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
