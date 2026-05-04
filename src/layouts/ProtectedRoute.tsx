import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAppStore } from '../store/AppStore';
import type { Role } from '../store/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  role?: Role;
  requireBrandProfile?: boolean;
  requireInfluencerProfile?: boolean;
  requireVerifiedProfile?: boolean;
  requireResult?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  role,
  requireBrandProfile = false,
  requireInfluencerProfile = false,
  requireVerifiedProfile = false,
  requireResult = false,
}: ProtectedRouteProps) {
  const {
    user,
    brandProfile,
    influencerProfile,
    verification,
  } = useAppStore();

  if (requireAuth && !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/role" replace />;
  }

  if (requireBrandProfile && !brandProfile) {
    return <Navigate to="/signup/brand" replace />;
  }

  if (requireInfluencerProfile && !influencerProfile) {
    return <Navigate to="/signup/influencer" replace />;
  }

  if (
    requireVerifiedProfile &&
    !['verified', 'processing', 'completed'].includes(verification.status)
  ) {
    return <Navigate to="/verify" replace />;
  }

  if (requireResult && !verification.result) {
    return <Navigate to="/processing" replace />;
  }

  return <>{children}</>;
}
