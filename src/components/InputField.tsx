import type { InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
}

export function InputField({
  label,
  error,
  helper,
  className,
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
      <input
        className={cn(
          'h-12 rounded-full border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-black/30',
          error && 'border-red-400/60 focus:border-red-400/70',
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-red-500">{error}</span>
      ) : helper ? (
        <span className="text-xs text-neutral-500">{helper}</span>
      ) : null}
    </label>
  );
}
