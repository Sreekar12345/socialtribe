import { motion } from 'motion/react';
import { clamp } from '../utils/formatters';

interface ProgressBarProps {
  value: number;
  label?: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const safeValue = clamp(value);

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-neutral-500">
          <span>{label}</span>
          <span>{Math.round(safeValue)}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-black/8">
        <motion.div
          className="h-full rounded-full bg-neutral-950"
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
