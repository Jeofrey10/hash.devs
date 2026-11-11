import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

export interface LenisConfig {
  wrapper?: HTMLElement | Window;
  content?: HTMLElement;
  lerp?: number;
  duration?: number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  autoResize?: boolean;
}

let lenisInstance: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;

/**
 * Initializes Lenis and connects it synchronously to GSAP ticker and ScrollTrigger.
 */
export function initLenis(options?: Partial<LenisConfig>): Lenis {
  if (typeof window === 'undefined') {
    return {} as Lenis;
  }

  // If already initialized, return active instance
  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.2,
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    ...options,
  });

  lenisInstance = lenis;
  if (typeof window !== 'undefined') {
    (window as any).lenis = lenis;
  }

  // Sync Lenis scroll events to GSAP ScrollTrigger
  lenis.on('scroll', () => {
    ScrollTrigger.update();
  });

  // Drive Lenis from GSAP's central requestAnimationFrame ticker
  tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);

  // Turn off GSAP lag smoothing to ensure smooth scrolling alignment
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * Returns current Lenis instance if active
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Destroys active Lenis instance and cleans up GSAP ticker hooks
 */
export function destroyLenis(): void {
  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback);
    tickerCallback = null;
  }

  if (lenisInstance) {
    lenisInstance.destroy();
    lenisInstance = null;
  }
}

