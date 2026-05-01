import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'brand' | 'influencer';

interface Profile {
  brandName?: string;
  industry?: string;
  category?: string;
  followers?: string;
  price?: string;
}

interface AuthState {
  role: Role | null;
  setRole: (r: Role) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
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
