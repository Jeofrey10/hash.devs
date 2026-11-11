import { NavLink } from 'react-router-dom';
import { useCursor } from '@/components/ui/CursorContext';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { AudioController } from './AudioController';
import { cn } from '@/lib/utils';

export interface NavLinkItem {
  label: string;
  to: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/work' },
];

export interface DesktopNavigationProps {
  onOpenMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export function DesktopNavigation({ onOpenMobileMenu, isMobileMenuOpen }: DesktopNavigationProps) {
  const { setCursor, resetCursor } = useCursor();

  return (
    <div className="hidden laptop:flex items-center justify-between w-full">
      {/* Center Nav Links */}
      <nav aria-label="Desktop Navigation" className="absolute left-1/2 -translate-x-1/2">
        <ul className="flex items-center gap-1 rounded-full border border-brand-border/60 bg-brand-surface/40 p-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => resetCursor()}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center px-4 py-2 font-mono text-xs font-semibold tracking-wider uppercase transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded-full',
                    isActive
                      ? 'text-brand-white bg-brand-surface-elevated/80'
                      : 'text-brand-muted hover:text-brand-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span
                        className="mr-2 h-1.5 w-1.5 rounded-full bg-brand-neon shadow-[0_0_8px_rgba(53,232,91,0.8)]"
                        aria-hidden="true"
                      />
                    )}
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-4 right-4 h-[1px] origin-left scale-x-0 bg-brand-neon transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right Controls: Audio Controller + Let's Talk CTA + Menu Toggle */}
      <div className="flex items-center gap-4 ml-auto">
        <AudioController />

        <PrimaryButton
          size="sm"
          href="/contact"
          magnetic
          className="shadow-[0_0_20px_rgba(53,232,91,0.15)] hover:shadow-[0_0_25px_rgba(53,232,91,0.3)]"
        >
          Let's Talk
        </PrimaryButton>

        {/* Menu Indicator Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-brand-surface/60 backdrop-blur-sm transition-all duration-300 hover:border-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
          onMouseEnter={() => setCursor('magnetic', 'MENU')}
          onMouseLeave={() => resetCursor()}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span
              className={cn(
                'h-[1.5px] w-4 bg-brand-white transition-all duration-300',
                isMobileMenuOpen ? 'translate-y-[2.5px] rotate-45 bg-brand-neon' : 'group-hover:w-5'
              )}
            />
            <span
              className={cn(
                'h-[1.5px] w-4 bg-brand-white transition-all duration-300',
                isMobileMenuOpen ? '-translate-y-[3px] -rotate-45 bg-brand-neon' : 'group-hover:w-3 group-hover:bg-brand-neon'
              )}
            />
          </div>
        </button>
      </div>
    </div>
  );
}

