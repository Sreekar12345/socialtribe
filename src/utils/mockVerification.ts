import type {
  CategoryTier,
  InfluencerMetrics,
  InfluencerProfile,
} from '../store/types';
import { clamp } from './formatters';
import { wait } from './delay';

interface VerificationGateResult {
  isValid: boolean;
  reason?: string;
}

function hashSeed(value: string) {
  return value.split('').reduce((accumulator, character) => {
    return accumulator * 31 + character.charCodeAt(0);
  }, 17);
}

function normalizeHandle(handle: string) {
  return handle.trim().replace(/^@/, '').toLowerCase();
}

function getTier(followers: number): CategoryTier {
  if (followers < 10000) return 'Nano';
  if (followers < 100000) return 'Micro';
  return 'Macro';
}

export function getActivityLabel(activityLevel: number) {
  if (activityLevel >= 75) return 'High';
  if (activityLevel >= 45) return 'Consistent';
  return 'Early growth';
}

export async function simulateVerificationGate(handle: string) {
  const normalized = normalizeHandle(handle);
  const seed = hashSeed(normalized);

  await wait(2200 + (seed % 700));

  if (
    normalized.includes('private') ||
    normalized.includes('ghost') ||
    normalized.includes('locked')
  ) {
    return {
      isValid: false,
      reason: 'This profile looks private, so SocialTribe cannot verify public activity yet.',
    } satisfies VerificationGateResult;
  }

  if (
    normalized.includes('new') ||
    normalized.includes('empty') ||
    normalized.includes('lowdata')
  ) {
    return {
      isValid: false,
      reason: 'This profile does not have enough recent public activity to complete verification.',
    } satisfies VerificationGateResult;
  }

  return { isValid: true } satisfies VerificationGateResult;
}

export function buildInfluencerMetrics(profile: InfluencerProfile): InfluencerMetrics {
  const normalized = normalizeHandle(profile.instagramHandle);
  const seed = hashSeed(`${normalized}-${profile.category}`);

  const followers = 3500 + (seed % 145000);
  const engagementRate = Number((1.8 + ((seed >> 3) % 58) / 10).toFixed(1));
  const activityLevel = clamp(42 + ((seed >> 5) % 53));
  const averageWeeklyPosts = 2 + ((seed >> 2) % 5);
  const engagementScore = clamp((engagementRate / 8.5) * 100);
  const followerQuality = followers < 10000 ? 72 : followers < 100000 ? 84 : 91;
  const score = clamp(
    Math.round(engagementScore * 0.45 + activityLevel * 0.3 + followerQuality * 0.25),
  );
  const tier = getTier(followers);

  return {
    followers,
    engagementRate,
    activityLevel,
    score,
    tier,
    averageWeeklyPosts,
    verificationNote:
      score >= 80
        ? 'Profile strength looks consistent for brand collaborations.'
        : 'Profile is growing steadily and ready for shortlisting.',
  };
}
