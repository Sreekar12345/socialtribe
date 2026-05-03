import { CATEGORY_KEYWORDS } from "./keywords.js";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function round(value, places = 4) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function normalizeUsername(username) {
  return String(username).trim().replace(/^@+/, "").toLowerCase();
}

function getExpectedEngagementRate(followers) {
  if (followers < 10_000) return 5;
  if (followers < 50_000) return 3;
  if (followers <= 500_000) return 2;
  return 1;
}

function normalizeEngagementRate(engagementRate) {
  if (engagementRate >= 6) return 1;
  if (engagementRate >= 3) return 0.7;
  if (engagementRate >= 1) return 0.4;
  return 0.1;
}

function classify(score) {
  if (score >= 0.75) return "ACCEPTED_HIGH";
  if (score >= 0.5) return "ACCEPTED";
  if (score >= 0.3) return "RISKY";
  return "REJECTED";
}

function detectCategory(profile) {
  const searchText = [profile.bio ?? "", ...profile.posts.map((post) => post.caption ?? "")]
    .join(" ")
    .toLowerCase();

  let bestCategory = "unknown";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter((keyword) => searchText.includes(keyword)).length;
    const score = clamp(matches / keywords.length);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    category: bestScore > 0 ? bestCategory : "unknown",
    relevanceScore: round(bestScore),
    categoryConfidence: round(bestScore),
  };
}

export function buildVerificationOutcome(profile, verifiedAt = new Date()) {
  const followers = Number(profile.followersCount ?? 0);
  const following = Number(profile.followingCount ?? 0);
  const totalPosts = Number(profile.totalPosts ?? profile.posts.length ?? 0);
  const posts = Array.isArray(profile.posts) ? profile.posts : [];
  const now = verifiedAt.getTime();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const averageLikes =
    posts.length === 0
      ? 0
      : posts.reduce((sum, post) => sum + Number(post.likes ?? 0), 0) / posts.length;
  const averageComments =
    posts.length === 0
      ? 0
      : posts.reduce((sum, post) => sum + Number(post.comments ?? 0), 0) / posts.length;
  const engagementRate =
    followers > 0 ? ((averageLikes + averageComments) / followers) * 100 : 0;
  const expectedEngagementRate = getExpectedEngagementRate(followers);
  const followerQuality = clamp(
    expectedEngagementRate > 0 ? engagementRate / expectedEngagementRate : 0,
  );
  const postsLast30Days = posts.filter((post) => {
    const timestamp = new Date(post.timestamp).getTime();
    return Number.isFinite(timestamp) && timestamp >= thirtyDaysAgo;
  }).length;
  const consistency = clamp(postsLast30Days / 12);
  const { category, relevanceScore, categoryConfidence } = detectCategory(profile);
  const engagementRateNormalized = normalizeEngagementRate(engagementRate);
  const score = round(
    0.35 * engagementRateNormalized +
      0.25 * followerQuality +
      0.2 * consistency +
      0.2 * relevanceScore,
  );

  let status = classify(score);
  let rejectionReason = null;
  let scrapeStatus = "fresh";

  if (profile.isPrivate) {
    status = "REJECTED";
    rejectionReason = "PRIVATE_ACCOUNT";
    scrapeStatus = "private";
  } else if (followers < 1000) {
    status = "REJECTED";
    rejectionReason = "TOO_FEW_FOLLOWERS";
  } else if (posts.length === 0) {
    status = "REJECTED";
    rejectionReason = "NO_POSTS";
  } else if (engagementRate === 0) {
    status = "REJECTED";
    rejectionReason = "ZERO_ENGAGEMENT";
  }

  return {
    instagramUserId: profile.instagramUserId ?? null,
    username: normalizeUsername(profile.username),
    followers,
    following,
    totalPosts,
    bio: profile.bio ?? "",
    profileCategory: profile.profileCategory ?? null,
    isPrivate: Boolean(profile.isPrivate),
    isVerified: Boolean(profile.isVerified),
    isBusinessOrCreator:
      typeof profile.isBusinessOrCreator === "boolean"
        ? profile.isBusinessOrCreator
        : null,
    scrapeStatus,
    scrapeError: null,
    category,
    categoryConfidence,
    engagementRate: round(engagementRate),
    engagementRateNormalized: round(engagementRateNormalized),
    followerQuality: round(followerQuality),
    consistency: round(consistency),
    relevanceScore,
    score,
    status,
    eligibleForCampaigns: status === "ACCEPTED_HIGH" || status === "ACCEPTED",
    rejectionReason,
    sourceProvider: profile.sourceProvider ?? "unknown",
    sampledPostCount: posts.length,
    postsLast30Days,
    verifiedAt,
  };
}
