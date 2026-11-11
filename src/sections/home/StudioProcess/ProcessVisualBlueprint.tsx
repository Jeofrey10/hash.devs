import { useMemo } from 'react';
import { ProcessStage } from './processData';

interface ProcessVisualBlueprintProps {
  stage: ProcessStage;
  className?: string;
}

export function ProcessVisualBlueprint({ stage, className = '' }: ProcessVisualBlueprintProps) {
  return (
    <div
      className={`relative w-full h-[320px] sm:h-[380px] laptop:h-[460px] desktop:h-[500px] rounded-2xl border border-brand-border/80 bg-brand-surface/90 backdrop-blur-md overflow-hidden flex flex-col justify-between p-6 sm:p-8 select-none shadow-2xl transition-all duration-700 ${className}`}
    >
      {/* Corner Precision Machined Registration Brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-border/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-border/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-border/80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-border/80"
      />

      {/* Top Header HUD */}
      <div className="relative z-10 flex items-center justify-between border-b border-brand-border/60 pb-3 sm:pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-brand-neon animate-pulse" />
          <span className="text-brand-white font-bold tracking-widest uppercase">
            {stage.phaseCode}
          </span>
          <span className="text-brand-border hidden sm:inline">•</span>
          <span className="text-brand-neon text-[11px] font-semibold tracking-wider hidden sm:inline">
            {stage.kicker}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded border border-brand-neon/30 bg-brand-neon/10 px-2 py-0.5 text-[10px] font-mono font-bold text-brand-neon">
            {stage.index} // ACTIVE
          </span>
        </div>
      </div>

      {/* Center Dynamic Blueprint Composition */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-3 overflow-hidden">
        {stage.blueprintType === 'discover' && <DiscoverBlueprint />}
        {stage.blueprintType === 'strategy' && <StrategyBlueprint />}
        {stage.blueprintType === 'engineer' && <EngineerBlueprint />}
        {stage.blueprintType === 'evolve' && <EvolveBlueprint />}
      </div>

      {/* Bottom Architectural Telemetry Footer */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-brand-border/60 pt-3 sm:pt-4 font-mono text-[10px] sm:text-xs text-brand-muted">
        <div className="flex items-center gap-2">
          <span className="text-white/40">FOCUS:</span>
          <span className="text-brand-white font-semibold tracking-wider">{stage.focusPill}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-neon">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
          <span className="font-semibold tracking-widest text-[10px] uppercase">
            STAGE EXECUTION // VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Stage 01: Discover & Define — Analytical Triangulation Matrix
 */
function DiscoverBlueprint() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Radial Grid */}
      <div className="absolute w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-brand-border/40" />
      <div className="absolute w-40 sm:w-52 h-40 sm:h-52 rounded-full border border-brand-border/30 border-dashed" />
      <div className="absolute w-24 sm:w-32 h-24 sm:h-32 rounded-full border border-brand-neon/20" />

      {/* Axis Hairlines */}
      <div className="absolute inset-x-4 top-1/2 h-[1px] bg-brand-border/40" />
      <div className="absolute inset-y-4 left-1/2 w-[1px] bg-brand-border/40" />

      {/* Triangulation Area Polygon */}
      <svg className="w-56 sm:w-72 h-56 sm:h-72 overflow-visible" viewBox="0 0 200 200">
        <polygon
          points="100,30 170,160 30,150"
          fill="rgba(53, 232, 91, 0.06)"
          stroke="#35E85B"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        {/* Nodes */}
        <circle cx="100" cy="30" r="4" fill="#35E85B" />
        <circle cx="170" cy="160" r="4" fill="#35E85B" />
        <circle cx="30" cy="150" r="4" fill="#35E85B" />

        {/* Center Triangulated Target */}
        <circle cx="100" cy="113" r="3" fill="#FFFFFF" />
        <circle cx="100" cy="113" r="8" stroke="#FFFFFF" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>

      {/* Vertex Metric Labels */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-surface/90 border border-brand-border px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono text-white/90">
        PROBLEM SPACE [01]
      </div>
      <div className="absolute bottom-6 right-4 sm:right-8 bg-brand-surface/90 border border-brand-border px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono text-white/90">
        AUDIENCE NEEDS [02]
      </div>
      <div className="absolute bottom-8 left-4 sm:left-8 bg-brand-surface/90 border border-brand-border px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-mono text-white/90">
        FEASIBILITY [03]
      </div>

      {/* Center Validation Badge */}
      <div className="absolute bg-[#0B0D0C]/95 border border-brand-neon/40 px-3 py-1 rounded-full text-[9px] font-mono text-brand-neon font-bold shadow-lg">
        TRIANGULATION: 100%
      </div>
    </div>
  );
}

/**
 * Stage 02: Strategy & Direction — Modular System Blueprint
 */
function StrategyBlueprint() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 max-w-[380px] px-2">
      {/* 12-Column Architectural System Grid */}
      <div className="w-full flex justify-between gap-1 h-6 px-1 border-b border-brand-border/60 pb-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-white/[0.04] border-t border-brand-border/40 h-full flex items-center justify-center font-mono text-[7px] text-white/30"
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Layer 1: Experience Architecture */}
      <div className="w-full bg-[#111412] border border-brand-border rounded-lg p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold text-brand-neon">[01]</span>
          <span className="font-mono text-[10px] sm:text-xs font-semibold text-brand-white">
            INFORMATION ARCHITECTURE
          </span>
        </div>
        <span className="font-mono text-[8px] text-white/60">HIERARCHY MAP</span>
      </div>

      {/* Vector Conduit */}
      <div className="w-full flex justify-around px-8 h-3">
        <div className="w-[1px] h-full bg-brand-neon/60" />
        <div className="w-[1px] h-full bg-brand-neon/60" />
      </div>

      {/* Layer 2: Design Token & Creative Direction Engine */}
      <div className="w-full grid grid-cols-2 gap-2.5">
        <div className="bg-[#111412] border border-brand-border rounded-lg p-2.5">
          <div className="font-mono text-[8px] text-brand-neon mb-1">DESIGN LANGUAGE</div>
          <div className="font-mono text-[10px] font-semibold text-white/90">SYNE + MANROPE</div>
          <div className="mt-1 flex gap-1">
            <span className="h-2 w-2 rounded-full bg-[#050505] border border-white/20" />
            <span className="h-2 w-2 rounded-full bg-[#35E85B]" />
            <span className="h-2 w-2 rounded-full bg-[#FFFFFF]" />
            <span className="h-2 w-2 rounded-full bg-[#171A18]" />
          </div>
        </div>

        <div className="bg-[#111412] border border-brand-border rounded-lg p-2.5">
          <div className="font-mono text-[8px] text-brand-neon mb-1">TECH ARCHITECTURE</div>
          <div className="font-mono text-[10px] font-semibold text-white/90">REACT + THREE.JS</div>
          <div className="mt-1 text-[8px] font-mono text-white/50">MODULAR CHUNKING</div>
        </div>
      </div>

      {/* Layer 3: Execution Target */}
      <div className="w-full bg-brand-neon/[0.06] border border-brand-neon/30 rounded-lg p-2 flex items-center justify-between font-mono text-[9px]">
        <span className="text-brand-neon font-bold">STATUS: BLUEPRINT RATIFIED</span>
        <span className="text-white/60">EST. BUDGET: 60 FPS</span>
      </div>
    </div>
  );
}

