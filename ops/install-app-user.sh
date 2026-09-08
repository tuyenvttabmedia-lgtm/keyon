#!/usr/bin/env bash
# Run KEYON Next + worker as system user `keyon` (not root).
# Nginx / Docker / SSH stay root. Deploy still uses root git pull then sudo -u keyon pm2.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
WEB_ROOT="$APP_ROOT/web"
USER_NAME=keyon
HOME_DIR=/home/keyon

if ! id "$USER_NAME" >/dev/null 2>&1; then
  useradd --system --create-home --home-dir "$HOME_DIR" --shell /usr/sbin/nologin "$USER_NAME"
  echo "created user $USER_NAME"
fi

mkdir -p "$HOME_DIR" /var/keyon/uploads
# App tree readable/writable by keyon (deploy as root still ok)
chown -R "$USER_NAME:$USER_NAME" "$WEB_ROOT" /var/keyon "$HOME_DIR"
# Shared env readable by keyon group
chgrp "$USER_NAME" "$APP_ROOT/.env.production" "$WEB_ROOT/.env" "$WEB_ROOT/.env.local" "$WEB_ROOT/.env.production" 2>/dev/null || true
chmod 640 "$APP_ROOT/.env.production" "$WEB_ROOT/.env" "$WEB_ROOT/.env.local" "$WEB_ROOT/.env.production" 2>/dev/null || true
chmod 750 "$APP_ROOT/ops"/*.sh 2>/dev/null || true

# Stop root PM2 apps
if command -v pm2 >/dev/null; then
  pm2 delete keyon-web keyon-worker 2>/dev/null || true
  pm2 kill 2>/dev/null || true
fi

# Ensure global pm2 available to keyon via /usr/local or nvm path
NODE_BIN="$(command -v node)"
NPM_BIN="$(command -v npm)"
PM2_BIN="$(command -v pm2)"
NODE_DIR="$(dirname "$NODE_BIN")"

sudo -u "$USER_NAME" -H bash -lc "
  export PATH='$NODE_DIR':\$PATH
  cd '$WEB_ROOT'
  '$PM2_BIN' start '$WEB_ROOT/node_modules/next/dist/bin/next' --name keyon-web -- start -H 127.0.0.1 -p 3000
  '$PM2_BIN' start '$WEB_ROOT/node_modules/tsx/dist/cli.mjs' --name keyon-worker --cwd '$WEB_ROOT' -- --env-file=.env.local --env-file=.env scripts/worker.ts
  '$PM2_BIN' save
"

# systemd startup for keyon user
STARTUP_CMD=$(sudo -u "$USER_NAME" -H bash -lc "export PATH='$NODE_DIR':\$PATH; pm2 startup systemd -u $USER_NAME --hp $HOME_DIR" | grep -E 'sudo.*env' | tail -1 || true)
if [[ -n "$STARTUP_CMD" ]]; then
  eval "$STARTUP_CMD"
fi

# Disable root pm2 unit if present
systemctl disable pm2-root 2>/dev/null || true
systemctl stop pm2-root 2>/dev/null || true

sleep 5
curl -sS -m 15 http://127.0.0.1:3000/api/health | head -c 400; echo
sudo -u "$USER_NAME" -H bash -lc "export PATH='$NODE_DIR':\$PATH; pm2 status"
echo "INSTALL_APP_USER_OK"
echo "Redeploy: after build, run: sudo -u keyon -H bash -lc 'export PATH=$NODE_DIR:\$PATH; cd $WEB_ROOT; pm2 restart keyon-web keyon-worker --update-env'"
