import { randomUUID } from "node:crypto";

function sortByScoreDescending(left, right) {
  return right.score - left.score;
}

export function createMemoryInfluencerRepository() {
  const influencers = new Map();
  const verificationRuns = [];
  const accountsByEmail = new Map();
  const accountsByInfluencerId = new Map();

  return {
    async findByUsername(username) {
      return influencers.get(username) ?? null;
    },

    async listInfluencers({ category, status, limit, offset }) {
      const normalizedCategory = category ? String(category).toLowerCase() : null;
      const normalizedStatus = status ? String(status).toUpperCase() : null;

      const filtered = [...influencers.values()]
        .filter((record) => {
          if (normalizedCategory && record.category !== normalizedCategory) return false;
          if (normalizedStatus && record.status !== normalizedStatus) return false;
          return true;
        })
        .sort(sortByScoreDescending);

      return {
        items: filtered.slice(offset, offset + limit),
        total: filtered.length,
      };
    },

    async saveVerification({ rawProfile, outcome, verifiedAt, cacheExpiresAt, sourceProvider }) {
      const id = influencers.get(outcome.username)?.id ?? randomUUID();

      const record = {
        id,
        instagramUserId: outcome.instagramUserId,
        username: outcome.username,
        followers: outcome.followers,
        following: outcome.following,
        totalPosts: outcome.totalPosts,
        profileBio: outcome.bio,
        profileCategory: outcome.profileCategory,
        category: outcome.category,
        categoryConfidence: outcome.categoryConfidence,
        isPrivate: outcome.isPrivate,
        isVerified: outcome.isVerified,
        isBusinessOrCreator: outcome.isBusinessOrCreator,
        scrapeStatus: outcome.scrapeStatus,
        scrapeError: outcome.scrapeError,
        engagementRate: outcome.engagementRate,
        engagementRateNormalized: outcome.engagementRateNormalized,
        followerQuality: outcome.followerQuality,
        consistency: outcome.consistency,
        relevanceScore: outcome.relevanceScore,
        score: outcome.score,
        status: outcome.status,
        eligibleForCampaigns: outcome.eligibleForCampaigns,
        rejectionReason: outcome.rejectionReason,
        sourceProvider,
        lastScrapedAt: verifiedAt.toISOString(),
        lastVerifiedAt: verifiedAt.toISOString(),
        cacheExpiresAt: cacheExpiresAt.toISOString(),
        lastUpdated: verifiedAt.toISOString(),
        posts: rawProfile.posts.map((post) => ({
          externalPostId: post.externalPostId ?? null,
          likes: Number(post.likes ?? 0),
          comments: Number(post.comments ?? 0),
          caption: post.caption ?? "",
          postedAt: new Date(post.timestamp).toISOString(),
        })),
      };

      influencers.set(record.username, record);
      verificationRuns.push({
        id: randomUUID(),
        influencerId: id,
        fetchedAt: verifiedAt.toISOString(),
        sourceProvider,
        status: outcome.status,
        reason: outcome.rejectionReason,
        score: outcome.score,
        metrics: {
          engagementRate: outcome.engagementRate,
          engagementRateNormalized: outcome.engagementRateNormalized,
          followerQuality: outcome.followerQuality,
          consistency: outcome.consistency,
          relevanceScore: outcome.relevanceScore,
          postsLast30Days: outcome.postsLast30Days,
          sampledPostCount: outcome.sampledPostCount,
        },
      });

      return record;
    },

    async saveInfluencerAccount({ influencerId, email, passwordHash }) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const existingByEmail = accountsByEmail.get(normalizedEmail);

      if (existingByEmail && existingByEmail.influencerId !== influencerId) {
        const error = new Error("An account with this email already exists.");
        error.statusCode = 409;
        throw error;
      }

      const existingByInfluencerId = accountsByInfluencerId.get(influencerId);
      const account = {
        id: existingByInfluencerId?.id ?? randomUUID(),
        influencerId,
        email: normalizedEmail,
        passwordHash,
        createdAt: existingByInfluencerId?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (
        existingByInfluencerId &&
        existingByInfluencerId.email !== normalizedEmail
      ) {
        accountsByEmail.delete(existingByInfluencerId.email);
      }

      accountsByEmail.set(normalizedEmail, account);
      accountsByInfluencerId.set(influencerId, account);

      return account;
    },
  };
}
