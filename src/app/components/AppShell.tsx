import { Bell, BriefcaseBusiness, Compass, Home, Search, UserRound, Wallet } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { BrandMark } from './FintechPrimitives';
import { cn } from './ui/utils';

const navItems = [
  { to: '/', label: 'Home', icon: Home, match: (pathname: string) => pathname === '/' },
  {
    to: '/explore',
    label: 'Explore',
    icon: Compass,
    match: (pathname: string) => pathname.startsWith('/explore') || pathname.startsWith('/influencers'),
  },
  {
    to: '/campaigns',
    label: 'Campaigns',
    icon: BriefcaseBusiness,
    match: (pathname: string) => pathname.startsWith('/campaigns') || pathname.startsWith('/brand/track'),
  },
  { to: '/wallet', label: 'Wallet', icon: Wallet, match: (pathname: string) => pathname.startsWith('/wallet') },
  { to: '/profile', label: 'Profile', icon: UserRound, match: (pathname: string) => pathname.startsWith('/profile') },
];

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="app-shell">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/95 px-4 pb-3 pt-4 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <BrandMark />
          <button type="button" onClick={() => navigate('/wallet')} className="fin-chip">
            Wallet
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate('/explore')} className="app-topbar-search">
            <Search className="h-4 w-4" />
            <span>Search creators, reels, and niches</span>
          </button>
          <button type="button" onClick={() => navigate('/inbox')} className="fin-topbar-action" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => navigate('/profile')} className="fin-topbar-action" aria-label="Profile">
            <UserRound className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="app-shell-content">
        <Outlet />
      </div>

      <div className="app-nav">
        <div className="app-nav-grid">
          {navItems.map((item) => {
            const active = item.match(location.pathname);
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={cn('app-nav-item', active && 'app-nav-item-active')}>
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
