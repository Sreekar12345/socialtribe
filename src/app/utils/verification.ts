import type { VerificationResult } from '../context/AuthContext';

function hashSeed(value: string) {
  return value.split('').reduce((accumulator, character) => {
    return accumulator * 31 + character.charCodeAt(0);
  }, 19);
}

function normalizedHandle(handle: string) {
  return handle.trim().replace(/^@/, '').toLowerCase();
}

export function formatFollowers(value: number) {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function activityLabel(activityLevel: number) {
  if (activityLevel >= 75) return 'High';
  if (activityLevel >= 50) return 'Consistent';
  return 'Developing';
}

export function simulateVerificationCheck(handle: string) {
  const normalized = normalizedHandle(handle);

  return new Promise<{ valid: boolean; reason?: string }>((resolve) => {
    window.setTimeout(() => {
      if (
        normalized.includes('private') ||
        normalized.includes('locked') ||
        normalized.includes('hidden')
      ) {
        resolve({
          valid: false,
          reason: 'This profile appears private, so SocialTribe cannot verify public activity yet.',
        });
        return;
      }

      if (
        normalized.includes('empty') ||
        normalized.includes('lowdata') ||
        normalized.includes('new')
      ) {
        resolve({
          valid: false,
          reason: 'This profile does not have enough recent public content to complete verification.',
        });
        return;
      }

      resolve({ valid: true });
    }, 2200 + (hashSeed(normalized) % 700));
  });
}

export function buildVerificationResult(
  handle: string,
  niche: string,
): VerificationResult {
  const seed = hashSeed(`${normalizedHandle(handle)}-${niche}`);
  const followers = 3200 + (seed % 158000);
  const engagementRate = Number((1.9 + ((seed >> 2) % 58) / 10).toFixed(1));
  const activityLevel = 42 + ((seed >> 4) % 52);
  const engagementScore = Math.min(100, Math.round((engagementRate / 8.2) * 100));
  const followerScore = followers < 10000 ? 68 : followers < 100000 ? 82 : 91;
  const score = Math.min(
    98,
    Math.round(engagementScore * 0.45 + activityLevel * 0.3 + followerScore * 0.25),
  );
  const tier = followers < 10000 ? 'Nano' : followers < 100000 ? 'Micro' : 'Macro';

  return {
    followers,
    engagementRate,
    activityLevel,
    score,
    tier,
    summary:
      score >= 80
        ? 'Profile quality looks strong for creator discovery.'
        : 'Profile shows healthy early traction and consistent output.',
  };
}
