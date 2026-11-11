import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/animations';
import { usePreloader } from './PreloaderContext';

export function CinematicPreloader() {
  const { isDismissed } = usePreloader();
  if (isDismissed) {
    return null;
  }
  return <CinematicPreloaderInner />;
}

function CinematicPreloaderInner() {
  const { progress, status, isComplete, dismissPreloader } = usePreloader();
  const [displayPercent, setDisplayPercent] = useState(0);
  const [isRendered, setIsRendered] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const hasAnimatedExit = useRef(false);

  // Smooth numerical counter interpolation using requestAnimationFrame
  useEffect(() => {
    let animId: number;
    const step = () => {
      setDisplayPercent((prev) => {
        if (prev < progress) {
          const delta = Math.ceil((progress - prev) * 0.15);
          return Math.min(progress, prev + Math.max(1, delta));
        }
        return prev;
      });
      if (displayPercent < progress) {
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [progress, displayPercent]);

  // Entrance Sequence on mount
  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    if (!containerRef.current || !emblemRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (emblemRef.current) {
        tl.fromTo(
          emblemRef.current,
          { opacity: 0, scale: 0.92, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9 }
        );
      }
      if (logoTextRef.current) {
        tl.fromTo(
          logoTextRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );
      }
      const hudElements = [topBarRef.current, bottomBarRef.current, telemetryRef.current].filter(Boolean);
      if (hudElements.length > 0) {
        tl.fromTo(
          hudElements,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.3'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Exit Curtain Reveal when 100% complete
  useEffect(() => {
    if (!isComplete || hasAnimatedExit.current) return;
    if (displayPercent < 100) return;

    hasAnimatedExit.current = true;

    if (prefersReducedMotion()) {
      setIsRendered(false);
      dismissPreloader();
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setIsRendered(false);
      dismissPreloader();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        delay: 0.25, // Brief hold at 100% so user sees completion
        onComplete: () => {
          setIsRendered(false);
          dismissPreloader();
        },
      });

      // 1. Content fades out swiftly
      const targets = [
        emblemRef.current,
        logoTextRef.current,
        telemetryRef.current,
        topBarRef.current,
        bottomBarRef.current,
      ].filter(Boolean);

      if (targets.length > 0) {
        tl.to(targets, {
          opacity: 0,
          y: -15,
          duration: 0.4,
          ease: 'power3.in',
        });
      }

      // 2. Cinematic vertical shutter curtain reveal upward
      tl.to(
        container,
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          duration: 0.75,
          ease: 'expo.inOut',
        },
        targets.length > 0 ? '-=0.1' : undefined
      );
    }, container);

    return () => ctx.revert();
  }, [isComplete, displayPercent, dismissPreloader]);

  if (!isRendered) {
    return null;
  }

  const formattedPercent = String(displayPercent).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      aria-label={`Initializing HASH.DEVS: ${status} - ${formattedPercent}%`}
      className="fixed inset-0 z-[120] bg-brand-obsidian text-brand-white flex flex-col justify-between p-6 sm:p-10 laptop:p-14 overflow-hidden select-none"
      style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
    >
      {/* Background Architectural Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #35e85b 1px, transparent 1px), linear-gradient(to bottom, #35e85b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Subtle Center Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-neon/[0.03] blur-[140px] pointer-events-none rounded-full" />

      {/* TOP HUD BAR */}
      <div
        ref={topBarRef}
        className="relative z-10 flex items-center justify-between font-mono text-[10px] sm:text-xs text-brand-muted/70 tracking-widest uppercase border-b border-brand-border/40 pb-3"
      >
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse shadow-[0_0_8px_rgba(53,232,91,0.8)]" />
          <span className="text-brand-white font-bold tracking-wider">HASH.DEVS</span>
          <span className="text-brand-border hidden xs:inline">•</span>
          <span className="hidden xs:inline text-brand-muted">ATELIER SYS_INIT</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-brand-border font-mono">EST. 2024</span>
          <span className="text-brand-neon font-bold tracking-wider">[ONLINE]</span>
        </div>
      </div>

      {/* CENTER BRAND EMBLEM & LOGO */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
        {/* Emblem Reticle Box */}
        <div
          ref={emblemRef}
          className="relative p-6 sm:p-8 rounded-2xl border border-brand-border/60 bg-brand-surface/40 backdrop-blur-sm mb-6 flex items-center justify-center group"
        >
          {/* Corner Precision Brackets */}
          <span className="absolute -top-[1px] -left-[1px] text-[10px] font-mono text-brand-neon/60 select-none">⌜</span>
          <span className="absolute -top-[1px] -right-[1px] text-[10px] font-mono text-brand-neon/60 select-none">⌝</span>
          <span className="absolute -bottom-[1px] -left-[1px] text-[10px] font-mono text-brand-neon/60 select-none">⌞</span>
          <span className="absolute -bottom-[1px] -right-[1px] text-[10px] font-mono text-brand-neon/60 select-none">⌟</span>

          {/* Official HASH.DEVS Brand Logo */}
          <img
            src="/images/hashdevs-logo.png"
            alt="HASH.DEVS"
            className="w-40 xs:w-48 sm:w-56 h-auto object-contain brightness-110 drop-shadow-[0_0_20px_rgba(53,232,91,0.2)]"
          />
        </div>

        {/* Minimal Monospace Subtext */}
        <div ref={logoTextRef} className="space-y-1">
          <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-brand-white uppercase">
            CREATIVE ENGINEERING STUDIO
          </div>
          <div className="font-mono text-[10px] sm:text-xs text-brand-muted/70 tracking-widest uppercase">
            SAN FRANCISCO // LONDON // TOKYO
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: PROGRESS BAR & TELEMETRY STATUS */}
      <div ref={bottomBarRef} className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Telemetry Status Line & Numerical Percentage */}
        <div
          ref={telemetryRef}
          className="flex items-center justify-between font-mono text-xs text-brand-muted mb-3"
        >
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon shrink-0 animate-ping" />
            <span className="text-brand-white font-semibold tracking-wider text-[11px] sm:text-xs uppercase truncate">
              {status}
            </span>
          </div>

          <div className="font-display font-extrabold text-brand-neon text-lg sm:text-xl tracking-tight shrink-0">
            {formattedPercent}%
          </div>
        </div>

        {/* Thin Neon Progress Indicator Track */}
        <div className="relative w-full h-[2px] bg-brand-border/60 rounded-full overflow-hidden">
          <div
            ref={progressLineRef}
            className="absolute top-0 left-0 bottom-0 bg-brand-neon rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(53,232,91,0.9)]"
            style={{ width: `${displayPercent}%` }}
          />
        </div>

        {/* Bottom Technical Status Registration */}
        <div className="mt-3 flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-brand-muted/60 tracking-wider uppercase">
          <span>PIPELINE // AOT_PBR_VSYNC</span>
          <span>SYSTEM INTEGRITY // 100%</span>
        </div>
      </div>
    </div>
  );
}

