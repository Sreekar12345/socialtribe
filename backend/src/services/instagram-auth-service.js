import { randomBytes, randomUUID, scryptSync } from "node:crypto";

const SESSION_TTL_MS = 15 * 60 * 1000;
const DEFAULT_SCOPE = "instagram_business_basic";

function trimTrailingSlash(value) {
  return String(value ?? "").replace(/\/+$/, "");
}

function buildFrontendRedirectUrl(config, sessionId, status, error) {
  const redirectUrl = new URL(
    "/signup/influencer",
    trimTrailingSlash(config.frontendBaseUrl || config.corsOrigin || "http://localhost:5173"),
  );

  redirectUrl.searchParams.set("oauthSessionId", sessionId);
  redirectUrl.searchParams.set("instagram", status);

  if (error) {
    redirectUrl.searchParams.set("error", error);
  }

  return redirectUrl.toString();
}

function createPasswordHash(password) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = scryptSync(password, salt, 64).toString("base64url");
  return `scrypt:${salt}:${derivedKey}`;
}

function extractGraphNode(payload) {
  if (payload && Array.isArray(payload.data)) {
    return payload.data[0] ?? null;
  }

  return payload ?? null;
}

function normalizeMediaItem(item, index) {
  return {
    externalPostId: item.id ?? `oauth-post-${index + 1}`,
    likes: Number(item.like_count ?? item.likes ?? 0),
    comments: Number(item.comments_count ?? item.comments ?? 0),
    caption: String(item.caption ?? ""),
    timestamp: item.timestamp ?? new Date().toISOString(),
  };
}

async function readJsonOrThrow(response, message) {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      payload?.error?.message ?? payload?.message ?? `${message} (${response.status})`;
    throw new Error(errorMessage);
  }

  return payload;
}

async function exchangeCodeForAccessToken(config, code) {
  const requestBody = new URLSearchParams({
    client_id: config.instagramAppId,
    client_secret: config.instagramAppSecret,
    grant_type: "authorization_code",
    redirect_uri: config.instagramRedirectUri,
    code,
  });

  const response = await fetch(config.instagramTokenUrl, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: requestBody,
  });

  const payload = await readJsonOrThrow(
    response,
    "Failed to exchange Instagram authorization code",
  );

  return payload.access_token ?? payload.token ?? null;
}

async function fetchAuthenticatedInstagramProfile(config, accessToken) {
  const meUrl = new URL(`${trimTrailingSlash(config.instagramGraphBaseUrl)}/me`);
  meUrl.searchParams.set(
    "fields",
    "user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count",
  );
  meUrl.searchParams.set("access_token", accessToken);

  const profileResponse = await fetch(meUrl);
  const profilePayload = extractGraphNode(
    await readJsonOrThrow(profileResponse, "Failed to fetch Instagram profile"),
  );

  if (!profilePayload?.user_id && !profilePayload?.id) {
    throw new Error("Instagram profile response is missing a user ID.");
  }

  const instagramUserId = String(profilePayload.user_id ?? profilePayload.id);
  const mediaUrl = new URL(
    `${trimTrailingSlash(config.instagramGraphBaseUrl)}/${instagramUserId}/media`,
  );
  mediaUrl.searchParams.set(
    "fields",
    "id,caption,timestamp,like_count,comments_count",
  );
  mediaUrl.searchParams.set("limit", "12");
  mediaUrl.searchParams.set("access_token", accessToken);

  const mediaResponse = await fetch(mediaUrl);
  const mediaPayload = await readJsonOrThrow(
    mediaResponse,
    "Failed to fetch Instagram media",
  );
  const posts = Array.isArray(mediaPayload?.data)
    ? mediaPayload.data.map(normalizeMediaItem)
    : [];

  return {
    instagramUserId,
    username: String(profilePayload.username ?? ""),
    followersCount: Number(profilePayload.followers_count ?? 0),
    followingCount: Number(profilePayload.follows_count ?? 0),
    totalPosts: Number(profilePayload.media_count ?? posts.length),
    bio: "",
    profileCategory: null,
    profilePictureUrl: profilePayload.profile_picture_url ?? null,
    name: profilePayload.name ?? null,
    accountType: profilePayload.account_type ?? null,
    isPrivate: false,
    isVerified: false,
    isBusinessOrCreator:
      profilePayload.account_type === "Business" ||
      profilePayload.account_type === "Media_Creator",
    posts,
  };
}

