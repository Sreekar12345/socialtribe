import { motion } from 'motion/react';
import { clamp } from '../utils/formatters';

interface ScoreCircleProps {
  value: number;
  label?: string;
}

export function ScoreCircle({ value, label }: ScoreCircleProps) {
  const safeValue = clamp(value);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg className="h-40 w-40 -rotate-90" viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgba(24,24,27,0.12)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          stroke="#18181b"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tracking-[-0.04em] text-neutral-950">
          {Math.round(safeValue)}
        </span>
        {label ? (
          <span className="mt-1 text-xs uppercase tracking-[0.18em] text-neutral-500">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
