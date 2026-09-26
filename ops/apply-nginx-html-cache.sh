#!/usr/bin/env bash
# Apply HTML CDN-friendly cache helpers to /etc/nginx/sites-enabled/keyon.vn
# Safe to re-run. Requires sudo.
set -euo pipefail

SITE="${KEYON_NGINX_SITE:-/etc/nginx/sites-enabled/keyon.vn}"
MAP_SRC="$(cd "$(dirname "$0")" && pwd)/nginx-keyon-cache-map.conf"
MAP_DST="/etc/nginx/conf.d/keyon-cache-map.conf"
BACKUP="/var/backups/keyon/nginx-keyon.vn.$(date +%Y%m%d%H%M%S).bak"

if [[ ! -f "$SITE" ]]; then
  echo "missing site config: $SITE" >&2
  exit 1
fi
if [[ ! -f "$MAP_SRC" ]]; then
  echo "missing map snippet: $MAP_SRC" >&2
  exit 1
fi

sudo mkdir -p /var/cache/nginx/keyon /var/backups/keyon
sudo cp -a "$SITE" "$BACKUP"
sudo cp "$MAP_SRC" "$MAP_DST"

python3 - <<'PY'
from pathlib import Path
import re

site = Path("/etc/nginx/sites-enabled/keyon.vn")
text = site.read_text(encoding="utf-8")
marker = "# KEYON_HTML_CACHE_BEGIN"

CACHE_LOCATION = '''
    location / {
        # KEYON_HTML_CACHE_BEGIN
        # Bypass nginx + tell CF no-store for Next Flight/RSC and logged-in sessions.
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_cache keyon_html;
        proxy_cache_methods GET HEAD;
        proxy_cache_valid 200 60s;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        proxy_cache_lock on;
        proxy_cache_bypass $keyon_is_flight $keyon_has_session;
        proxy_no_cache $keyon_is_flight $keyon_has_session;

        # CF will not cache when Vary lists RSC headers — keep Accept-Encoding only.
        proxy_hide_header Vary;
        add_header Vary "Accept-Encoding" always;
        # Document: eligible for CF edge. Flight: no-store (same URL as HTML).
        add_header Cloudflare-CDN-Cache-Control $keyon_cf_cdn_cc always;
        add_header CDN-Cache-Control $keyon_cf_cdn_cc always;
        add_header X-Keyon-Cache $upstream_cache_status always;
        # KEYON_HTML_CACHE_END
    }
'''.strip()

if marker in text:
    text2, n = re.subn(
        r"location / \{.*?KEYON_HTML_CACHE_END\s*\}",
        CACHE_LOCATION,
        text,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit(f"re-patch failed (matches={n})")
    text = text2
else:
    text2, n = re.subn(
        r"location / \{\s*proxy_pass http://127\.0\.0\.1:3000;.*?\}",
        CACHE_LOCATION,
        text,
        count=1,
        flags=re.S,
    )
    if n != 1:
        raise SystemExit(f"could not patch location / (matches={n})")
    text = text2

site.write_text(text + ("" if text.endswith("\n") else "\n"), encoding="utf-8")
print("patched", site)
PY

sudo nginx -t
sudo systemctl reload nginx
echo "NGINX_HTML_CACHE_OK backup=$BACKUP"
