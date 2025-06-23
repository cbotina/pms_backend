docker compose -f docker-compose-dev.yml \
  --env-file .env.development.local \
  down

echo "Containers stopped and removed successfully." 
