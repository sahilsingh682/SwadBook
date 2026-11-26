import { useEffect, useState } from 'react';

/**
 * Detects whether SwadBook is running as an installed standalone PWA
 * (Android TWA/WebAPK, iOS Add-to-Home-Screen, or Desktop PWA window).
 */
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });

  useEffect(() => {
    const mq = window.matchMedia('(display-mode: standalone)');
    const update = () => {
      setIsStandalone(
        mq.matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    };
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isStandalone;
}
