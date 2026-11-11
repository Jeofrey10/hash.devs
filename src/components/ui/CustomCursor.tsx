import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/animations';
import { useCursor } from './CursorContext';

export function CustomCursor() {
  const { cursor } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if device supports hover / fine pointer
    if (typeof window === 'undefined') return;

    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;

    if (!hasFinePointer || !canHover) {
      setIsTouchDevice(true);
      return;
    }

    setIsTouchDevice(false);

    const cursorEl = cursorRef.current;
    const dotEl = dotRef.current;
    if (!cursorEl || !dotEl) return;

    // Fast GSAP quickTo setters
    const xToCursor = gsap.quickTo(cursorEl, 'x', { duration: 0.35, ease: 'power3.out' });
    const yToCursor = gsap.quickTo(cursorEl, 'y', { duration: 0.35, ease: 'power3.out' });

    const xToDot = gsap.quickTo(dotEl, 'x', { duration: 0.1, ease: 'none' });
    const yToDot = gsap.quickTo(dotEl, 'y', { duration: 0.1, ease: 'none' });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  // Do not render anything on touch devices
  if (isTouchDevice) {
    return null;
  }

  const isExpanded = cursor.variant === 'view' || cursor.variant === 'drag';
  const isHovered = cursor.variant === 'hover' || cursor.variant === 'magnetic';
  const isHidden = cursor.variant === 'hidden' || !isVisible;

  return (
    <>
      {/* Outer Follower Ring */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-cursor -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          opacity: isHidden ? 0 : 1,
        }}
      >
        <div
          className={`flex items-center justify-center rounded-full border transition-all duration-300 ${
            isExpanded
              ? 'h-20 w-20 border-brand-neon bg-brand-neon/15 backdrop-blur-xs'
              : isHovered
              ? 'h-12 w-12 border-brand-neon/80 bg-brand-neon/10 scale-110'
              : 'h-8 w-8 border-brand-white/40 bg-transparent'
          }`}
        >
          {cursor.label && (
            <span className="font-mono text-[9px] font-bold tracking-widest text-brand-neon uppercase">
              {cursor.label}
            </span>
          )}
        </div>
      </div>

      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-cursor -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
        style={{
          opacity: isHidden || isExpanded ? 0 : 1,
        }}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full transition-transform duration-200 ${
            isHovered ? 'scale-0' : 'bg-brand-neon scale-100'
          }`}
        />
      </div>
    </>
  );
}

