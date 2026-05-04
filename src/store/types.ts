export type Role = 'brand' | 'influencer';
export type BrandIndustry =
  | 'Fashion'
  | 'Beauty'
  | 'Food'
  | 'Fitness'
  | 'Technology'
  | 'Travel'
  | 'Lifestyle';
export type InfluencerCategory = BrandIndustry;
export type VerificationStatus =
  | 'idle'
  | 'verifying'
  | 'failed'
  | 'verified'
  | 'processing'
  | 'completed';
export type CategoryTier = 'Nano' | 'Micro' | 'Macro';

export interface UserState {
  role: Role | null;
  email: string;
  isAuthenticated: boolean;
}

export interface BrandProfile {
  brandName: string;
  industry: BrandIndustry | '';
  websiteUrl: string;
}

export interface InfluencerProfile {
  instagramHandle: string;
  category: InfluencerCategory | '';
  email: string;
}

export interface InfluencerMetrics {
  followers: number;
  engagementRate: number;
  activityLevel: number;
  score: number;
  tier: CategoryTier;
  averageWeeklyPosts: number;
  verificationNote: string;
}

export interface VerificationState {
  status: VerificationStatus;
  error: string | null;
  result: InfluencerMetrics | null;
}

export interface AppState {
  user: UserState;
  brandProfile: BrandProfile | null;
  influencerProfile: InfluencerProfile | null;
  verification: VerificationState;
}
