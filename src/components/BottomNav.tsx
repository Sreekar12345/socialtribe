import { NavLink } from 'react-router';
import { cn } from '../utils/cn';

type NavigationRole = 'brand' | 'influencer';

interface BottomNavProps {
  role: NavigationRole;
}

const navItems = {
  brand: [
    { label: 'Home', path: '/brand/dashboard' },
    { label: 'Campaigns', path: '/brand/create' },
    { label: 'Chat', path: '/brand/chat' },
    { label: 'Profile', path: '/brand/profile' },
  ],
  influencer: [
    { label: 'Home', path: '/influencer/dashboard' },
    { label: 'Work', path: '/influencer/campaigns' },
    { label: 'Payouts', path: '/influencer/payouts' },
    { label: 'Profile', path: '/influencer/profile' },
  ],
} satisfies Record<NavigationRole, Array<{ label: string; path: string }>>;

export function BottomNav({ role }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t">
      <div className="max-w-md mx-auto px-6 py-3">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${navItems[role].length}, minmax(0, 1fr))`,
          }}
        >
          {navItems[role].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center rounded-full px-3 py-2 text-xs font-medium text-neutral-500 transition',
                  isActive && 'bg-neutral-950 text-white',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
