import { FOOTER_CONFIG } from './footerConfig';

export function OversizedWordmark() {
  const { logo } = FOOTER_CONFIG;

  return (
    <div
      id="footer-wordmark"
      aria-label="HASH.DEVS Monumental Signature"
      className="relative w-full bg-[#F4F5F3] overflow-hidden select-none flex justify-center text-center leading-none pt-6 sm:pt-10 pb-0"
    >
      {/* Monumental Obsidian Black Official HASH Logo with Controlled Baseline Cropping (Strictly matching Cline reference layout) */}
      <div className="w-full overflow-hidden flex justify-center px-4 sm:px-8">
        <img
          src={logo.darkMonumentalSrc}
          alt={logo.alt}
          className="w-[96vw] max-w-[1720px] h-auto object-contain translate-y-[24%] pointer-events-none select-none"
          width="3300"
          height="868"
          loading="lazy"
        />
      </div>
    </div>
  );
}