/**
 * Stage 03: Design & Engineer — Engineering Crucible
 */
function EngineerBlueprint() {
  const metrics = useMemo(
    () => [
      { label: 'FRAME BUDGET', val: '16.6ms' },
      { label: 'RENDER TARGET', val: '60 FPS' },
      { label: 'LAYOUT JANK', val: '0.00' },
      { label: 'TYPE SAFETY', val: '100%' },
    ],
    []
  );

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 max-w-[380px] px-2 font-mono">
      {/* Active Code / Engineering Crucible HUD */}
      <div className="w-full bg-[#0A0D0B] border border-brand-border rounded-lg p-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-2 text-[8px] text-white/50 mb-2">
          <span>PIPELINE: VITE + TS + THREE.JS + GSAP</span>
          <span className="text-brand-neon">LIVE BUILD OK</span>
        </div>

        <div className="text-[10px] space-y-1 text-white/80">
          <div>
            <span className="text-brand-neon">const</span> studio = <span className="text-[#60A5FA]">new</span>{' '}
            <span className="text-[#FBBF24]">CreativeEngine</span>();
          </div>
          <div>
            studio.<span className="text-[#34D399]">mountHardwareAcceleratedScene</span>();
          </div>
          <div className="text-white/50 pl-4">// 60 FPS requestAnimationFrame synchronized ticker</div>
          <div>
            studio.<span className="text-[#34D399]">enforceZeroLayoutJank</span>();
          </div>
        </div>
      </div>

      {/* Metric Telemetry Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#111412] border border-brand-border rounded p-2 text-center">
            <span className="block text-[7px] text-white/40 uppercase">{m.label}</span>
            <span className="block text-xs font-bold text-brand-white mt-0.5">{m.val}</span>
          </div>
        ))}
      </div>

      {/* Engineering Certification */}
      <div className="w-full flex items-center justify-between border-t border-brand-border/60 pt-2 text-[9px] text-white/60">
        <span>STRICT MEMORY CLEANUP: GUARANTEED</span>
        <span className="text-brand-neon font-bold">ZERO MEMORY LEAKS</span>
      </div>
    </div>
  );
}

