import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { DeliverableKey } from '../utils/pricing';

export type Role = 'brand' | 'influencer';
export type VerificationStatus =
  | 'idle'
  | 'verifying'
  | 'invalid'
  | 'processing'
  | 'ready';

export interface VerificationResult {
  followers: number;
  engagementRate: number;
  activityLevel: number;
  score: number;
  tier: 'Nano' | 'Micro' | 'Macro';
  summary: string;
}

interface Profile {
  brandName?: string;
  industry?: string;
  email?: string;
  instagramHandle?: string;
  niche?: string;
  followers?: string;
  pricing?: Partial<Record<DeliverableKey, number>>;
  verificationStatus?: VerificationStatus;
  verificationError?: string;
  verificationResult?: VerificationResult;
}

interface AuthState {
  role: Role | null;
  setRole: (r: Role) => void;
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<Profile>({});
  return <Ctx.Provider value={{ role, setRole, profile, setProfile }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
}
