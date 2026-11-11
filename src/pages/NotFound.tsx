import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 // Page Not Found — HASH.DEVS';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-brand-obsidian text-brand-white flex items-center justify-center pt-24 pb-20">
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <MainContainer>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="mb-6 flex justify-center">
            <EyebrowLabel indicator index="404" className="text-brand-neon font-bold">
              ROUTE ANOMALY // 404
            </EyebrowLabel>
          </div>

          <h1 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.95] text-[clamp(2.5rem,6vw,5.5rem)] uppercase mb-6">
            THE DIGITAL VOID. <br />
            <span className="text-brand-neon">PAGE NOT FOUND.</span>
          </h1>

          <p className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-xl mx-auto mb-10">
            The coordinate you requested does not exist in the HASH.DEVS digital architecture or has been decommissioned.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-3.5 rounded-full bg-brand-neon hover:bg-[#2ED150] text-brand-obsidian font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(53,232,91,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon"
            >
              ← RETURN HOME
            </Link>
            <Link
              to="/work"
              className="px-8 py-3.5 rounded-full bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon text-brand-white hover:text-brand-neon font-mono text-xs font-bold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            >
              EXPLORE ARCHIVE ↗
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-brand-border hover:border-brand-border-hover text-brand-muted hover:text-brand-white font-mono text-xs font-semibold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            >
              START A PROJECT ↗
            </Link>
          </div>

          {/* Technical Telemetry Badge */}
          <div className="mt-16 pt-8 border-t border-brand-border/40 font-mono text-[11px] text-brand-muted/70 flex flex-wrap items-center justify-center gap-4">
            <span>HTTP STATUS: 404 NOT FOUND</span>
            <span>•</span>
            <span>HASH.DEVS CORE ROUTER</span>
            <span>•</span>
            <span className="text-brand-neon">RECOVERY READY</span>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}

