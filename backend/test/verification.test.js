import test from "node:test";
import assert from "node:assert/strict";
import { buildVerificationOutcome } from "../src/domain/verification.js";

function buildProfile(overrides = {}) {
  const posts = Array.from({ length: 12 }, (_, index) => ({
    likes: 220 + index * 5,
    comments: 20 + index,
    caption: "gym workout fitness update",
    timestamp: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toISOString(),
  }));

  return {
    username: "fitcreator",
    followersCount: 10000,
    followingCount: 300,
    totalPosts: 200,
    bio: "fitness coach and gym creator",
    profileCategory: "fitness",
    isPrivate: false,
    isVerified: false,
    isBusinessOrCreator: true,
    posts,
    ...overrides,
  };
}

test("accepts a healthy creator profile", () => {
  const result = buildVerificationOutcome(buildProfile());

  assert.equal(result.category, "fitness");
  assert.equal(result.status, "ACCEPTED_HIGH");
  assert.equal(result.eligibleForCampaigns, true);
  assert.ok(result.score >= 0.75);
});

test("rejects creators with fewer than 1000 followers", () => {
  const result = buildVerificationOutcome(
    buildProfile({
      followersCount: 900,
    }),
  );

  assert.equal(result.status, "REJECTED");
  assert.equal(result.rejectionReason, "TOO_FEW_FOLLOWERS");
  assert.equal(result.eligibleForCampaigns, false);
});

test("rejects private accounts before campaign eligibility", () => {
  const result = buildVerificationOutcome(
    buildProfile({
      isPrivate: true,
    }),
  );

  assert.equal(result.status, "REJECTED");
  assert.equal(result.rejectionReason, "PRIVATE_ACCOUNT");
});
