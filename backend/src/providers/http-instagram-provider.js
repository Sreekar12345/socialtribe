import { normalizeUsername } from "../domain/verification.js";

function normalizePost(post, index) {
  return {
    externalPostId: post.externalPostId ?? post.id ?? `post-${index + 1}`,
    likes: Number(post.likes ?? post.like_count ?? 0),
    comments: Number(post.comments ?? post.comment_count ?? 0),
    caption: String(post.caption ?? ""),
    timestamp: post.timestamp ?? new Date().toISOString(),
  };
}

export function createHttpInstagramProvider(config) {
  return {
    async fetchByUsername(username) {
      if (!config.scraperApiUrl) {
        throw new Error("SCRAPER_API_URL is required when SCRAPER_MODE=http");
      }

      const response = await fetch(config.scraperApiUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(config.scraperApiToken
            ? { authorization: `Bearer ${config.scraperApiToken}` }
            : {}),
        },
        body: JSON.stringify({ username: normalizeUsername(username) }),
      });

      if (!response.ok) {
        throw new Error(`scraper request failed with status ${response.status}`);
      }

      const payload = await response.json();

      return {
        instagramUserId: payload.instagramUserId ?? payload.user_id ?? null,
        username: normalizeUsername(payload.username ?? username),
        followersCount: Number(payload.followersCount ?? payload.followers ?? 0),
        followingCount: Number(payload.followingCount ?? payload.following ?? 0),
        totalPosts: Number(
          payload.totalPosts ?? payload.total_posts ?? payload.postsCount ?? 0,
        ),
        bio: String(payload.bio ?? ""),
        profileCategory: payload.profileCategory ?? payload.profile_category ?? null,
        isPrivate: Boolean(payload.isPrivate ?? payload.is_private ?? false),
        isVerified: Boolean(payload.isVerified ?? payload.is_verified ?? false),
        isBusinessOrCreator:
          typeof payload.isBusinessOrCreator === "boolean"
            ? payload.isBusinessOrCreator
            : typeof payload.is_business_or_creator === "boolean"
              ? payload.is_business_or_creator
              : null,
        posts: Array.isArray(payload.posts)
          ? payload.posts.map(normalizePost)
          : [],
      };
    },
  };
}
