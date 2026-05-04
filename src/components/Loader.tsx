import { motion } from 'motion/react';

interface LoaderProps {
  label?: string;
  caption?: string;
}

export function Loader({
  label = 'Loading',
  caption = 'Preparing your experience.',
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="h-3 w-3 rounded-full bg-neutral-950"
            animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }}
            transition={{
              duration: 0.95,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.12,
            }}
          />
        ))}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-neutral-950">{label}</p>
        <p className="text-sm text-neutral-600">{caption}</p>
      </div>
    </div>
  );
}
