import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { gsap } from '@/lib/animations';
import { getLenis } from '@/lib/animations';
import { useCursor } from '@/components/ui/CursorContext';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AudioController } from './AudioController';
import { cn } from '@/lib/utils';

export interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const MOBILE_LINKS = [
  { index: '01', label: 'Home', to: '/' },
  { index: '02', label: 'About', to: '/about' },
  { index: '03', label: 'Services', to: '/services' },
  { index: '04', label: 'Work', to: '/work' },
  { index: '05', label: 'Contact', to: '/contact' },
  { index: '06', label: 'Design Lab', to: '/lab' },
];

export function MobileNavigation({ isOpen, onClose, onToggle }: MobileNavigationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Handle Lenis scroll locking & body scroll
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

  // Keyboard accessibility: Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Entrance and Exit Animations with GSAP
  useEffect(() => {
    if (!overlayRef.current || !curtainRef.current) return;

    const ctx = gsap.context(() => {
      if (isOpen) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        tl.set(overlayRef.current, { visibility: 'visible' })
          .fromTo(
            curtainRef.current,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power4.inOut' }
          )
          .fromTo(
            linksRef.current?.children || [],
            { opacity: 0, y: 40, skewY: 2 },
            { opacity: 1, y: 0, skewY: 0, duration: 0.75, stagger: 0.06 },
            '-=0.3'
          )
          .fromTo(
            metaRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.4'
          );
      } else {
        const tl = gsap.timeline({ defaults: { ease: 'power3.in' } });

        tl.to(linksRef.current?.children || [], {
          opacity: 0,
          y: -20,
          duration: 0.3,
          stagger: 0.02,
        })
          .to(
            curtainRef.current,
            { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.45, ease: 'power4.inOut' },
            '-=0.15'
          )
          .set(overlayRef.current, { visibility: 'hidden' });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <>
      {/* Mobile Toggle Button (Visible on mobile/tablet) */}
      <div className="flex items-center gap-2 laptop:hidden">
        <AudioController />

        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-brand-surface/80 backdrop-blur-md transition-colors hover:border-brand-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon"
          onMouseEnter={() => setCursor('magnetic', isOpen ? 'CLOSE' : 'MENU')}
          onMouseLeave={() => resetCursor()}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <span
              className={cn(
                'h-[1.5px] w-5 bg-brand-white transition-all duration-300',
                isOpen ? 'translate-y-[4.5px] rotate-45 bg-brand-neon' : ''
              )}
            />
            <span
              className={cn(
                'h-[1.5px] w-5 bg-brand-white transition-all duration-300',
                isOpen ? '-translate-y-[3px] -rotate-45 bg-brand-neon' : 'group-hover:bg-brand-neon'
              )}
            />
          </div>
        </button>
      </div>

      {/* Full-Screen Dark Navigation Overlay */}
      <div
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Site Navigation"
        className="fixed inset-0 z-dropdown invisible overflow-hidden laptop:hidden"
      >
        <div
          ref={curtainRef}
          className="relative flex h-full w-full flex-col justify-between overflow-y-auto bg-brand-obsidian/98 px-6 py-8 backdrop-blur-2xl sm:px-10"
        >
          {/* Subtle structural grid lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Top Bar inside Drawer */}
          <div className="relative z-10 flex items-center justify-between border-b border-brand-border pb-6">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/hashdevs-logo.png"
                alt="HASH.DEVS"
                className="h-6 w-auto object-contain"
                width="1024"
                height="384"
              />
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-white hover:border-brand-neon hover:text-brand-neon transition-colors"
            >
              &times;
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="relative z-10 my-auto py-8">
            <ul ref={linksRef} className="space-y-4">
              {MOBILE_LINKS.map((link) => (
                <li key={link.to} className="overflow-hidden">
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-baseline gap-4 font-display text-4xl sm:text-5xl font-extrabold tracking-tight transition-all duration-200',
                        isActive
                          ? 'text-brand-neon pl-2'
                          : 'text-brand-white active:text-brand-neon'
                      )
                    }
                  >
                    <span className="font-mono text-xs text-brand-muted font-normal">
                      [{link.index}]
                    </span>
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions & Metadata */}
          <div ref={metaRef} className="relative z-10 space-y-6 border-t border-brand-border pt-6">
            <PrimaryButton href="/contact" size="md" className="w-full text-center">
              Let's Talk — Start a Project
            </PrimaryButton>

            <div className="flex items-center justify-between font-mono text-xs text-brand-subtle">
              <span>EST. 2026 // STUDIO</span>
              <a href="mailto:hello@hash.devs" className="text-brand-muted hover:text-brand-neon">
                hello@hash.devs
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

