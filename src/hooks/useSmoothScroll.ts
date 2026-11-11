import { useCallback, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { getLenis } from '@/lib/animations';

export function useSmoothScroll() {
  const [lenis, setLenis] = useState<Lenis | null>(() => getLenis());

  useEffect(() => {
    // Check if lenis is already initialized
    const instance = getLenis();
    if (instance) {
      setLenis(instance);
    }
  }, []);

  const scrollTo = useCallback((target: string | number | HTMLElement, offset = 0) => {
    const instance = getLenis();
    if (instance) {
      instance.scrollTo(target, { offset, duration: 1.2 });
    }
  }, []);

  const stop = useCallback(() => {
    getLenis()?.stop();
  }, []);

  const start = useCallback(() => {
    getLenis()?.start();
  }, []);

  return {
    lenis,
    scrollTo,
    stop,
    start,
  };
}

