#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "=========================================================="
echo " Starting Automated Tumaini AI Deployment & Seeding"
echo "=========================================================="

# 1. Ensure env file is positioned correctly
echo "[1/5] Positioning environment variables..."
if [ -f ".env" ]; then
    cp .env deploy/.env
else
    echo "ERROR: Local .env file not found in the root directory!"
    exit 1
fi

# 2. Build and start containers
echo "[2/5] Compiling and starting Docker containers..."
sudo docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build

# Wait a brief moment for database healthchecks
echo "Waiting 5 seconds for database containers to stabilize..."
sleep 5

# 3. Run Database migrations
echo "[3/5] Running Alembic database migrations..."
sudo docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env exec -w /app/services/identity identity alembic upgrade head

# 4. Copy and execute admin database seeder
echo "[4/5] Copying and executing admin account database seeder..."
sudo docker cp services/identity/seed_admin.py tumaini-prod-identity-1:/app/services/identity/seed_admin.py
sudo docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env exec -w /app/services/identity identity python seed_admin.py

# 5. Apply Caddy proxy settings
echo "[5/5] Refreshing Caddy Web Gateway..."
if [ -f "deploy/Caddyfile" ]; then
    sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
    sudo systemctl reload caddy
else
    echo "Warning: deploy/Caddyfile not found. Skipping gateway reload."
fi

echo "=========================================================="
echo " Deployment Successfully Completed! Application is live!"
echo "=========================================================="
