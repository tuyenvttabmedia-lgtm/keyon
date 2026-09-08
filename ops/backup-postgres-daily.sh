#!/usr/bin/env bash
# Daily Postgres dump (Fc) — no secrets. Retention 7 days.
# Installed by ops/install-security-hardening.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/keyon}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-7}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT_DIR="$BACKUP_ROOT/$STAMP"
mkdir -p "$OUT_DIR"
chmod 700 "$BACKUP_ROOT"

CONTAINER="${KEYON_PG_CONTAINER:-keyon-prod-postgres}"
PGUSER="${POSTGRES_USER:-keyon}"
PGDB="${POSTGRES_DB:-keyon}"

if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  echo "backup: container $CONTAINER not running" >&2
  exit 1
fi

docker exec "$CONTAINER" pg_dump -U "$PGUSER" -d "$PGDB" -Fc -f "/tmp/keyon-$STAMP.dump"
docker cp "$CONTAINER:/tmp/keyon-$STAMP.dump" "$OUT_DIR/database.dump"
docker exec "$CONTAINER" rm -f "/tmp/keyon-$STAMP.dump"

# Manifest — no connection secrets
GIT_SHA="$(git -C "$APP_ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)"
cat > "$OUT_DIR/backup-manifest.json" <<EOF
{
  "at": "$STAMP",
  "app": "keyon",
  "git": "$GIT_SHA",
  "db": "$PGDB",
  "format": "pg_dump-Fc",
  "host": "$(hostname -s)"
}
EOF

sha256sum "$OUT_DIR/database.dump" | awk '{print $1}' > "$OUT_DIR/database.dump.sha256"
chmod -R go-rwx "$OUT_DIR"

# Retention
find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d -mtime +"$KEEP_DAYS" -exec rm -rf {} +

echo "BACKUP_OK $OUT_DIR ($(du -h "$OUT_DIR/database.dump" | awk '{print $1}'))"

# Optional Wasabi offsite (no-op if credentials empty)
if [[ -x "$APP_ROOT/ops/backup-offsite-wasabi.sh" ]]; then
  LATEST="$OUT_DIR" STAMP="$STAMP" "$APP_ROOT/ops/backup-offsite-wasabi.sh" || echo "offsite_warn"
fi
