import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sceneFallback?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[HASH.DEVS ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // If used as a 3D scene fallback: show architectural technical placeholder
      if (this.props.sceneFallback) {
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center font-mono text-xs text-brand-muted bg-brand-surface/40 border border-brand-border/60 rounded-2xl">
            <div className="h-2 w-2 rounded-full bg-brand-neon animate-pulse mb-3" />
            <span className="text-brand-white font-bold tracking-widest uppercase">
              3D VISUALIZATION // STATIC FALLBACK
            </span>
            <span className="text-[10px] text-brand-muted mt-1 max-w-xs">
              WebGL hardware acceleration is unavailable or temporarily paused.
            </span>
          </div>
        );
      }

      // Full-page error fallback
      return (
        <div className="min-h-screen w-full bg-brand-obsidian text-brand-white flex items-center justify-center p-6 selection:bg-brand-neon selection:text-brand-obsidian">
          {/* Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <div className="relative max-w-xl w-full bg-[#0E1210] border border-brand-border/80 rounded-2xl p-8 sm:p-12 shadow-2xl text-center">
            {/* Corner Brackets */}
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-border" />
            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-border" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-border" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-border" />

            <div className="font-mono text-xs font-bold text-brand-neon tracking-widest uppercase mb-3 flex items-center justify-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
              <span>SYSTEM EXCEPTION // SAFE RECOVERY</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-white uppercase tracking-tight mb-4">
              EXPERIENCE INTERRUPTED
            </h1>

            <p className="font-body text-sm text-brand-muted leading-relaxed mb-8">
              A runtime component encountered an unexpected exception. The studio state has been isolated to prevent cascade failures.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-6 py-3 rounded-full bg-brand-neon hover:bg-[#2ED150] text-brand-obsidian font-mono text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(53,232,91,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon"
              >
                RELOAD EXPERIENCE ↻
              </button>
              <a
                href="/"
                className="px-6 py-3 rounded-full bg-[#171A18] hover:bg-[#1E2320] border border-brand-border hover:border-brand-neon text-brand-white hover:text-brand-neon font-mono text-xs font-bold tracking-widest uppercase transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
              >
                RETURN TO HOME ←
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
