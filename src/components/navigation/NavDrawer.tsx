import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap } from '@/lib/animations';
import { getLenis } from '@/lib/animations';
import { useCursor } from '@/components/ui/CursorContext';
import { cn } from '@/lib/utils';

export interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemMeta {
  index: string;
  label: string;
  to: string;
  tagline: string;
  deliverables: string[];
}

const NAV_ITEMS: NavItemMeta[] = [
  {
    index: '01',
    label: 'HOME',
    to: '/',
    tagline: 'Opening studio experience & cinematic 3D flagship centerpiece.',
    deliverables: ['Three.js 3D Rig', 'GSAP Animation', 'Editorial Brutalism'],
  },
  {
    index: '02',
    label: 'ABOUT',
    to: '/about',
    tagline: 'Agency manifesto, leadership, creative philosophy & technical rigor.',
    deliverables: ['Est. 2026', 'Award-Winning Pedigree', 'Boutique Scale'],
  },
  {
    index: '03',
    label: 'SERVICES',
    to: '/services',
    tagline: 'Full-spectrum creative technology & digital development capabilities.',
    deliverables: ['Creative Development', 'WebGL & Shaders', 'Design Engineering'],
  },
  {
    index: '04',
    label: 'WORK',
    to: '/work',
    tagline: 'Selected digital flagships & interactive web applications.',
    deliverables: ['14 Deployed Flagships', '3D WebGL Ecosystems', 'Spatial Interactive'],
  },
  {
    index: '05',
    label: 'CONTACT',
    to: '/contact',
    tagline: 'Initiate a project commission or explore partnership opportunities.',
    deliverables: ['Open For Q1/Q2', 'Global Availability', 'Response within 24h'],
  },
  {
    index: '06',
    label: 'DESIGN LAB',
    to: '/lab',
    tagline: 'Architectural token matrix, physics playground & core UI library.',
    deliverables: ['Token Systems', 'Magnetic Physics', 'Component Testing'],
  },
];

