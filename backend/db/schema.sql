CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'influencer_status') THEN
    CREATE TYPE influencer_status AS ENUM ('ACCEPTED_HIGH', 'ACCEPTED', 'RISKY', 'REJECTED');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_user_id TEXT UNIQUE,
  username TEXT NOT NULL UNIQUE,
  followers INTEGER NOT NULL,
  following INTEGER NOT NULL,
  total_posts INTEGER NOT NULL,
  profile_bio TEXT NOT NULL DEFAULT '',
  profile_category TEXT,
  inferred_category TEXT NOT NULL DEFAULT 'unknown',
  category_confidence DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_business_or_creator BOOLEAN,
  scrape_status TEXT NOT NULL DEFAULT 'fresh',
  scrape_error TEXT,
  engagement_rate DOUBLE PRECISION NOT NULL,
  engagement_rate_normalized DOUBLE PRECISION NOT NULL,
  follower_quality DOUBLE PRECISION NOT NULL,
  consistency DOUBLE PRECISION NOT NULL,
  relevance_score DOUBLE PRECISION NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  status influencer_status NOT NULL,
  eligible_for_campaigns BOOLEAN NOT NULL DEFAULT FALSE,
  rejection_reason TEXT,
  source_provider TEXT NOT NULL,
  last_scraped_at TIMESTAMPTZ NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL,
  cache_expires_at TIMESTAMPTZ NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  manual_override_status influencer_status,
  manual_override_reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_influencers_category ON influencers (inferred_category);
CREATE INDEX IF NOT EXISTS idx_influencers_status ON influencers (status);
CREATE INDEX IF NOT EXISTS idx_influencers_score ON influencers (score DESC);
CREATE INDEX IF NOT EXISTS idx_influencers_last_verified_at ON influencers (last_verified_at DESC);

CREATE TABLE IF NOT EXISTS influencer_posts (
  id BIGSERIAL PRIMARY KEY,
  influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  external_post_id TEXT,
  likes INTEGER NOT NULL,
  comments INTEGER NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  posted_at TIMESTAMPTZ NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (influencer_id, external_post_id)
);

CREATE INDEX IF NOT EXISTS idx_influencer_posts_influencer_id ON influencer_posts (influencer_id);
CREATE INDEX IF NOT EXISTS idx_influencer_posts_posted_at ON influencer_posts (posted_at DESC);

CREATE TABLE IF NOT EXISTS influencer_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL UNIQUE REFERENCES influencers(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_influencer_accounts_email ON influencer_accounts (LOWER(email));

CREATE TABLE IF NOT EXISTS verification_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id UUID NOT NULL REFERENCES influencers(id) ON DELETE CASCADE,
  source_provider TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL,
  metrics JSONB NOT NULL,
  raw_summary JSONB NOT NULL,
  status influencer_status NOT NULL,
  reason TEXT,
  score DOUBLE PRECISION NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_verification_runs_influencer_id ON verification_runs (influencer_id);
CREATE INDEX IF NOT EXISTS idx_verification_runs_fetched_at ON verification_runs (fetched_at DESC);
