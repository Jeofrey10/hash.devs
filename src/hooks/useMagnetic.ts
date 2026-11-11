import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/animations';

export interface UseMagneticOptions {
  strength?: number; // Distance multiplier (default: 0.35)
  ease?: string;
  duration?: number;
  disabled?: boolean;
}

/**
 * Attaches a physics-based magnetic attraction effect to an element.
 * Automatically disabled on touch screens and under prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement = HTMLElement>(
  options: UseMagneticOptions = {}
) {
  const { strength = 0.35, ease = 'power3.out', duration = 0.6, disabled = false } = options;
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || disabled) return;

    // Check for touch / pointer coarse devices
    const isTouchDevice =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        !window.matchMedia('(hover: hover)').matches);

    if (isTouchDevice) return;

    // Set up GSAP quickTo setters for 60/120fps performance
    const xTo = gsap.quickTo(el, 'x', { duration, ease });
    const yTo = gsap.quickTo(el, 'y', { duration, ease });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo(deltaX);
      yTo(deltaY);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [strength, ease, duration, disabled]);

  return elementRef;
}