export function NavDrawer({ isOpen, onClose }: NavDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLUListElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();
  const [activeItem, setActiveItem] = useState<NavItemMeta>(NAV_ITEMS[0]);

  // Handle Lenis scroll locking
  useEffect(() => {
    const lenis = getLenis();
    if (isOpen) {
      lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start();
      document.body.style.overflow = '';
    }

    return () => {
      lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard accessibility: Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // GSAP Entrance & Exit Timelines
  useEffect(() => {
    if (!overlayRef.current || !curtainRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.set(overlayRef.current, { visibility: 'visible' })
          .fromTo(
            curtainRef.current,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power4.inOut' }
          )
          .fromTo(
            linksContainerRef.current?.children || [],
            { opacity: 0, y: 50, skewY: 3 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.08 },
            '-=0.4'
          )
          .fromTo(
            detailsRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.7 },
            '-=0.6'
          );
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power4.in' } });

        tl.to(linksContainerRef.current?.children || [], {
          opacity: 0,
          y: -30,
          duration: 0.35,
          stagger: 0.03,
        })
          .to(
            curtainRef.current,
            { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.5, ease: 'power4.inOut' },
            '-=0.15'
          )
          .set(overlayRef.current, { visibility: 'hidden' });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
      className="fixed inset-0 z-dropdown invisible overflow-hidden"
    >
      {/* Background Curtain Layer */}
      <div
        ref={curtainRef}
        className="relative flex h-full w-full flex-col justify-between bg-brand-obsidian/95 px-page-x py-12 backdrop-blur-2xl tablet:py-16"
      >
        {/* Subtle structural grid lines */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Drawer Header Controls */}
        <div className="relative z-10 flex items-center justify-between border-b border-brand-border pb-6">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-neon animate-ping" />
            <span className="font-mono text-xs font-bold tracking-widest text-brand-white uppercase">
              STUDIO NAVIGATION
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="group flex items-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-2 font-mono text-xs font-bold tracking-widest text-brand-white uppercase transition-colors hover:border-brand-neon hover:text-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            onMouseEnter={() => setCursor('magnetic', 'CLOSE')}
            onMouseLeave={() => resetCursor()}
          >
            <span>ESC // CLOSE</span>
            <span className="text-brand-neon transition-transform duration-200 group-hover:rotate-90">
              &times;
            </span>
          </button>
        </div>

        {/* Drawer Main Body */}
        <div className="relative z-10 my-auto grid grid-cols-1 items-center gap-12 py-8 laptop:grid-cols-[1.5fr_1fr] laptop:gap-20">
          {/* Left Column: Monumental Navigation Links */}
          <nav aria-label="Main navigation menu">
            <ul ref={linksContainerRef} className="space-y-3 tablet:space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.index} className="overflow-hidden">
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    onMouseEnter={() => {
                      setActiveItem(item);
                      setCursor('magnetic', 'EXPLORE');
                    }}
                    onMouseLeave={() => resetCursor()}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-baseline gap-4 font-display font-extrabold tracking-tighter transition-all duration-300',
                        'text-3xl sm:text-5xl tablet:text-6xl laptop:text-7xl',
                        isActive
                          ? 'text-brand-neon pl-2'
                          : 'text-brand-white hover:text-brand-neon hover:translate-x-3'
                      )
                    }
                  >
                    <span className="font-mono text-xs sm:text-sm font-normal tracking-widest text-brand-muted group-hover:text-brand-neon transition-colors">
                      [{item.index}]
                    </span>
                    <span className="relative">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 h-[2px] w-full scale-x-0 bg-brand-neon transition-transform duration-300 origin-left group-hover:scale-x-100"
                      />
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Column: Dynamic Preview Pane & Agency Coordinates */}
          <div
            ref={detailsRef}
            className="hidden laptop:flex laptop:flex-col laptop:justify-between h-full border-l border-brand-border-subtle pl-12"
          >
            {/* Dynamic Preview Card */}
            <div className="border border-brand-border bg-brand-surface p-8 transition-all duration-300">
              <span className="font-mono text-xs text-brand-neon uppercase tracking-widest">
                // SECTION PREVIEW [{activeItem.index}]
              </span>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-brand-white">
                {activeItem.label}
              </h3>
              <p className="mt-3 font-body text-sm text-brand-muted leading-relaxed">
                {activeItem.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-brand-border-subtle pt-4">
                {activeItem.deliverables.map((d) => (
                  <span
                    key={d}
                    className="rounded border border-brand-border-subtle bg-brand-surface-elevated px-2.5 py-1 font-mono text-[10px] text-brand-white"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Inquiries & Agency Info */}
            <div className="mt-8 space-y-6">
              <div>
                <span className="font-mono text-xs tracking-widest text-brand-muted uppercase">
                  DIRECT INQUIRIES
                </span>
                <div className="mt-1">
                  <a
                    href="mailto:hello@hash.devs"
                    className="font-mono text-sm text-brand-white hover:text-brand-neon transition-colors"
                  >
                    hello@hash.devs
                  </a>
                </div>
              </div>

              <div>
                <span className="font-mono text-xs tracking-widest text-brand-muted uppercase">
                  STUDIO HUBS
                </span>
                <div className="mt-1 flex gap-4 font-mono text-xs text-brand-subtle">
                  <span>SAN FRANCISCO</span>
                  <span>•</span>
                  <span>LONDON</span>
                  <span>•</span>
                  <span>TOKYO</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Status */}
        <div className="relative z-10 flex flex-col justify-between gap-4 border-t border-brand-border pt-6 text-xs font-mono text-brand-subtle sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
            <span>HASH.DEVS // STUDIO ENGINE v0.3.0</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-neon transition-colors"
            >
              GITHUB
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-neon transition-colors"
            >
              TWITTER / X
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-neon transition-colors"
            >
              LINKEDIN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

