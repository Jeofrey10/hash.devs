import { useLayoutEffect, useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Executes GSAP animations scoped to a container and guarantees cleanup on unmount.
 * Prevents memory leaks and ghost ScrollTrigger instances in React 18 StrictMode.
 */
export function useGsapContext(
  animationCallback: (context: gsap.Context) => void | (() => void),
  scopeRef?: React.RefObject<Element | null>
): gsap.Context | null {
  const ctxRef = useRef<gsap.Context | null>(null);

  useIsomorphicLayoutEffect(() => {
    const scope = scopeRef ? scopeRef.current ?? undefined : undefined;
    const ctx = gsap.context((self) => {
      animationCallback(self);
    }, scope);

    ctxRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, []);

  return ctxRef.current;
}