/**
 * Stage 04: Launch & Evolve — Production Edge Telemetry
 */
function EvolveBlueprint() {
  const nodes = useMemo(
    () => [
      { city: 'NYC', ping: '4ms', status: 'ACTIVE' },
      { city: 'LON', ping: '11ms', status: 'ACTIVE' },
      { city: 'FRA', ping: '14ms', status: 'ACTIVE' },
      { city: 'TYO', ping: '22ms', status: 'ACTIVE' },
    ],
    []
  );

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-3 max-w-[380px] px-2 font-mono">
      {/* Global Edge Distribution Mesh */}
      <div className="w-full bg-[#0A0D0B] border border-brand-border rounded-lg p-3">
        <div className="flex items-center justify-between border-b border-brand-border/60 pb-2 text-[8px] text-white/50 mb-2">
          <span>EDGE CDN ORCHESTRATION</span>
          <span className="text-brand-neon font-bold">GLOBAL // 100% UPTIME</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          {nodes.map((n, i) => (
            <div key={i} className="bg-[#121613] border border-brand-border/60 rounded p-1.5">
              <span className="block text-[8px] text-white/60 font-bold">{n.city}</span>
              <span className="block text-[10px] font-bold text-brand-neon">{n.ping}</span>
              <span className="block text-[6.5px] text-[#34D399]">{n.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continuous Improvement Loop */}
      <div className="w-full bg-[#111412] border border-brand-border rounded-lg p-2.5 flex items-center justify-between text-[9px]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
          <span className="text-white/80 font-bold">EVOLUTION LOOP:</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/60 text-[8px]">
          <span>DEPLOY</span>
          <span>→</span>
          <span>MEASURE</span>
          <span>→</span>
          <span>REFINE</span>
        </div>
      </div>

      {/* Performance Benchmarks */}
      <div className="w-full grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#111412] border border-brand-border rounded p-1.5">
          <span className="block text-[7px] text-white/40">LIGHTHOUSE</span>
          <span className="text-xs font-bold text-brand-neon">100 / 100</span>
        </div>
        <div className="bg-[#111412] border border-brand-border rounded p-1.5">
          <span className="block text-[7px] text-white/40">FCP TARGET</span>
          <span className="text-xs font-bold text-brand-white">&lt; 0.8s</span>
        </div>
        <div className="bg-[#111412] border border-brand-border rounded p-1.5">
          <span className="block text-[7px] text-white/40">ZERO-DOWNTIME</span>
          <span className="text-xs font-bold text-brand-neon">VERIFIED</span>
        </div>
      </div>
    </div>
  );
}

