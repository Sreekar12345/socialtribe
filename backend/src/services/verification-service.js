import { buildVerificationOutcome, normalizeUsername } from "../domain/verification.js";

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function mapRecordToResponse(record, source = "database") {
  return {
    id: record.id,
    username: record.username,
    instagramUserId: record.instagramUserId,
    followers: record.followers,
    following: record.following,
    totalPosts: record.totalPosts,
    category: record.category,
    categoryConfidence: record.categoryConfidence,
    score: record.score,
    status: record.status,
    eligibleForCampaigns: record.eligibleForCampaigns,
    rejectionReason: record.rejectionReason,
    engagementRate: record.engagementRate,
    scoreBreakdown: {
      engagementRateNormalized: record.engagementRateNormalized,
      followerQuality: record.followerQuality,
      consistency: record.consistency,
      relevanceScore: record.relevanceScore,
    },
    accountFlags: {
      isPrivate: record.isPrivate,
      isVerified: record.isVerified,
      isBusinessOrCreator: record.isBusinessOrCreator,
    },
    sourceProvider: record.sourceProvider,
    lastVerifiedAt: record.lastVerifiedAt,
    cacheExpiresAt: record.cacheExpiresAt,
    source,
  };
}

export function createVerificationService({
  repository,
  provider,
  cacheTtlHours,
  sourceProvider,
}) {
  return {
    async verifyInfluencer({ username, forceRefresh = false }) {
      const normalizedUsername = normalizeUsername(username);
      const cached = await repository.findByUsername(normalizedUsername);
      const now = new Date();

      if (
        cached &&
        !forceRefresh &&
        cached.cacheExpiresAt &&
        new Date(cached.cacheExpiresAt).getTime() > now.getTime()
      ) {
        return mapRecordToResponse(cached, "cache");
      }

      const rawProfile = await provider.fetchByUsername(normalizedUsername);
      const outcome = buildVerificationOutcome(
        { ...rawProfile, sourceProvider },
        now,
      );
      const cacheExpiresAt = addHours(now, cacheTtlHours);

      const stored = await repository.saveVerification({
        rawProfile,
        outcome,
        verifiedAt: now,
        cacheExpiresAt,
        sourceProvider,
      });

      return mapRecordToResponse(stored, "fresh");
    },

    async getInfluencerByUsername(username) {
      const record = await repository.findByUsername(normalizeUsername(username));
      return record ? mapRecordToResponse(record) : null;
    },

    async listInfluencers(filters) {
      const { items, total } = await repository.listInfluencers(filters);
      return {
        items: items.map((item) => mapRecordToResponse(item)),
        pagination: {
          total,
          limit: filters.limit,
          offset: filters.offset,
        },
      };
    },
  };
}
