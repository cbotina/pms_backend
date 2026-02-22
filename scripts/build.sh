#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Building production image..."
docker compose --env-file .env.development.local build --no-cache
echo "Build complete."
