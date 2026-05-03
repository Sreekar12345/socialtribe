import { CATEGORY_KEYWORDS } from "../domain/keywords.js";
import { normalizeUsername } from "../domain/verification.js";

function hash(input) {
  return [...input].reduce((acc, char) => acc * 31 + char.charCodeAt(0), 7);
}

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function buildPost(seed, caption, dayOffset) {
  return {
    externalPostId: `mock-post-${seed}-${dayOffset}`,
    likes: seed,
    comments: Math.max(5, Math.round(seed * 0.06)),
    caption,
    timestamp: daysAgo(dayOffset),
  };
}

function buildGeneratedProfile(username) {
  const normalizedUsername = normalizeUsername(username);
  const seed = Math.abs(hash(normalizedUsername));
  const categories = Object.keys(CATEGORY_KEYWORDS);
  const category = categories[seed % categories.length];
  const keywords = CATEGORY_KEYWORDS[category];
  const followersCount = 8_000 + (seed % 60_000);
  const totalPosts = 120 + (seed % 600);
  const likesBase = Math.round(followersCount * 0.035);

  return {
    instagramUserId: `mock-${normalizedUsername}`,
    username: normalizedUsername,
    followersCount,
    followingCount: 200 + (seed % 2_000),
    totalPosts,
    bio: `${category} creator sharing ${keywords.join(", ")} content`,
    profileCategory: category,
    isPrivate: false,
    isVerified: seed % 4 === 0,
    isBusinessOrCreator: true,
    posts: Array.from({ length: 12 }, (_, index) =>
      buildPost(
        likesBase + (index % 3) * 40,
        `Latest ${category} post covering ${keywords[index % keywords.length]}`,
        index * 2 + 1,
      ),
    ),
  };
}

const SAMPLE_PROFILES = {
  example_user: {
    instagramUserId: "mock-example-user",
    username: "example_user",
    followersCount: 25_000,
    followingCount: 860,
    totalPosts: 348,
    bio: "fitness coach | gym routines | workout plans",
    profileCategory: "fitness",
    isPrivate: false,
    isVerified: false,
    isBusinessOrCreator: true,
    posts: [
      buildPost(920, "Gym routine and workout tips for leg day", 2),
      buildPost(880, "Full fitness session at the gym", 4),
      buildPost(970, "Workout plan for core strength", 6),
      buildPost(910, "Morning gym session and fitness stretch", 8),
      buildPost(890, "Workout recovery day", 10),
      buildPost(960, "Fitness challenge update", 12),
      buildPost(905, "Gym snacks and workout prep", 14),
      buildPost(875, "Functional fitness training", 16),
      buildPost(930, "Workout mistakes to avoid", 18),
      buildPost(915, "Gym essentials for beginners", 20),
      buildPost(905, "Fitness diary and workout wrap-up", 22),
      buildPost(885, "Gym finisher set", 24),
    ],
  },
  lowreachdemo: {
    instagramUserId: "mock-lowreachdemo",
    username: "lowreachdemo",
    followersCount: 800,
    followingCount: 400,
    totalPosts: 22,
    bio: "new creator",
    profileCategory: "lifestyle",
    isPrivate: false,
    isVerified: false,
    isBusinessOrCreator: false,
    posts: [
      buildPost(8, "First post", 2),
      buildPost(6, "Trying content", 8),
    ],
  },
};

export function createMockInstagramProvider() {
  return {
    async fetchByUsername(username) {
      const normalizedUsername = normalizeUsername(username);
      const sample = SAMPLE_PROFILES[normalizedUsername];

      if (sample) {
        return structuredClone(sample);
      }

      return buildGeneratedProfile(normalizedUsername);
    },
  };
}
