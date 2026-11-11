import { MouseEvent } from 'react';
import { MainContainer } from '@/components/layout';
import { FOOTER_CONFIG } from './footerConfig';

export function CollaborationBanner() {
  const { banner } = FOOTER_CONFIG;

  const handleScrollToContact = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetEl = document.getElementById(href.replace('#', ''));
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <section
      id="collaboration-banner"
      aria-label="Collaboration Invitation"
      className="relative w-full bg-brand-neon text-brand-obsidian py-14 sm:py-20 laptop:py-28 overflow-hidden select-none"
    >
      <MainContainer>
        <div className="flex flex-col laptop:flex-row laptop:items-end justify-between gap-10 laptop:gap-16">
          {/* Main Headline: "Let's work together." */}
          <div className="max-w-4xl wide:max-w-5xl">
            <h2 className="font-display leading-[0.92] tracking-tighter text-brand-obsidian text-[2.5rem] xs:text-[3.25rem] sm:text-6xl tablet:text-7xl laptop:text-8xl desktop:text-[6.25rem] wide:text-[7.25rem]">
              <span className="font-light block xs:inline mr-2 sm:mr-4">
                {banner.leadText}
              </span>
              <span className="font-extrabold block xs:inline">
                {banner.accentText}
              </span>
            </h2>
          </div>

          {/* Understated Text Links Alongside Headline (Matching Cline Reference) */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-sans text-sm sm:text-base font-semibold tracking-normal shrink-0 laptop:pb-3">
            {banner.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                onClick={(e) => link.isInternal && handleScrollToContact(e, link.href)}
                className="group relative inline-flex items-center gap-1.5 py-1 text-brand-obsidian transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-obsidian rounded"
                aria-label={link.label}
              >
                <span>{link.label}</span>
                {/* Clean Underline Detail strictly matching reference */}
                <span className="absolute bottom-0.5 left-0 h-[1.5px] w-full bg-brand-obsidian origin-left transition-transform duration-300 group-hover:scale-x-105" />
              </a>
            ))}
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
