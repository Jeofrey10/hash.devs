import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CASE_STUDIES } from './caseStudies';
import { CaseStudyHero } from './CaseStudyHero';
import { CaseStudyStory } from './CaseStudyStory';
import { CaseStudyVisual } from './CaseStudyVisual';
import { CaseStudyNavigation } from './CaseStudyNavigation';
import { CaseStudyTransition } from './CaseStudyTransition';
import { initCaseStudyAnimations } from './CaseStudyAnimations';
import NotFound from '@/pages/NotFound';

export default function CaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const pageRef = useRef<HTMLDivElement>(null);

  // Validate project id
  const caseStudy = id ? CASE_STUDIES[id] : null;

  // Scroll to top and set document title on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (caseStudy) {
      document.title = `${caseStudy.title} // Case Study — HASH.DEVS`;
    }
  }, [id, caseStudy]);

  // Initialize GSAP scroll animations
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const cleanup = initCaseStudyAnimations(page);
    return () => cleanup();
  }, [id]);

  if (!caseStudy) {
    return <NotFound />;
  }

  return (
    <div ref={pageRef} className="relative w-full bg-brand-obsidian min-h-screen text-brand-white">
      {/* 1. Cinematic Coordinated Route Transition Curtain */}
      <CaseStudyTransition
        key={`transition-${caseStudy.id}`}
        projectIndex={caseStudy.index}
        projectTitle={caseStudy.title}
      />

      {/* 2. Immersive Hero Section */}
      <CaseStudyHero caseStudy={caseStudy} />

      {/* 3. Project Overview & 4-Part Editorial Narrative */}
      <CaseStudyStory caseStudy={caseStudy} />

      {/* 4. Full-Width Visual Showcase, Architecture & Closing Statement */}
      <CaseStudyVisual caseStudy={caseStudy} />

      {/* 5. Previous / Next Project Navigation & Return Link */}
      <CaseStudyNavigation caseStudy={caseStudy} />
    </div>
  );
}

