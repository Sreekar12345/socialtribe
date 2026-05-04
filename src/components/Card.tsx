import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'soft' | 'outline';
}

export function Card({
  children,
  className,
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[28px] border text-neutral-950',
        variant === 'default' &&
          'border-black/10 bg-white/88 shadow-[0_24px_80px_rgba(24,24,27,0.08)] backdrop-blur',
        variant === 'soft' && 'border-[#dceeb1] bg-[#eef5d8]',
        variant === 'outline' && 'border-black/10 bg-white/55 backdrop-blur',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
