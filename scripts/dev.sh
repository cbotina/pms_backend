#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Starting development environment..."
docker compose --env-file .env.development.local up
