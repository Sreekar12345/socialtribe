import { Pool } from "pg";

function mapRow(row) {
  if (!row) return null;

  return {
    id: row.id,
    instagramUserId: row.instagram_user_id,
    username: row.username,
    followers: row.followers,
    following: row.following,
    totalPosts: row.total_posts,
    profileBio: row.profile_bio,
    profileCategory: row.profile_category,
    category: row.inferred_category,
    categoryConfidence: Number(row.category_confidence),
    isPrivate: row.is_private,
    isVerified: row.is_verified,
    isBusinessOrCreator: row.is_business_or_creator,
    scrapeStatus: row.scrape_status,
    scrapeError: row.scrape_error,
    engagementRate: Number(row.engagement_rate),
    engagementRateNormalized: Number(row.engagement_rate_normalized),
    followerQuality: Number(row.follower_quality),
    consistency: Number(row.consistency),
    relevanceScore: Number(row.relevance_score),
    score: Number(row.score),
    status: row.effective_status,
    eligibleForCampaigns: row.eligible_for_campaigns,
    rejectionReason: row.effective_rejection_reason,
    sourceProvider: row.source_provider,
    lastScrapedAt: row.last_scraped_at?.toISOString?.() ?? row.last_scraped_at,
    lastVerifiedAt: row.last_verified_at?.toISOString?.() ?? row.last_verified_at,
    cacheExpiresAt: row.cache_expires_at?.toISOString?.() ?? row.cache_expires_at,
    lastUpdated: row.last_updated?.toISOString?.() ?? row.last_updated,
  };
}

