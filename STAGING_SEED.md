# Seeding Staging Database on Railway

This guide explains how to seed your staging database on Railway.

## Option 1: Using Railway CLI (Recommended)

The easiest way to seed your staging database is using Railway CLI:

### Prerequisites
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link your project: `railway link` (select your backend service)

### Run the Seeder

For production/staging builds on Railway, use the production seed script:

```bash
# From the pms_backend directory
railway run npm run seed:prod
```

Or if you want to use the dev script (requires TypeScript source files):

```bash
railway run npm run seed
```

This will:
- Connect to your Railway service
- Run the seed command with the correct environment variables
- Seed the database if it's empty

**Note**: The seeder is idempotent - it will skip if data already exists.

## Option 2: Enable Automatic Seeding on Start

If you want the database to seed automatically when the service starts (useful for fresh deployments):

1. Go to Railway dashboard → Your backend service → Variables
2. Add/update these environment variables:
   - `NODE_ENV=staging` (or `development`, `dev`, `stage` - any allowed environment)
   - `SEED_ON_START=true` (to trigger seeding on app startup)

3. Redeploy the service

**Note**: Make sure `NODE_ENV` is set to one of the allowed values (`development`, `dev`, `staging`, or `stage`). Production environments are blocked for safety.

## Option 3: Manual Execution via Railway Shell

1. Go to Railway dashboard → Your backend service
2. Click on "Deployments" → Latest deployment → "View Logs"
3. Or use Railway CLI: `railway shell`
4. Once in the shell, run:
   ```bash
   # For production builds (compiled JavaScript)
   npm run seed:prod
   
   # Or for development builds (TypeScript)
   npm run seed
   ```

## Seeder Behavior

- **Idempotent**: If data already exists, seeding is skipped
- **Environment-aware**: 
  - **Allowed environments**: `development`, `dev`, `staging`, `stage`
  - **Blocked environments**: `production`, `prod`
- **Safe**: Won't overwrite existing data

## Default Credentials After Seeding

After seeding, you can log in with:
- **Admin**: Check `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your Railway environment variables
- **Teachers & Students**: Password is `Password123!`

## Troubleshooting

### Seeder says "disabled in production"
- Set `NODE_ENV` to one of the allowed values: `staging`, `stage`, `development`, or `dev`
- Production environments (`production` or `prod`) are blocked for safety

### Seeder says "Database already has data"
- The seeder detected existing data and skipped seeding
- To reseed, you'll need to clear the database first (not recommended for staging)

### Connection errors
- Verify your database credentials are set correctly in Railway
- Check that the database service is running and accessible
