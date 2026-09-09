#!/usr/bin/env bash
# Enable Redis requirepass on prod compose + update REDIS_URL in .env.production.
# Idempotent. Recreates redis; restart PM2 afterward so REDIS_URL is picked up.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
ENV_FILE="${APP_ROOT}/.env.production"
COMPOSE="${APP_ROOT}/compose.prod.yaml"
NODE_DIR="$(dirname "$(command -v node)")"
WEB_ROOT="${APP_ROOT}/web"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing $ENV_FILE" >&2
  exit 1
fi

upsert_env() {
  local file="$1" key="$2" val="$3"
  if grep -qE "^${key}=" "$file" 2>/dev/null; then
    sed -i -E "s|^${key}=.*|${key}=${val}|" "$file"
  else
    echo "${key}=${val}" >> "$file"
  fi
}

PASS="$(grep -E '^REDIS_PASSWORD=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r' || true)"
if [[ -z "$PASS" ]]; then
  PASS="$(openssl rand -hex 24)"
  echo "generated REDIS_PASSWORD"
else
  echo "REDIS_PASSWORD already set"
fi

upsert_env "$ENV_FILE" "REDIS_PASSWORD" "$PASS"
upsert_env "$ENV_FILE" "REDIS_URL" "redis://:${PASS}@127.0.0.1:6379"
chmod 640 "$ENV_FILE" 2>/dev/null || chmod 600 "$ENV_FILE"
chown root:keyon "$ENV_FILE" 2>/dev/null || true

# Keep web env in sync (redeploy also copies .env.production → .env.local)
for f in "$WEB_ROOT/.env" "$WEB_ROOT/.env.local" "$WEB_ROOT/.env.production"; do
  if [[ -f "$f" ]]; then
    upsert_env "$f" "REDIS_PASSWORD" "$PASS"
    upsert_env "$f" "REDIS_URL" "redis://:${PASS}@127.0.0.1:6379"
    chmod 640 "$f" 2>/dev/null || true
    chown keyon:keyon "$f" 2>/dev/null || true
  fi
done

if [[ ! -f "$COMPOSE" ]]; then
  echo "missing compose — applied ENV only" >&2
  exit 1
fi

cd "$APP_ROOT"
docker compose -f compose.prod.yaml --env-file .env.production up -d redis
sleep 3

# Verify auth required + password works
if docker exec keyon-prod-redis redis-cli ping 2>/dev/null | grep -q PONG; then
  echo "WARN: redis still accepts unauthenticated ping — forcing CONFIG SET"
  docker exec keyon-prod-redis redis-cli CONFIG SET requirepass "$PASS" >/dev/null
fi

docker exec keyon-prod-redis redis-cli -a "$PASS" --no-auth-warning ping | grep -q PONG
echo "redis_auth_ok"

# Restart app so BullMQ / ioredis pick up REDIS_URL
if id keyon >/dev/null 2>&1 && sudo -u keyon -H bash -lc "export PATH='$NODE_DIR':\$PATH; pm2 describe keyon-web" >/dev/null 2>&1; then
  sudo -u keyon -H bash -lc "export PATH='$NODE_DIR':\$PATH; cd '$WEB_ROOT'; pm2 restart keyon-web keyon-worker --update-env; pm2 save"
else
  pm2 restart keyon-web keyon-worker --update-env
  pm2 save
fi

sleep 5
curl -sS -m 20 http://127.0.0.1:3000/api/health || true
echo
echo "REDIS_AUTH_OK"
