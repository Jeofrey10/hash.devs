import { useRef, useState, useEffect, useId } from 'react';
import { useCursor } from '@/components/ui/CursorContext';
import { gsap } from '@/lib/animations';

export interface CapabilityItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  visualType: 'experience' | 'identity' | 'ai' | 'engineering';
}

export interface CapabilityPanelProps {
  item: CapabilityItem;
  className?: string;
}

export function CapabilityPanel({ item, className = '' }: CapabilityPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const { setCursor, resetCursor } = useCursor();
  const [isHovered, setIsHovered] = useState(false);
  const baseId = useId();

  useEffect(() => {
    if (!panelRef.current) return;
    // Disable 3D tilt on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    gsap.set(panelRef.current, {
      transformPerspective: 1000,
      transformStyle: 'preserve-3d',
    });

    quickX.current = gsap.quickTo(panelRef.current, 'rotationX', {
      duration: 0.35,
      ease: 'power2.out',
    });
    quickY.current = gsap.quickTo(panelRef.current, 'rotationY', {
      duration: 0.35,
      ease: 'power2.out',
    });

    return () => {
      quickX.current = null;
      quickY.current = null;
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panelRef.current || !quickX.current || !quickY.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Clamped within +/- 4 degrees for an elegant architectural perspective
    const rotX = Math.max(-4, Math.min(4, -(y * 8)));
    const rotY = Math.max(-4, Math.min(4, x * 8));
    quickX.current(rotX);
    quickY.current(rotY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setCursor('view', 'EXPLORE');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    quickX.current?.(0);
    quickY.current?.(0);
    resetCursor();
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-none border border-brand-border bg-brand-surface p-8 sm:p-10 laptop:p-12 transition-[border-color,box-shadow,background-color] duration-500 hover:border-brand-neon/60 hover:shadow-[0_0_35px_rgba(53,232,91,0.06)] ${className}`}
    >
      {/* 1. Subtle Ambient Glow on Hover */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-neon/10 blur-[80px] transition-opacity duration-700 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Architectural Corner Accents */}
      <div className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-transparent transition-colors duration-300 group-hover:border-brand-neon" />
      <div className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-transparent transition-colors duration-300 group-hover:border-brand-neon" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-transparent transition-colors duration-300 group-hover:border-brand-neon" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-transparent transition-colors duration-300 group-hover:border-brand-neon" />

      {/* 3. Panel Header: Number & Category */}
      <div className="relative z-10 flex items-start justify-between border-b border-brand-border/60 pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-brand-neon">
            {item.number}
          </span>
          <span className="font-mono text-xs tracking-widest text-brand-muted uppercase">
            // {item.category}
          </span>
        </div>

        {/* Hover Action Arrow */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface-elevated text-brand-muted transition-all duration-300 group-hover:border-brand-neon group-hover:bg-brand-neon group-hover:text-brand-obsidian">
          <svg
            className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H9M17 7V15" />
          </svg>
        </div>
      </div>

      {/* 4. Custom Dedicated Visual Art Component per Discipline */}
      <div className="relative z-10 my-8 sm:my-10 h-44 sm:h-52 w-full overflow-hidden border border-brand-border/40 bg-brand-obsidian/70 p-4 flex items-center justify-center">
        {item.visualType === 'experience' && (
          // Discipline 01: Interactive Isometric Plane & Spatial Crosshair
          <div className="relative h-full w-full flex items-center justify-center">
            <svg viewBox="0 0 300 160" fill="none" className="w-full h-full opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              {/* Isometric grid planes */}
              <path d="M 150 20 L 270 75 L 150 135 L 30 75 Z" stroke="#171A18" strokeWidth="1.5" />
              <path d="M 150 40 L 240 82 L 150 125 L 60 82 Z" stroke="#1E2420" strokeWidth="1" />
              <path d="M 150 60 L 210 88 L 150 115 L 90 88 Z" stroke="#35E85B" strokeWidth="1.2" strokeDasharray="3 3" className="animate-pulse" />
              {/* Floating crosshair cursor */}
              <circle cx="150" cy="88" r="4" fill="#35E85B" />
              <circle cx="150" cy="88" r="14" stroke="#35E85B" strokeWidth="1" opacity="0.4" />
              <line x1="150" y1="65" x2="150" y2="110" stroke="#35E85B" strokeWidth="0.8" opacity="0.6" />
              <line x1="125" y1="88" x2="175" y2="88" stroke="#35E85B" strokeWidth="0.8" opacity="0.6" />
              {/* Coordinate HUD */}
              <text x="35" y="150" fill="#94A3A8" fontFamily="monospace" fontSize="8">COORD: [150.0, 88.0, +0.14]</text>
              <text x="210" y="150" fill="#35E85B" fontFamily="monospace" fontSize="8">SYS: SPATIAL 3D</text>
            </svg>
          </div>
        )}

        {item.visualType === 'identity' && (
          // Discipline 02: Brutalist Typographic Matrix & Contrast Badges
          <div className="relative h-full w-full flex flex-col justify-between p-3 font-mono">
            <div className="flex items-center justify-between text-[10px] text-brand-muted border-b border-brand-border/40 pb-2">
              <span className="text-brand-white font-bold">TYPE ARCHITECTURE // 02</span>
              <span className="text-brand-neon">KERNING: -0.04em</span>
            </div>
            <div className="flex items-baseline justify-between px-2">
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-brand-white group-hover:text-brand-neon transition-colors duration-300">
                Aa
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-brand-muted/40">
                [#]
              </span>
              <span className="font-display text-3xl font-extrabold text-brand-white/80">
                Syne
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-brand-muted pt-2 border-t border-brand-border/40">
              <span>CONTRAST: 21:1 PURE BLACK</span>
              <span className="text-brand-neon">SYSTEMIC SPEC OK</span>
            </div>
          </div>
        )}

        {item.visualType === 'ai' && (
          // Discipline 03: Algorithmic Node Matrix & Telemetry Stream
          <div className="relative h-full w-full flex flex-col justify-between p-3 font-mono">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-brand-neon flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                NEURAL ENGINE ACTIVE
              </span>
              <span className="text-brand-muted text-[9px]">128.4 TFLOPS</span>
            </div>
            {/* Dynamic Telemetry Graph */}
            <svg viewBox="0 0 260 70" fill="none" className="w-full h-16">
              <defs>
                <linearGradient id={`${baseId}-aiGrad`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#171A18" />
                  <stop offset="50%" stopColor="#35E85B" />
                  <stop offset="100%" stopColor="#FFFFFF" />
                </linearGradient>
              </defs>
              <polyline
                points="0,55 35,45 70,58 105,25 140,38 175,15 210,30 260,10"
                stroke={`url(#${baseId}-aiGrad)`}
                strokeWidth="1.8"
                fill="none"
              />
              <circle cx="175" cy="15" r="3" fill="#35E85B" className="animate-ping" />
              <circle cx="175" cy="15" r="3" fill="#35E85B" />
            </svg>
            <div className="flex items-center justify-between text-[9px] text-brand-muted border-t border-brand-border/40 pt-1.5">
              <span>LATENCY: 4.2ms</span>
              <span className="text-brand-neon">REAL-TIME INFERENCE</span>
            </div>
          </div>
        )}

        {item.visualType === 'engineering' && (
          // Discipline 04: Hardware-Accelerated Wireframe Dodecahedron & FPS Counter
          <div className="relative h-full w-full flex items-center justify-center">
            <svg viewBox="0 0 200 140" fill="none" className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              {/* Rotating 3D wireframe prism */}
              <g className="transform origin-center transition-transform duration-700 group-hover:rotate-45">
                <polygon points="100,20 160,50 160,100 100,125 40,100 40,50" stroke="#171A18" strokeWidth="1.5" />
                <polygon points="100,35 145,58 145,95 100,112 55,95 55,58" stroke="#1E2420" strokeWidth="1" />
                <line x1="100" y1="20" x2="100" y2="125" stroke="#35E85B" strokeWidth="1" opacity="0.7" />
                <line x1="40" y1="50" x2="160" y2="100" stroke="#35E85B" strokeWidth="0.8" opacity="0.4" />
                <line x1="40" y1="100" x2="160" y2="50" stroke="#35E85B" strokeWidth="0.8" opacity="0.4" />
                <circle cx="100" cy="72" r="3" fill="#35E85B" />
              </g>
              <text x="15" y="130" fill="#94A3A8" fontFamily="monospace" fontSize="8">GLSL // SHADER PIPELINE</text>
              <text x="135" y="130" fill="#35E85B" fontFamily="monospace" fontSize="8">60 FPS // GPU</text>
            </svg>
          </div>
        )}
      </div>

      {/* 5. Panel Body: Title & Descriptive Copy */}
      <div className="relative z-10 flex-1">
        <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-brand-white group-hover:text-brand-neon transition-colors duration-300">
          {item.title}
        </h3>
        <p className="mt-4 font-body text-base text-brand-muted leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* 6. Panel Footer: Capabilities Deliverable Pills */}
      <div className="relative z-10 mt-8 pt-6 border-t border-brand-border/60">
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-none border border-brand-border bg-brand-surface-elevated/80 px-2.5 py-1 font-mono text-[11px] text-brand-muted transition-colors duration-200 group-hover:border-brand-neon/40 group-hover:text-brand-white"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

