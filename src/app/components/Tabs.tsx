import { cn } from './ui/utils';

interface TabOption<T extends string> {
  label: string;
  value: T;
}

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: TabOption<T>[];
  className?: string;
}

export function Tabs<T extends string>({ value, onChange, options, className }: TabsProps<T>) {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-full px-4 py-2 text-sm capitalize transition-colors',
            value === option.value
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
              : 'border border-white/10 bg-gray-800 text-zinc-300',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
