#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Stopping containers..."
docker compose --env-file .env.development.local down
echo "Containers stopped."
