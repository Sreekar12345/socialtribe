# SocialTribe Verification Backend

Backend-only service for influencer verification. This lives separately from the frontend and is intended to run behind AWS ECS/Fargate with PostgreSQL on RDS.

## What it includes

- `POST /api/v1/verify-influencer`
- `GET /api/v1/influencers`
- `GET /api/v1/influencers/:username`
- `POST /api/v1/influencers/:username/reverify`
- Rule-based scoring engine for engagement, follower quality, consistency, and relevance
- 24 hour cache support
- PostgreSQL schema for latest snapshot plus verification history
- Mock scraper provider for local development
- Generic HTTP scraper adapter for plugging in Apify or another scraper later

## Quick start

1. Copy `.env.example` to `.env`
2. Set `SCRAPER_MODE=mock` to use the built-in sample provider
3. Install dependencies inside `backend/`
4. Run `npm run dev`

## Environment

- `DATABASE_URL`: PostgreSQL connection string. If empty, the service falls back to in-memory storage for development.
- `CACHE_TTL_HOURS`: Influencer verification cache TTL, default `24`
- `SCRAPER_MODE`: `mock` or `http`
- `SCRAPER_API_URL`: Used when `SCRAPER_MODE=http`. The backend sends `POST` with `{ "username": "..." }`
- `SCRAPER_API_TOKEN`: Optional bearer token for the external scraper
- `SOURCE_PROVIDER`: Stored with verification runs for auditability

## Example request

```bash
curl -X POST http://localhost:4000/api/v1/verify-influencer \
  -H "content-type: application/json" \
  -d '{"username":"mayalifts"}'
```

## AWS notes

- Use [schema.sql](./db/schema.sql) to initialize RDS PostgreSQL
- Set the ALB health check path to `/health`
- Use ECS task environment variables for config, but keep secrets in AWS Secrets Manager
- Use EventBridge Scheduler later to reverify cached influencers automatically
