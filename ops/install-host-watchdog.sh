#!/usr/bin/env bash
# Install KEYON host watchdog cron on the VPS.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
OPS_DIR="$APP_ROOT/ops"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$OPS_DIR" /var/log
install -m 0755 "$SRC_DIR/host-watchdog.sh" "$OPS_DIR/host-watchdog.sh"

# Env template
ENV_OPS="$APP_ROOT/.env.ops"
if [[ ! -f "$ENV_OPS" ]]; then
  cat > "$ENV_OPS" <<'EOF'
# KEYON host watchdog — copy tokens then: chmod 600 /opt/keyon/.env.ops
# TELEGRAM_BOT_TOKEN=
# TELEGRAM_CHAT_ID=
# HEALTHCHECKS_PING_URL=https://hc-ping.com/your-uuid
# WATCHDOG_CPU_PCT=85
# WATCHDOG_LOAD_RATIO=1.5
# WATCHDOG_RAM_AVAIL_MB=200
# WATCHDOG_DISK_PCT=85
# WATCHDOG_PM2_RESTARTS_WARN=8
# WATCHDOG_COOLDOWN_SEC=1800
EOF
  chmod 600 "$ENV_OPS"
  echo "Created $ENV_OPS (fill Telegram / Healthchecks)"
fi

CRON_FILE=/etc/cron.d/keyon-watchdog
cat > "$CRON_FILE" <<EOF
# KEYON host health + security lite (every 5 min) · full scan 03:15 UTC
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
*/5 * * * * root $OPS_DIR/host-watchdog.sh >> /var/log/keyon-watchdog.log 2>&1
15 3 * * * root $OPS_DIR/host-watchdog.sh --security-full >> /var/log/keyon-watchdog.log 2>&1
EOF
chmod 644 "$CRON_FILE"

# First run
"$OPS_DIR/host-watchdog.sh" || true
echo "Installed cron: $CRON_FILE"
echo "INSTALL_WATCHDOG_OK"
