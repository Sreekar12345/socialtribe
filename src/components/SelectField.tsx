import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export function SelectField({
  label,
  error,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </span>
      <span className="relative">
        <select
          className={cn(
            'h-12 w-full appearance-none rounded-2xl border border-white/10 bg-neutral-900 px-4 text-sm text-white outline-none transition focus:border-sky-400/60',
            error && 'border-red-400/55 focus:border-red-400/70',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </span>
      {error ? <span className="text-xs text-red-300">{error}</span> : null}
    </label>
  );
}
