import { Outlet } from 'react-router-dom';
import { SmoothScrollProvider } from './SmoothScrollProvider';
import { CursorProvider, CustomCursor } from '@/components/ui';
import { Navigation } from '@/components/navigation';
import { PreloaderProvider, CinematicPreloader } from '@/components/preloader';

export function RootLayout() {
  return (
    <PreloaderProvider>
      <CursorProvider>
        <SmoothScrollProvider>
          <div className="relative min-h-screen w-full bg-brand-obsidian text-brand-white selection:bg-brand-neon selection:text-brand-obsidian">
            <CinematicPreloader />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand-neon focus:text-brand-obsidian focus:font-mono focus:text-xs focus:font-bold focus:rounded-md focus:shadow-lg focus:outline-none"
            >
              Skip to main content
            </a>
            <CustomCursor />
            <Navigation />
            <main id="main-content" className="relative w-full">
              <Outlet />
            </main>
          </div>
        </SmoothScrollProvider>
      </CursorProvider>
    </PreloaderProvider>
  );
}
