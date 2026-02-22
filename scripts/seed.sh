#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Running database seeder..."
docker compose --env-file .env.development.local exec app npx ts-node -r tsconfig-paths/register src/seeder/seed.ts
echo "Seeding complete."
