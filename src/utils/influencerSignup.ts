import { loadStorage, saveStorage } from './storage';

const BACKEND_BASE_URL = (
  import.meta.env.VITE_BACKEND_BASE_URL ?? 'http://localhost:4000'
).replace(/\/+$/, '');

const CONNECTED_ACCOUNT_STORAGE_KEY =
  'socialtribe.frontend.influencerAccount.v1';

export interface InstagramSignupSession {
  id: string;
  status: 'pending' | 'connected' | 'completed' | 'failed';
  error: string | null;
  profile: {
    instagramUserId: string;
    username: string;
    followersCount: number;
    mediaCount: number;
    profilePictureUrl: string | null;
    category: string;
    engagementRate: number;
    score: number;
    verifiedAt: string;
  } | null;
}

export interface ConnectedInfluencerAccount {
  instagramUserId: string;
  username: string;
  email: string;
  followers: number;
  engagementRate: number;
  totalPosts: number;
  category: string;
  scorePercent: number;
  verifiedAt: string;
  profilePictureUrl: string | null;
}

interface CompleteInstagramSignupResponse {
  account: {
    instagramUserId: string;
    username: string;
    email: string;
  };
  influencer: {
    followers: number;
    totalPosts: number;
    category: string;
    engagementRate: number;
    score: number;
    lastVerifiedAt: string;
  };
  session: InstagramSignupSession;
}

export function getInstagramSignupStartUrl() {
  return `${BACKEND_BASE_URL}/api/v1/auth/instagram/start`;
}

export async function fetchInstagramSignupSession(sessionId: string) {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/instagram/sessions/${encodeURIComponent(sessionId)}`,
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Failed to load Instagram session.');
  }

  return payload as InstagramSignupSession;
}

export async function completeInstagramSignup(input: {
  sessionId: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${BACKEND_BASE_URL}/api/v1/auth/instagram/complete`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(input),
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Failed to complete signup.');
  }

  return payload as CompleteInstagramSignupResponse;
}

export function saveConnectedInfluencerAccount(
  payload: CompleteInstagramSignupResponse,
) {
  const account: ConnectedInfluencerAccount = {
    instagramUserId: payload.account.instagramUserId,
    username: payload.account.username,
    email: payload.account.email,
    followers: payload.influencer.followers,
    engagementRate: payload.influencer.engagementRate,
    totalPosts: payload.influencer.totalPosts,
    category: payload.influencer.category,
    scorePercent: Math.round(payload.influencer.score * 100),
    verifiedAt: payload.influencer.lastVerifiedAt,
    profilePictureUrl: payload.session.profile?.profilePictureUrl ?? null,
  };

  saveStorage(CONNECTED_ACCOUNT_STORAGE_KEY, account);
  return account;
}

export function loadConnectedInfluencerAccount() {
  return loadStorage<ConnectedInfluencerAccount>(CONNECTED_ACCOUNT_STORAGE_KEY);
}
