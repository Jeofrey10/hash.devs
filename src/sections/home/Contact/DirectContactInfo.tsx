import { useState } from 'react';
import {
  STUDIO_CONTACT_INFO,
  buildGeneralInquiryMailto,
} from './contactConfig';

export function DirectContactInfo() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(STUDIO_CONTACT_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (STUDIO_CONTACT_INFO.phoneRaw) {
      navigator.clipboard.writeText(STUDIO_CONTACT_INFO.phoneRaw);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const generalMailto = buildGeneralInquiryMailto();

  return (
    <div className="relative flex flex-col justify-between h-full bg-[#0E1210] border border-brand-border/80 rounded-2xl p-6 sm:p-8 laptop:p-10 shadow-xl">
      {/* Precision Corner Brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-border"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-border"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-border"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-border"
      />

      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Header HUD */}
        <div className="border-b border-brand-border/60 pb-4 font-mono text-xs">
          <span className="text-brand-white font-bold tracking-widest uppercase">
            DIRECT COMMUNICATION
          </span>
        </div>

        {/* 01. EMAIL US */}
        <div className="group rounded-xl border border-brand-border/70 hover:border-brand-neon/60 bg-[#050706] p-5 sm:p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs tracking-widest text-brand-neon font-bold uppercase flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
              <span>EMAIL US</span>
            </span>
            <span className="font-mono text-[10px] text-brand-muted">DIRECT INBOX</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <a
              href={generalMailto}
              className="font-mono text-lg sm:text-xl font-bold text-brand-white hover:text-brand-neon transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded px-1 -ml-1 break-all"
              title="Open default email application"
              aria-label="Email hello@hash.devs"
            >
              {STUDIO_CONTACT_INFO.email}
            </a>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={generalMailto}
                className="px-3.5 py-1.5 rounded-lg bg-brand-neon/10 hover:bg-brand-neon/20 border border-brand-neon/40 hover:border-brand-neon font-mono text-[11px] font-bold text-brand-neon transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
              >
                COMPOSE ↗
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon font-mono text-[11px] text-brand-white hover:text-brand-neon transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
                aria-label="Copy studio email address to clipboard"
              >
                {copiedEmail ? 'COPIED ✓' : 'COPY'}
              </button>
            </div>
          </div>

          <p className="mt-3 font-mono text-[11px] text-brand-muted/80 border-t border-brand-border/40 pt-2.5">
            {STUDIO_CONTACT_INFO.responseGuarantee}
          </p>
        </div>

        {/* 02. CALL US */}
        <div className="group rounded-xl border border-brand-border/70 hover:border-brand-neon/60 bg-[#050706] p-5 sm:p-6 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs tracking-widest text-brand-neon font-bold uppercase flex items-center gap-2">
              <span>📞</span>
              <span>CALL US</span>
            </span>
            <span className="font-mono text-[10px] text-brand-muted">
              {STUDIO_CONTACT_INFO.phone ? 'DIRECT TEL' : 'PENDING VERIFICATION'}
            </span>
          </div>

          {STUDIO_CONTACT_INFO.phone && STUDIO_CONTACT_INFO.phoneTel ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <a
                href={STUDIO_CONTACT_INFO.phoneTel}
                className="font-mono text-lg sm:text-xl font-bold text-brand-white hover:text-brand-neon transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded px-1 -ml-1"
                title="Call studio directly"
                aria-label={`Call studio at ${STUDIO_CONTACT_INFO.phone}`}
              >
                {STUDIO_CONTACT_INFO.phone}
              </a>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={STUDIO_CONTACT_INFO.phoneTel}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-neon/10 hover:bg-brand-neon/20 border border-brand-neon/40 hover:border-brand-neon font-mono text-[11px] font-bold text-brand-neon transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
                >
                  CALL NOW ↗
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-3 py-1.5 rounded-lg bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon font-mono text-[11px] text-brand-white hover:text-brand-neon transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
                  aria-label="Copy studio phone number to clipboard"
                >
                  {copiedPhone ? 'COPIED ✓' : 'COPY'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-mono text-sm text-brand-white/80">
                Direct phone line unpublished.
              </p>
              <p className="font-body text-xs text-brand-muted mt-1 leading-relaxed">
                Contact numbers are published once verified by studio leadership. Please initiate contact via email above.
              </p>
            </div>
          )}

          <p className="mt-3 font-mono text-[11px] text-brand-muted/80 border-t border-brand-border/40 pt-2.5">
            {STUDIO_CONTACT_INFO.phoneHours}
          </p>
        </div>
      </div>

      {/* Editorial Assurance */}
      <div className="mt-8 pt-5 border-t border-brand-border/60 font-mono text-xs text-brand-muted flex items-center justify-between">
        <span>COMMISSION ADVISORY</span>
        <span className="text-brand-white font-medium">DISCRETION GUARANTEED</span>
      </div>
    </div>
  );
}
