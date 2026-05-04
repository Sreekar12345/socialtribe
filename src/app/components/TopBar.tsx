import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { cn } from './ui/utils';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onSearchClick?: () => void;
  left?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TopBar({
  title,
  subtitle,
  searchPlaceholder,
  onSearchClick,
  left,
  actions,
  className,
}: TopBarProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        {left ? <div>{left}</div> : null}
        <div className="min-w-0 flex-1">
          {title ? <h1 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-white">{title}</h1> : null}
          {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      {searchPlaceholder ? (
        <button type="button" onClick={onSearchClick} className="flex h-11 w-full items-center gap-2 rounded-full border border-white/10 bg-gray-800 px-4 text-sm text-zinc-500">
          <Search className="h-4 w-4" />
          <span>{searchPlaceholder}</span>
        </button>
      ) : null}
    </div>
  );
}
