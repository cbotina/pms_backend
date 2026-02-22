#!/bin/bash
set -e

cd "$(dirname "$0")/.."

docker compose --env-file .env.development.local exec app sh
