import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        fullWidth && 'w-full',
        variant === 'primary' &&
          'bg-neutral-950 text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]',
        variant === 'secondary' &&
          'border border-black/10 bg-white/80 text-neutral-950 hover:bg-white',
        variant === 'ghost' &&
          'bg-transparent text-neutral-700 hover:bg-black/5',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Please wait...' : children}
    </motion.button>
  );
}
