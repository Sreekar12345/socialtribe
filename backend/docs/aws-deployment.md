# AWS deployment notes

This backend is designed to stay independent from the frontend and run on AWS.

## Recommended AWS components

- ECS Fargate for the API container
- Application Load Balancer for public HTTPS traffic
- RDS PostgreSQL for persistent storage
- Secrets Manager for `DATABASE_URL` and scraper credentials
- CloudWatch for logs and alarms
- EventBridge Scheduler for 24 hour re-verification jobs
- S3 later if you want to store raw payloads or audit artifacts

## Minimum production setup

1. Create an RDS PostgreSQL instance in a private subnet
2. Run `db/schema.sql`
3. Build and push the `backend/` Docker image to ECR
4. Create an ECS task and service with:
   - `PORT=4000`
   - `DATABASE_URL`
   - `SCRAPER_MODE=http`
   - `SCRAPER_API_URL`
   - `SCRAPER_API_TOKEN`
   - `CACHE_TTL_HOURS=24`
5. Attach the ECS service to an ALB target group
6. Set ALB health check path to `/health`
7. Restrict RDS security groups to ECS only
8. Add CloudWatch alarms for 5xx rate and task restart count

## Background refresh

For Phase 3, add an EventBridge schedule that calls a protected internal endpoint or triggers a Lambda/ECS task to reverify influencers whose `cache_expires_at` is in the past.
