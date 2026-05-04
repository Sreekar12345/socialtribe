import { useEffect, useState } from 'react';

interface SimulatedProgressOptions {
  active: boolean;
  duration: number;
  onComplete?: () => void;
}

export function useSimulatedProgress({
  active,
  duration,
  onComplete,
}: SimulatedProgressOptions) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!active) return;

    let isMounted = true;
    const start = performance.now();

    const tick = () => {
      if (!isMounted) return;

      const elapsed = performance.now() - start;
      const nextValue = Math.min(100, 8 + (elapsed / duration) * 92);
      setProgress(nextValue);

      if (elapsed >= duration) {
        onComplete?.();
        return;
      }

      window.requestAnimationFrame(tick);
    };

    setProgress(8);
    const frame = window.requestAnimationFrame(tick);

    return () => {
      isMounted = false;
      window.cancelAnimationFrame(frame);
    };
  }, [active, duration, onComplete]);

  return progress;
}
