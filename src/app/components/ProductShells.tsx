import type { ReactNode } from 'react';
import { Home, MessageSquare, PackageOpen, UserRound, BriefcaseBusiness } from 'lucide-react';
import { Navigate, Outlet } from 'react-router';
import { BottomNav, type BottomNavItem } from './BottomNav';
import { useAuth } from '../context/AuthContext';

const brandItems: BottomNavItem[] = [
  { to: '/brand/home', label: 'Home', icon: Home },
  { to: '/brand/campaigns', label: 'Campaigns', icon: BriefcaseBusiness },
  { to: '/brand/chat', label: 'Chat', icon: MessageSquare },
  { to: '/brand/profile', label: 'Profile', icon: UserRound },
];

const influencerItems: BottomNavItem[] = [
  { to: '/influencer/home', label: 'Home', icon: Home },
  { to: '/influencer/offers', label: 'Offers', icon: PackageOpen },
  { to: '/influencer/chat', label: 'Chat', icon: MessageSquare },
  { to: '/influencer/profile', label: 'Profile', icon: UserRound },
];

export function RootRedirect() {
  const { role } = useAuth();

  if (role === 'brand') return <Navigate to="/brand/home" replace />;
  if (role === 'influencer') return <Navigate to="/influencer/home" replace />;
  return <Navigate to="/auth/role" replace />;
}

export function BrandShell() {
  const { role } = useAuth();

  if (!role) return <Navigate to="/auth/role" replace />;
  if (role !== 'brand') return <Navigate to="/influencer/home" replace />;

  return (
    <div className="flex min-h-full flex-col bg-neutral-950 text-white">
      <div className="flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </div>
      <BottomNav items={brandItems} />
    </div>
  );
}

export function InfluencerShell() {
  const { role } = useAuth();

  if (!role) return <Navigate to="/auth/role" replace />;
  if (role !== 'influencer') return <Navigate to="/brand/home" replace />;

  return (
    <div className="flex min-h-full flex-col bg-neutral-950 text-white">
      <div className="flex-1 px-4 pb-24 pt-4">
        <Outlet />
      </div>
      <BottomNav items={influencerItems} />
    </div>
  );
}

export function BrandFlowGate({ children }: { children: ReactNode }) {
  const { role } = useAuth();

  if (!role) return <Navigate to="/auth/role" replace />;
  if (role !== 'brand') return <Navigate to="/influencer/home" replace />;
  return <>{children}</>;
}

export function InfluencerFlowGate({ children }: { children: ReactNode }) {
  const { role } = useAuth();

  if (!role) return <Navigate to="/auth/role" replace />;
  if (role !== 'influencer') return <Navigate to="/brand/home" replace />;
  return <>{children}</>;
}
