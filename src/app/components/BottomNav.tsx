import type { LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from './ui/utils';

export interface BottomNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function BottomNav({ items }: { items: BottomNavItem[] }) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-white/10 bg-neutral-950/95 px-3 py-2 backdrop-blur-xl">
      <div className={`grid gap-1 ${items.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] text-zinc-500 transition-colors',
                isActive && 'bg-lime-200/10 text-white',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
