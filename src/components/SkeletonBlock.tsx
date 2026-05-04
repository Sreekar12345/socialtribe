import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return (
    <motion.div
      className={cn(
        'overflow-hidden rounded-2xl bg-white/[0.05]',
        className,
      )}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
