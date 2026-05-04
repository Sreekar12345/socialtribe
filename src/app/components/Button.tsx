import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './ui/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        fullWidth && 'w-full',
        variant === 'primary' && 'bg-[var(--accent)] text-[var(--accent-foreground)]',
        variant === 'secondary' && 'border border-white/10 bg-gray-800 text-white hover:bg-gray-700',
        variant === 'ghost' && 'bg-transparent text-zinc-300 hover:bg-zinc-900',
        variant === 'danger' && 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/20',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
