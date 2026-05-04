import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface RoleCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  active?: boolean;
  onSelect: () => void;
}

export function RoleCard({
  title,
  description,
  icon: Icon,
  active = false,
  onSelect,
}: RoleCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={onSelect}
      className={cn(
        'w-full rounded-[28px] border p-5 text-left transition-colors',
        active
          ? 'border-[#c5b0f4] bg-[#ede7fb] shadow-[0_16px_40px_rgba(56,56,70,0.08)]'
          : 'border-black/10 bg-white/88 hover:bg-white',
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-[#f4ecd6] text-neutral-950">
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-950" />
          )}
        </span>
        <ArrowRight className="mt-1 h-4 w-4 text-neutral-500" />
      </div>
      <div className="mt-6 space-y-2">
        <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
        {description ? (
          <p className="text-sm leading-6 text-neutral-600">{description}</p>
        ) : null}
      </div>
    </motion.button>
  );
}
