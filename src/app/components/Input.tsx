import type { InputHTMLAttributes } from 'react';
import { cn } from './ui/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helper?: string;
}

export function Input({ label, helper, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label ? <label className="fin-eyebrow">{label}</label> : null}
      <input
        className={cn(
          'w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-lime-200/60 focus:bg-zinc-800',
          className,
        )}
        {...props}
      />
      {helper ? <p className="text-xs text-zinc-500">{helper}</p> : null}
    </div>
  );
}
