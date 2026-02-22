#!/bin/bash
set -e

cd "$(dirname "$0")/.."

SERVICE=${1:-app}

docker compose --env-file .env.development.local logs -f "$SERVICE"
