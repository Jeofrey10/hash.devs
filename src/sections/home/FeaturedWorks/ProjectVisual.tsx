import { ProjectItem } from './projects';
import {
  Pixwall3DScene,
  VoxAI3DScene,
  IlloraAI3DScene,
  ExperimentalChromeScene,
} from './ProjectVisuals';

interface ProjectVisualProps {
  project: ProjectItem;
  className?: string;
}

interface ProjectSubVisualProps {
  className?: string;
}

export function ProjectVisual({ project, className = '' }: ProjectVisualProps) {
  switch (project.visualType) {
    case 'pixwall':
      return <PixwallVisual className={className} />;
    case 'vox-ai':
      return <VoxAiVisual className={className} />;
    case 'illora-ai':
      return <IlloraAiVisual className={className} />;
    case 'experimental':
      return <ExperimentalVisual className={className} />;
    default:
      return null;
  }
}

/**
 * 01 — PIXWALL: Luxury Digital Art Atelier & 3D Framed Monolith Sculpture
 */
function PixwallVisual({ className }: ProjectSubVisualProps) {
  return (
    <div
      className={`relative w-full h-[270px] sm:h-[310px] laptop:h-[330px] desktop:h-[370px] bg-gradient-to-br from-[#0E100F] via-[#080A09] to-[#040504] overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none ${className}`}
    >
      {/* Background Architectural Gallery Lighting (Warm Soft Spotlight) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(255,255,255,0.08)_0%,transparent_65%)] pointer-events-none" />

      {/* Top Storefront HUD Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px] text-brand-muted tracking-wider">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
          <span className="text-brand-white font-semibold tracking-widest text-[10px] sm:text-xs uppercase">
            PIXWALL ATELIER
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/50 text-[10px] hidden sm:inline">ARCHITECTURAL MONOLITHS</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="border border-white/20 bg-white/[0.04] px-2.5 py-0.5 rounded text-white/80 font-mono">
            EDITION: 18/50
          </span>
          <span className="font-bold text-brand-white text-xs tracking-tight">$620 USD</span>
        </div>
      </div>

      {/* Centerpiece: Real-Time 3D Digital Art Atelier Framed Architectural Sculpture */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1 w-full min-h-[170px] sm:min-h-[190px] laptop:min-h-[210px]">
        <Pixwall3DScene />
      </div>

      {/* Bottom Commerce Action Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-2.5 font-mono text-[10px] text-brand-muted">
        <div className="flex items-center gap-2">
          <span className="text-white/40">CURATION:</span>
          <span className="text-brand-white font-medium">MUSEUM-GRADE ARCHIVAL PIGMENT</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-white transition-colors duration-200 group-hover:text-[#35E85B]">
          <span className="underline underline-offset-4 decoration-white/30 text-[10px] font-semibold">ACQUIRE EDITION</span>
          <span className="text-xs">↗</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 02 — VOX AI: Precision 3D Industrial Voice Hardware Product Showcase
 */
function VoxAiVisual({ className }: ProjectSubVisualProps) {
  return (
    <div
      className={`relative w-full h-[270px] sm:h-[310px] laptop:h-[330px] desktop:h-[370px] bg-gradient-to-br from-[#0B130D] via-[#060B08] to-[#030604] overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none ${className}`}
    >
      {/* Subtle Studio Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-brand-neon/[0.04] blur-3xl pointer-events-none" />

      {/* Top Hardware Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-brand-neon/20 pb-3 font-mono text-[11px] text-brand-muted tracking-wider">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-neon shadow-[0_0_6px_rgba(53,232,91,0.8)]" />
          <span className="text-brand-neon font-bold tracking-widest text-[10px] sm:text-xs">
            VOX.01 // HARDWARE
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/60 text-[10px] hidden sm:inline">ANODIZED 6061-T6</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="border border-brand-neon/30 bg-brand-neon/10 px-2.5 py-0.5 rounded text-brand-neon font-mono font-medium">
            ACTIVE 6-MIC BEAM
          </span>
          <span className="text-white/70 font-mono hidden xs:inline">LATENCY: &lt;5ms</span>
        </div>
      </div>

      {/* Centerpiece: Real-Time 3D Precision Industrial Hardware Chassis */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1 w-full min-h-[170px] sm:min-h-[190px] laptop:min-h-[210px]">
        <VoxAI3DScene />
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-brand-neon/20 pt-2.5 font-mono text-[10px] text-brand-muted">
        <div className="flex items-center gap-2">
          <span className="text-white/40">DSP:</span>
          <span className="text-brand-white font-medium">SUB-MILLI PROTOTYPE INFERENCE</span>
        </div>
        <div className="flex items-center gap-1.5 text-brand-neon transition-colors duration-200">
          <span className="underline underline-offset-4 decoration-brand-neon/40 text-[10px] font-semibold">CHASSIS TELEMETRY</span>
          <span className="text-xs">↗</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 03 — ILLORA AI: Autonomous Enterprise Multi-Agent DAG 3D Architecture
 */
function IlloraAiVisual({ className }: ProjectSubVisualProps) {
  return (
    <div
      className={`relative w-full h-[270px] sm:h-[310px] laptop:h-[330px] desktop:h-[370px] bg-gradient-to-br from-[#09111E] via-[#050A13] to-[#020508] overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none ${className}`}
    >
      {/* Background Cybernetic Blue Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#4DA6FF]/[0.06] blur-3xl pointer-events-none" />

      {/* Top Enterprise Console Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#4DA6FF]/20 pb-3 font-mono text-[11px] text-brand-muted tracking-wider">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#4DA6FF] shadow-[0_0_6px_rgba(77,166,255,0.8)]" />
          <span className="text-[#4DA6FF] font-bold tracking-widest text-[10px] sm:text-xs">
            ILLORA // PIPELINE #8492
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/60 text-[10px] hidden sm:inline">AUTONOMOUS DAG</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="border border-[#4DA6FF]/35 bg-[#4DA6FF]/10 px-2.5 py-0.5 rounded text-[#4DA6FF] font-bold font-mono">
            SYNC: NOMINAL
          </span>
          <span className="text-white/70 font-mono hidden xs:inline">100% HEALTH</span>
        </div>
      </div>

      {/* Centerpiece: Real-Time 3D Autonomous Multi-Agent DAG Intelligence Architecture */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1 w-full min-h-[170px] sm:min-h-[190px] laptop:min-h-[210px]">
        <IlloraAI3DScene />
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#4DA6FF]/20 pt-2.5 font-mono text-[10px] text-brand-muted">
        <div className="flex items-center gap-2">
          <span className="text-white/40">TELEMETRY:</span>
          <span className="text-brand-white font-medium">REAL-TIME DAG CONCURRENCY</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#4DA6FF] transition-colors duration-200">
          <span className="underline underline-offset-4 decoration-[#4DA6FF]/40 text-[10px] font-semibold">PIPELINE ARCHITECTURE</span>
          <span className="text-xs">↗</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 04 — EXPERIMENTAL WORKS: Real-Time 3D Liquid Chrome CGI Laboratory
 */
function ExperimentalVisual({ className }: ProjectSubVisualProps) {
  return (
    <div
      className={`relative w-full h-[270px] sm:h-[310px] laptop:h-[330px] desktop:h-[370px] bg-gradient-to-br from-[#110D1A] via-[#090710] to-[#040306] overflow-hidden flex flex-col justify-between p-5 sm:p-6 select-none ${className}`}
    >
      {/* Background Chromatic Iridescent Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#C084FC]/[0.06] blur-3xl pointer-events-none" />

      {/* Top Shader Lab Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#C084FC]/20 pb-3 font-mono text-[11px] text-brand-muted tracking-wider">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C084FC]" />
          <span className="text-[#C084FC] font-bold tracking-widest text-[10px] sm:text-xs">
            CGI.LAB // LIQUID CHROME
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-white/50 text-[10px] hidden sm:inline">GLSL RAYMARCH</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="border border-[#C084FC]/30 bg-[#C084FC]/10 px-2.5 py-0.5 rounded text-[#C084FC] font-mono">
            60 FPS ACTIVE
          </span>
          <span className="text-white/60 font-mono hidden xs:inline">ACES TONE</span>
        </div>
      </div>

      {/* Centerpiece: Real-Time 3D Interactive Three.js Liquid Chrome Torus Knot */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-1 w-full min-h-[170px] sm:min-h-[190px] laptop:min-h-[210px]">
        <ExperimentalChromeScene />
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-[#C084FC]/20 pt-2.5 font-mono text-[10px] text-brand-muted">
        <div className="flex items-center gap-2">
          <span className="text-white/40">TECH:</span>
          <span className="text-brand-white font-medium">PROCEDURAL PMREM SHADER PIPELINE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#C084FC] transition-colors duration-200">
          <span className="underline underline-offset-4 decoration-[#C084FC]/40 text-[10px] font-semibold">VIEW EXPERIMENT</span>
          <span className="text-xs">↗</span>
        </div>
      </div>
    </div>
  );
}
