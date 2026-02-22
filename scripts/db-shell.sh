#!/bin/bash
set -e

cd "$(dirname "$0")/.."

source .env.development.local 2>/dev/null || true

docker compose --env-file .env.development.local exec db mysql -u "${DB_USERNAME:-pms_user}" -p"${DB_PASSWORD}" "${DB_NAME:-pms_backend}"
