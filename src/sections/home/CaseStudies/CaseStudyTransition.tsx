import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/animations';

interface CaseStudyTransitionProps {
  projectIndex: string;
  projectTitle: string;
}

export function CaseStudyTransition({ projectIndex, projectTitle }: CaseStudyTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const overlay = overlayRef.current;
    const text = textRef.current;
    if (!overlay) return;

    if (prefersReducedMotion()) {
      overlay.style.display = 'none';
      return;
    }

    // Coordinated GSAP Curtain Reveal (0.65s total, zero blocking)
    const tl = gsap.timeline({
      onComplete: () => {
        if (overlay) {
          overlay.style.pointerEvents = 'none';
          overlay.style.display = 'none';
        }
      },
    });

    tl.set(overlay, { opacity: 1, pointerEvents: 'auto' })
      .fromTo(
        text,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      )
      .to(text, { opacity: 0, y: -10, duration: 0.2, ease: 'power2.in', delay: 0.1 })
      .to(
        overlay,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.45,
          ease: 'power3.inOut',
        },
        '-=0.05'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-obsidian border-b border-brand-neon/40"
      style={{
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      }}
    >
      <div ref={textRef} className="text-center font-mono select-none px-6">
        <span className="block text-xs font-bold text-brand-neon tracking-widest uppercase mb-2">
          COMMISSION // [{projectIndex}]
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-brand-white uppercase tracking-tight">
          {projectTitle}
        </h2>
      </div>
    </div>
  );
}

