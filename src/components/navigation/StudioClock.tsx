import { useState, useEffect } from 'react';

export function StudioClock() {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden items-center gap-2.5 font-mono text-[11px] text-brand-muted laptop:flex">
      <span className="flex h-1.5 w-1.5 rounded-full bg-brand-neon" />
      <span className="tracking-widest uppercase text-brand-white font-medium">STUDIO CLOCK:</span>
      <span className="font-mono text-brand-neon">{time || '00:00:00 UTC'}</span>
    </div>
  );
}

