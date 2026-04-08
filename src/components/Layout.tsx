import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ChefHat, Home, Upload, User, LogOut, Shield, Flame } from 'lucide-react';
import { AIChatbot } from './AIChatbot';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shadow-warm group-hover:scale-105 transition-smooth">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Recipe <span className="text-gradient">Rebel</span>
            </span>
          </Link>

          {user && (
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="transition-smooth text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm">Home</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/upload')} className="transition-smooth text-muted-foreground hover:text-foreground">
                <Upload className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm">Upload</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="transition-smooth text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm">Dashboard</span>
              </Button>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="transition-smooth text-muted-foreground hover:text-foreground">
                  <Shield className="h-4 w-4 mr-1.5" />
                  <span className="hidden sm:inline text-sm">Admin</span>
                </Button>
              )}
              <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="transition-smooth text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4 mr-1.5" />
                <span className="hidden sm:inline text-sm">Sign Out</span>
              </Button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* AI Chatbot */}
      {user && <AIChatbot />}

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <span className="font-display font-semibold text-sm">Recipe Rebel</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ by Team Recipe Rebel &nbsp;·&nbsp; © 2025 All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
