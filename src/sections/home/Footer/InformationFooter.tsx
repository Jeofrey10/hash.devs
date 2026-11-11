import { MainContainer } from '@/components/layout';
import { FOOTER_CONFIG } from './footerConfig';

export function InformationFooter() {
  const { info } = FOOTER_CONFIG;

  return (
    <div
      id="information-footer"
      className="relative w-full bg-[#F4F5F3] text-brand-obsidian pt-16 sm:pt-24 pb-8 sm:pb-12 select-none"
    >
      <MainContainer>
        {/* Exact Cline Reference Information Grid: Left socials & legal, Right studio hubs */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-12 laptop:gap-16 items-start">
          {/* Left Column (Laptop: col-span-6): Social Links & Legal */}
          <div className="laptop:col-span-6 flex flex-col justify-between gap-10 sm:gap-12">
            {/* Social Links (Matching Cline in, ig, tw minimal style) */}
            <div className="flex items-center gap-5 sm:gap-6 text-black/85">
              {info.socials.map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center p-1 text-black/80 hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-obsidian rounded"
                  aria-label={`Visit HASH.DEVS on ${s.label}`}
                >
                  {s.icon === 'linkedin' && (
                    <span className="font-bold font-sans text-base leading-none tracking-tight underline underline-offset-4 decoration-black/30 group-hover:decoration-black">
                      in
                    </span>
                  )}
                  {s.icon === 'instagram' && (
                    <svg className="w-4.5 h-4.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  )}
                  {s.icon === 'github' && (
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  )}
                  {s.icon === 'twitter' && (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>

            {/* Copyright, Terms of Use, Privacy Policy (Clean single-line matching Cline reference) */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-7 font-sans text-xs sm:text-sm text-black/60">
              <span className="font-medium text-black/75">{info.copyright}</span>
              {info.legal.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-obsidian rounded underline underline-offset-2 decoration-transparent hover:decoration-black/40"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column (Laptop: col-span-6): Studio Hubs 2-Column Layout (Matching Raleigh & Charlotte in Cline) */}
          <div className="laptop:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 laptop:justify-end">
            {info.hubs.map((hub, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 text-xs sm:text-sm text-black/65 font-sans">
                <span className="font-bold text-sm sm:text-base text-brand-obsidian tracking-tight">
                  {hub.city}
                </span>
                {hub.address.map((line, lIdx) => (
                  <span key={lIdx} className="leading-relaxed">
                    {line}
                  </span>
                ))}
                <a
                  href={hub.contact.includes('@') ? `mailto:${hub.contact}` : `tel:${hub.contact.replace(/[^\d+]/g, '')}`}
                  className="mt-1 font-mono text-xs font-semibold text-brand-obsidian hover:text-black hover:underline underline-offset-2 transition-colors inline-block"
                >
                  {hub.contact}
                </a>
              </div>
            ))}
          </div>
        </div>
      </MainContainer>
    </div>
  );
}

