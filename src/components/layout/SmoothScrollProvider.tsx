import { useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { initLenis, destroyLenis, getLenis, refreshScrollTrigger } from '@/lib/animations';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Initializes and manages Lenis smooth scroll provider across route transitions.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const location = useLocation();

  useEffect(() => {
    initLenis();

    return () => {
      destroyLenis();
    };
  }, []);

  // On route change, reset scroll to top and refresh ScrollTrigger instances
  useEffect(() => {
    const lenis = getLenis();
    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    refreshScrollTrigger();
  }, [location.pathname]);

  return <>{children}</>;
}
