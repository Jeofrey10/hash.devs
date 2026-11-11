import { useState, useRef, useEffect, useCallback } from 'react';
import { useCursor } from '@/components/ui/CursorContext';
import { cn } from '@/lib/utils';

export function AudioController({ className }: { className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const { setCursor, resetCursor } = useCursor();

  // Initialize or resume AudioContext safely on user gesture
  const toggleAudio = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }

    const ctx = audioCtxRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (!isPlaying) {
      // Create a subtle, high-end warm ambient drone (frequency around 110Hz - note A2)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, ctx.currentTime);

      // Low volume to keep it luxurious and unobtrusive
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);
    } else {
      if (gainNodeRef.current && ctx) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => {
          oscillatorRef.current?.stop();
          oscillatorRef.current?.disconnect();
          gainNodeRef.current?.disconnect();
          setIsPlaying(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    }
  }, [isPlaying]);

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      try {
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
        gainNodeRef.current?.disconnect();
        audioCtxRef.current?.close();
      } catch {
        // Safe disposal
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={isPlaying ? 'Mute ambient sound' : 'Enable ambient sound'}
      className={cn(
        'group relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-brand-border bg-brand-surface/60 backdrop-blur-sm transition-all duration-300 shrink-0',
        'hover:border-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon',
        isPlaying && 'border-brand-neon/40 bg-brand-surface',
        className
      )}
      onMouseEnter={() => setCursor('magnetic', isPlaying ? 'MUTE' : 'SOUND')}
      onMouseLeave={() => resetCursor()}
    >
      {/* Animated Equalizer Waves */}
      <span className="flex h-3.5 items-end gap-[2.5px]">
        <span
          className={cn(
            'w-[2px] rounded-full bg-brand-neon transition-all duration-300',
            isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5 group-hover:h-2.5'
          )}
          style={{ animationDuration: '0.6s' }}
        />
        <span
          className={cn(
            'w-[2px] rounded-full bg-brand-neon transition-all duration-300',
            isPlaying ? 'h-2.5 animate-pulse' : 'h-2'
          )}
          style={{ animationDuration: '0.9s', animationDelay: '0.2s' }}
        />
        <span
          className={cn(
            'w-[2px] rounded-full bg-brand-neon transition-all duration-300',
            isPlaying ? 'h-4 animate-pulse' : 'h-2 group-hover:h-3.5'
          )}
          style={{ animationDuration: '0.75s', animationDelay: '0.4s' }}
        />
        <span
          className={cn(
            'w-[2px] rounded-full bg-brand-neon transition-all duration-300',
            isPlaying ? 'h-2 animate-pulse' : 'h-1.5'
          )}
          style={{ animationDuration: '1.1s', animationDelay: '0.1s' }}
        />
      </span>
    </button>
  );
}

