import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'recipe_rebel_pwa_dismissed_at';
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Do not show if already installed in standalone/PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // Respect recent dismissal
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_TTL_MS) {
        return;
      }
    } catch {
      // ignore storage errors
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const iosDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(iosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      toast.success('Recipe Rebel app installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show welcome install prompt after preloader clears so visitors always see the option
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 2200);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
      return;
    }

    if (isIOS) {
      setShowIOSGuide((prev) => !prev);
      return;
    }

    toast.info('To install Recipe Rebel, click the install icon in your browser address bar or menu ("Install app").', {
      duration: 5000,
    });
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-20 left-3 right-3 md:bottom-6 md:left-6 md:right-auto md:w-[360px] z-40 p-4 shadow-warm border-primary/20 bg-card/95 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt="Recipe Rebel App"
          className="h-12 w-12 rounded-xl shadow-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-display font-bold text-sm leading-tight">
                Download Recipe Rebel App
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Get instant access, offline recipes &amp; AI Dietician on your home screen.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss install prompt"
              className="text-muted-foreground hover:text-foreground p-1 -mr-1 -mt-1 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {showIOSGuide && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-muted/70 text-xs text-foreground space-y-1">
              <p className="font-medium flex items-center gap-1.5">
                <Share className="h-3.5 w-3.5 text-primary" /> Tap <strong>Share</strong> in Safari, then choose <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="flex-1 h-8 text-xs font-semibold shadow-warm"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              {isIOS ? 'How to Install' : 'Download App'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="h-8 text-xs text-muted-foreground"
            >
              <Smartphone className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
              Not now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
