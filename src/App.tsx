import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import Home from '@/pages/Home';

// Lazy-load secondary routes for optimal initial chunk size & bundle splitting
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Work = lazy(() => import('@/pages/Work'));
const Contact = lazy(() => import('@/pages/Contact'));
const CaseStudyPage = lazy(() =>
  import('@/sections/home/CaseStudies').then((mod) => ({ default: mod.CaseStudyPage }))
);
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageFallback() {
  return (
    <div className="min-h-screen w-full bg-brand-obsidian flex items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-xs text-brand-muted">
        <span className="h-2 w-2 rounded-full bg-brand-neon animate-pulse" />
        <span>INITIALIZING STUDIO MODULE...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:id" element={<CaseStudyPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