function sanitizeSession(session) {
  if (!session) {
    return null;
  }

  return {
    id: session.id,
    status: session.status,
    error: session.error ?? null,
    profile:
      session.rawProfile && session.preview
        ? {
            instagramUserId: session.rawProfile.instagramUserId,
            username: session.rawProfile.username,
            followersCount: session.rawProfile.followersCount,
            mediaCount: session.rawProfile.totalPosts,
            profilePictureUrl: session.rawProfile.profilePictureUrl ?? null,
            category: session.preview.category,
            engagementRate: session.preview.engagementRate,
            score: session.preview.score,
            verifiedAt: session.preview.verifiedAt,
          }
        : null,
  };
}

export function createInstagramAuthService({
  config,
  verificationService,
  repository,
  mockProvider,
}) {
  const sessions = new Map();

  function pruneExpiredSessions() {
    const now = Date.now();

    for (const [sessionId, session] of sessions.entries()) {
      if (now - session.createdAt > SESSION_TTL_MS) {
        sessions.delete(sessionId);
      }
    }
  }

  function findSessionByState(state) {
    for (const session of sessions.values()) {
      if (session.oauthState === state) {
        return session;
      }
    }

    return null;
  }

  async function connectMockSession() {
    const sessionId = randomUUID();
    const createdAt = Date.now();
    const rawProfile = await mockProvider.fetchByUsername(
      config.instagramMockUsername || "example_user",
    );
    const preview = verificationService.buildVerificationPreview(rawProfile);

    sessions.set(sessionId, {
      id: sessionId,
      oauthState: randomUUID(),
      createdAt,
      status: "connected",
      rawProfile,
      preview,
      error: null,
    });

    return buildFrontendRedirectUrl(config, sessionId, "connected");
  }

  function createLiveAuthorizationUrl(session) {
    const authorizationUrl = new URL(config.instagramAuthorizeUrl);
    authorizationUrl.searchParams.set("client_id", config.instagramAppId);
    authorizationUrl.searchParams.set("redirect_uri", config.instagramRedirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set(
      "scope",
      config.instagramOauthScopes || DEFAULT_SCOPE,
    );
    authorizationUrl.searchParams.set("state", session.oauthState);

    return authorizationUrl.toString();
  }

  return {
    async beginAuth() {
      pruneExpiredSessions();

      if (config.instagramOauthMode !== "live") {
        return connectMockSession();
      }

      if (
        !config.instagramAppId ||
        !config.instagramAppSecret ||
        !config.instagramRedirectUri
      ) {
        throw new Error(
          "Instagram OAuth is not configured. Set INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, and INSTAGRAM_REDIRECT_URI.",
        );
      }

      const sessionId = randomUUID();
      const session = {
        id: sessionId,
        oauthState: randomUUID(),
        createdAt: Date.now(),
        status: "pending",
        rawProfile: null,
        preview: null,
        error: null,
      };

      sessions.set(sessionId, session);
      return createLiveAuthorizationUrl(session);
    },

    async handleCallback({ code, state, error, errorReason }) {
      pruneExpiredSessions();

      const session = findSessionByState(state);

      if (!session) {
        throw new Error("Instagram signup session was not found or expired.");
      }

      if (error) {
        session.status = "failed";
        session.error = errorReason || error;
        return buildFrontendRedirectUrl(config, session.id, "error", session.error);
      }

      if (!code) {
        session.status = "failed";
        session.error = "Instagram did not return an authorization code.";
        return buildFrontendRedirectUrl(config, session.id, "error", session.error);
      }

      const accessToken = await exchangeCodeForAccessToken(config, code);
      const rawProfile = await fetchAuthenticatedInstagramProfile(config, accessToken);
      const preview = verificationService.buildVerificationPreview(rawProfile);

      session.status = "connected";
      session.rawProfile = rawProfile;
      session.preview = preview;
      session.accessToken = accessToken;
      session.error = null;

      return buildFrontendRedirectUrl(config, session.id, "connected");
    },

    getSession(sessionId) {
      pruneExpiredSessions();

      return sanitizeSession(sessions.get(sessionId) ?? null);
    },

    async completeSignup({ sessionId, email, password }) {
      pruneExpiredSessions();

      const session = sessions.get(sessionId);

      if (!session || session.status !== "connected" || !session.rawProfile) {
        const error = new Error("Instagram connection is required before signup.");
        error.statusCode = 400;
        throw error;
      }

      const storedInfluencer = await verificationService.saveVerifiedProfile(
        session.rawProfile,
      );

      await repository.saveInfluencerAccount({
        influencerId: storedInfluencer.id,
        email,
        passwordHash: createPasswordHash(password),
      });

      session.status = "completed";
      session.accessToken = null;
      session.error = null;

      return {
        session: sanitizeSession(session),
        influencer: storedInfluencer,
        account: {
          instagramUserId: storedInfluencer.instagramUserId,
          username: storedInfluencer.username,
          email: String(email).trim().toLowerCase(),
        },
      };
    },
  };
}
