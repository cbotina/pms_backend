#!/bin/bash
set -e

cd "$(dirname "$0")/.."

ENV_FILE=".env.development.local"

echo "Building app image..."
docker compose --env-file "$ENV_FILE" build app

echo "Syncing node_modules into the Docker volume (npm ci)..."
docker compose --env-file "$ENV_FILE" run --rm --no-deps app npm ci

echo "Docker build / deps sync complete."
echo "Recreating app so it uses the current volume (needed after changing docker-compose volumes)..."
docker compose --env-file "$ENV_FILE" up -d --force-recreate --no-deps app
