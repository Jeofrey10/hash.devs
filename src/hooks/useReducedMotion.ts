import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/animations';

export function useReducedMotion(): boolean {
  const [matches, setMatches] = useState<boolean>(() => prefersReducedMotion());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return matches;
}

