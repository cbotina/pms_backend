#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "This will delete all database data. Are you sure? (y/N)"
read -r confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

echo "Stopping containers and removing database volume..."
docker compose --env-file .env.development.local down -v
echo "Restarting development environment..."
docker compose --env-file .env.development.local up --build