export function createPostgresInfluencerRepository({ connectionString }) {
  const pool = new Pool({ connectionString });

  const baseSelect = `
    SELECT
      id,
      instagram_user_id,
      username,
      followers,
      following,
      total_posts,
      profile_bio,
      profile_category,
      inferred_category,
      category_confidence,
      is_private,
      is_verified,
      is_business_or_creator,
      scrape_status,
      scrape_error,
      engagement_rate,
      engagement_rate_normalized,
      follower_quality,
      consistency,
      relevance_score,
      score,
      eligible_for_campaigns,
      source_provider,
      last_scraped_at,
      last_verified_at,
      cache_expires_at,
      last_updated,
      COALESCE(manual_override_status::text, status::text) AS effective_status,
      COALESCE(manual_override_reason, rejection_reason) AS effective_rejection_reason
    FROM influencers
  `;

  return {
    async findByUsername(username) {
      const result = await pool.query(
        `${baseSelect} WHERE LOWER(username) = LOWER($1) LIMIT 1`,
        [username],
      );

      return mapRow(result.rows[0]);
    },

    async listInfluencers({ category, status, limit, offset }) {
      const filters = [];
      const values = [];

      if (category) {
        values.push(String(category).toLowerCase());
        filters.push(`LOWER(inferred_category) = $${values.length}`);
      }

      if (status) {
        values.push(String(status).toUpperCase());
        filters.push(
          `COALESCE(manual_override_status::text, status::text) = $${values.length}`,
        );
      }

      const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
      values.push(limit);
      const limitPlaceholder = `$${values.length}`;
      values.push(offset);
      const offsetPlaceholder = `$${values.length}`;

      const [listResult, countResult] = await Promise.all([
        pool.query(
          `${baseSelect} ${whereClause} ORDER BY score DESC, last_verified_at DESC LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
          values,
        ),
        pool.query(
          `SELECT COUNT(*)::int AS total FROM influencers ${whereClause}`,
          values.slice(0, values.length - 2),
        ),
      ]);

      return {
        items: listResult.rows.map(mapRow),
        total: countResult.rows[0]?.total ?? 0,
      };
    },

    async saveVerification({ rawProfile, outcome, verifiedAt, cacheExpiresAt, sourceProvider }) {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const upsertResult = await client.query(
          `
            INSERT INTO influencers (
              instagram_user_id,
              username,
              followers,
              following,
              total_posts,
              profile_bio,
              profile_category,
              inferred_category,
              category_confidence,
              is_private,
              is_verified,
              is_business_or_creator,
              scrape_status,
              scrape_error,
              engagement_rate,
              engagement_rate_normalized,
              follower_quality,
              consistency,
              relevance_score,
              score,
              status,
              eligible_for_campaigns,
              rejection_reason,
              source_provider,
              last_scraped_at,
              last_verified_at,
              cache_expires_at,
              last_updated
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24, $25, $26, $27, NOW()
            )
            ON CONFLICT (username)
            DO UPDATE SET
              instagram_user_id = EXCLUDED.instagram_user_id,
              followers = EXCLUDED.followers,
              following = EXCLUDED.following,
              total_posts = EXCLUDED.total_posts,
              profile_bio = EXCLUDED.profile_bio,
              profile_category = EXCLUDED.profile_category,
              inferred_category = EXCLUDED.inferred_category,
              category_confidence = EXCLUDED.category_confidence,
              is_private = EXCLUDED.is_private,
              is_verified = EXCLUDED.is_verified,
              is_business_or_creator = EXCLUDED.is_business_or_creator,
              scrape_status = EXCLUDED.scrape_status,
              scrape_error = EXCLUDED.scrape_error,
              engagement_rate = EXCLUDED.engagement_rate,
              engagement_rate_normalized = EXCLUDED.engagement_rate_normalized,
              follower_quality = EXCLUDED.follower_quality,
              consistency = EXCLUDED.consistency,
              relevance_score = EXCLUDED.relevance_score,
              score = EXCLUDED.score,
              status = EXCLUDED.status,
              eligible_for_campaigns = EXCLUDED.eligible_for_campaigns,
              rejection_reason = EXCLUDED.rejection_reason,
              source_provider = EXCLUDED.source_provider,
              last_scraped_at = EXCLUDED.last_scraped_at,
              last_verified_at = EXCLUDED.last_verified_at,
              cache_expires_at = EXCLUDED.cache_expires_at,
              last_updated = NOW()
            RETURNING id
          `,
          [
            outcome.instagramUserId,
            outcome.username,
            outcome.followers,
            outcome.following,
            outcome.totalPosts,
            outcome.bio,
            outcome.profileCategory,
            outcome.category,
            outcome.categoryConfidence,
            outcome.isPrivate,
            outcome.isVerified,
            outcome.isBusinessOrCreator,
            outcome.scrapeStatus,
            outcome.scrapeError,
            outcome.engagementRate,
            outcome.engagementRateNormalized,
            outcome.followerQuality,
            outcome.consistency,
            outcome.relevanceScore,
            outcome.score,
            outcome.status,
            outcome.eligibleForCampaigns,
            outcome.rejectionReason,
            sourceProvider,
            verifiedAt,
            verifiedAt,
            cacheExpiresAt,
          ],
        );

        const influencerId = upsertResult.rows[0].id;

        await client.query(
          `DELETE FROM influencer_posts WHERE influencer_id = $1`,
          [influencerId],
        );

        for (const post of rawProfile.posts) {
          await client.query(
            `
              INSERT INTO influencer_posts (
                influencer_id,
                external_post_id,
                likes,
                comments,
                caption,
                posted_at
              )
              VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
              influencerId,
              post.externalPostId ?? null,
              Number(post.likes ?? 0),
              Number(post.comments ?? 0),
              post.caption ?? "",
              new Date(post.timestamp),
            ],
          );
        }

        await client.query(
          `
            INSERT INTO verification_runs (
              influencer_id,
              source_provider,
              fetched_at,
              metrics,
              raw_summary,
              status,
              reason,
              score
            )
            VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6, $7, $8)
          `,
          [
            influencerId,
            sourceProvider,
            verifiedAt,
            JSON.stringify({
              engagementRate: outcome.engagementRate,
              engagementRateNormalized: outcome.engagementRateNormalized,
              followerQuality: outcome.followerQuality,
              consistency: outcome.consistency,
              relevanceScore: outcome.relevanceScore,
              sampledPostCount: outcome.sampledPostCount,
              postsLast30Days: outcome.postsLast30Days,
            }),
            JSON.stringify({
              username: rawProfile.username,
              followersCount: rawProfile.followersCount,
              followingCount: rawProfile.followingCount,
              totalPosts: rawProfile.totalPosts,
              sampledPostCount: rawProfile.posts.length,
              profileCategory: rawProfile.profileCategory ?? null,
            }),
            outcome.status,
            outcome.rejectionReason,
            outcome.score,
          ],
        );

        await client.query("COMMIT");

        const savedResult = await client.query(
          `${baseSelect} WHERE id = $1 LIMIT 1`,
          [influencerId],
        );

        return mapRow(savedResult.rows[0]);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async saveInfluencerAccount({ influencerId, email, passwordHash }) {
      const normalizedEmail = String(email).trim().toLowerCase();
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const existingByEmail = await client.query(
          `
            SELECT id, influencer_id
            FROM influencer_accounts
            WHERE LOWER(email) = LOWER($1)
            LIMIT 1
          `,
          [normalizedEmail],
        );

        if (
          existingByEmail.rows[0] &&
          existingByEmail.rows[0].influencer_id !== influencerId
        ) {
          const error = new Error("An account with this email already exists.");
          error.statusCode = 409;
          throw error;
        }

        const result = await client.query(
          `
            INSERT INTO influencer_accounts (
              influencer_id,
              email,
              password_hash
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (influencer_id)
            DO UPDATE SET
              email = EXCLUDED.email,
              password_hash = EXCLUDED.password_hash,
              updated_at = NOW()
            RETURNING
              id,
              influencer_id,
              email,
              created_at,
              updated_at
          `,
          [influencerId, normalizedEmail, passwordHash],
        );

        await client.query("COMMIT");

        return {
          id: result.rows[0].id,
          influencerId: result.rows[0].influencer_id,
          email: result.rows[0].email,
          createdAt:
            result.rows[0].created_at?.toISOString?.() ??
            result.rows[0].created_at,
          updatedAt:
            result.rows[0].updated_at?.toISOString?.() ??
            result.rows[0].updated_at,
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },

    async close() {
      await pool.end();
    },
  };
}
