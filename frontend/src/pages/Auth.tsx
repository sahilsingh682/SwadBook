import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ChefHat, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import authHero from '@/assets/auth-hero.jpg';

function PasswordInput({ id, value, onChange, placeholder, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10 h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setShow(!show)}
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) { toast.error('Google sign-in failed. Please try again.'); return; }
      if (result.redirected) return;
      toast.success('Welcome to Recipe Rebel!');
    } catch { toast.error('Google sign-in failed.'); }
    finally { setGoogleLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) { toast.error('Please enter your email address'); return; }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) toast.error(error.message);
      else { toast.success('Password reset email sent! Check your inbox.', { duration: 6000 }); setShowForgotPassword(false); setResetEmail(''); }
    } catch { toast.error('Failed to send reset email'); }
    finally { setResetLoading(false); }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try { await signIn(signInEmail, signInPassword); }
    catch { /* handled */ }
    finally { setIsLoading(false); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try { await signUp(signUpEmail, signUpPassword, signUpName); }
    catch { /* handled */ }
    finally { setIsLoading(false); }
  };

  const googleButton = (
    <div className="space-y-4 pt-2">
      <div className="relative flex items-center">
        <Separator className="flex-1" />
        <span className="px-4 text-xs text-muted-foreground uppercase tracking-wider">or</span>
        <Separator className="flex-1" />
      </div>
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 gap-3 font-medium border-border/60 hover:bg-muted/60 hover:border-primary/30 transition-all"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
      >
        <GoogleIcon />
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left — Hero Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={authHero}
          alt="Gourmet cuisine"
          className="absolute inset-0 w-full h-full object-cover"
          width={960}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-accent text-sm font-medium tracking-wide uppercase">AI-Powered Platform</span>
          </div>
          <h1 className="text-5xl font-display text-white leading-tight mb-4">
            Cook Bold.<br />
            <span className="text-primary">Rebel Different.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Share your recipes, discover new flavors, and get personalized diet advice from our AI Dietician.
          </p>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo + Brand */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mx-auto">
              <ChefHat className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-tight">
                Recipe <span className="text-primary">Rebel</span>
              </h2>
              <p className="text-muted-foreground text-sm mt-1">Your culinary journey starts here</p>
            </div>
          </div>

          {showForgotPassword ? (
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Reset your password</h3>
                <p className="text-sm text-muted-foreground mt-1">Enter your email and we'll send you a reset link</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="chef@reciperebel.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-11 font-medium gap-2" disabled={resetLoading}>
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  {!resetLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
              <button
                className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setShowForgotPassword(false)}
              >
                ← Back to Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/60 rounded-xl">
                  <TabsTrigger value="signin" className="rounded-lg text-sm font-medium data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-lg text-sm font-medium data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="chef@reciperebel.com"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                        <button
                          type="button"
                          className="text-xs text-primary/80 hover:text-primary font-medium transition-colors"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <PasswordInput id="signin-password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} placeholder="Enter your password" required />
                    </div>
                    <Button type="submit" className="w-full h-11 font-medium gap-2 mt-2" disabled={isLoading}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                      {!isLoading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </form>
                  {googleButton}
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Chef Extraordinaire"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="chef@reciperebel.com"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        className="h-11 bg-muted/40 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                      <PasswordInput id="signup-password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} placeholder="Create a strong password" required minLength={6} />
                      <PasswordStrengthMeter password={signUpPassword} />
                    </div>
                    <Button type="submit" className="w-full h-11 font-medium gap-2 mt-2" disabled={isLoading}>
                      {isLoading ? 'Creating account...' : 'Create Account'}
                      {!isLoading && <ArrowRight className="h-4 w-4" />}
                    </Button>
                  </form>
                  {googleButton}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground/60">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
