import { useRef, useEffect } from 'react';
import { CollaborationBanner } from './CollaborationBanner';
import { InformationFooter } from './InformationFooter';
import { OversizedWordmark } from './OversizedWordmark';
import { initFooterAnimations } from './FooterAnimations';

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const bannerElement = footer.querySelector<HTMLElement>('section[aria-label="Collaboration Invitation"]');
    const wordmarkElement = footer.querySelector<HTMLElement>('#footer-wordmark');

    const cleanup = initFooterAnimations({
      footerElement: footer,
      bannerElement,
      wordmarkElement,
    });

    return () => cleanup();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="site-footer"
      role="contentinfo"
      aria-label="HASH.DEVS Studio Footer"
      className="relative w-full overflow-hidden"
    >
      {/* Zone A: Collaboration Banner (#35E85B Background) */}
      <CollaborationBanner />

      {/* Zone B: Information Footer (#F4F5F3 Background) */}
      <InformationFooter />

      {/* Zone C: Monumental Oversized HASH.DEVS Wordmark */}
      <OversizedWordmark />
    </footer>
  );
}
