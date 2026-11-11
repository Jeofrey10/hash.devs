import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { NavDrawer } from './NavDrawer';
import { useCursor } from '@/components/ui/CursorContext';
import { cn } from '@/lib/utils';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold for backdrop treatment
      setIsScrolled(currentScrollY > 40);

      // Scroll direction auto-hide behavior
      if (currentScrollY > 180) {
        if (currentScrollY > lastScrollYRef.current + 5) {
          // Scrolling down -> hide header
          setIsVisible(false);
        } else if (currentScrollY < lastScrollYRef.current - 5) {
          // Scrolling up -> show header
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-header transition-all duration-400 ease-out-expo',
          isScrolled
            ? 'py-3.5 bg-brand-obsidian/85 backdrop-blur-md border-b border-brand-border-subtle shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'py-6 tablet:py-8 bg-transparent',
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        )}
      >
        <div className="mx-auto flex w-full max-w-container items-center justify-between px-page-x min-w-0">
          {/* LEFT: HASH.DEVS Official Brand Logo + Neon Green Indicator */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative z-10 flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded py-1"
            onMouseEnter={() => setCursor('magnetic', 'HOME')}
            onMouseLeave={() => resetCursor()}
            aria-label="HASH.DEVS Home"
          >
            {/* Official Logo Image (Retina-sharp 1024x384 asset with preserved aspect ratio) */}
            <img
              src="/images/hashdevs-logo.png"
              alt="HASH.DEVS"
              className="h-7 sm:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              width="1024"
              height="384"
              loading="eager"
              decoding="async"
            />
            <span
              className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse"
              title="Studio Online"
              aria-hidden="true"
            />
          </Link>

          {/* CENTER & RIGHT DESKTOP */}
          <DesktopNavigation
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          {/* MOBILE TOGGLE & FULL-SCREEN MENU */}
          <MobileNavigation
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            onToggle={() => setIsMobileMenuOpen((prev) => !prev)}
          />
        </div>
      </header>

      {/* Full-Screen Drawer (Accessible on Desktop as well via Menu button) */}
      <NavDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}

