#!/usr/bin/env bash
# Lock origin HTTP/HTTPS to Cloudflare IP ranges only; optionally pin SSH to your IP.
# Safe order: allow new rules first, then delete open Anywhere rules.
set -euo pipefail

echo "== KEYON firewall: Cloudflare-only 80/443 =="

if ! command -v ufw >/dev/null; then
  echo "ufw missing" >&2
  exit 1
fi

TMP_V4="$(mktemp)"
TMP_V6="$(mktemp)"
trap 'rm -f "$TMP_V4" "$TMP_V6"' EXIT

curl -fsSL --max-time 30 https://www.cloudflare.com/ips-v4 -o "$TMP_V4"
curl -fsSL --max-time 30 https://www.cloudflare.com/ips-v6 -o "$TMP_V6" || true

# Ensure UFW is active with deny incoming default
ufw --force enable >/dev/null || true
ufw default deny incoming >/dev/null || true
ufw default allow outgoing >/dev/null || true
# Loopback is usually already allowed; skip invalid "allow on lo" syntax

# Allow CF → 80/443 (commented so we can refresh later)
while read -r cidr; do
  cidr="${cidr%$'\r'}"
  [[ -z "$cidr" || "$cidr" =~ ^# ]] && continue
  ufw allow from "$cidr" to any port 80 proto tcp comment 'CF-HTTP' >/dev/null || true
  ufw allow from "$cidr" to any port 443 proto tcp comment 'CF-HTTPS' >/dev/null || true
done < "$TMP_V4"

if [[ -s "$TMP_V6" ]]; then
  while read -r cidr; do
    cidr="${cidr%$'\r'}"
    [[ -z "$cidr" || "$cidr" =~ ^# ]] && continue
    ufw allow from "$cidr" to any port 80 proto tcp comment 'CF-HTTP6' >/dev/null || true
    ufw allow from "$cidr" to any port 443 proto tcp comment 'CF-HTTPS6' >/dev/null || true
  done < "$TMP_V6"
fi

# SSH allowlist: current session IP (failsafe) + optional KEYON_SSH_ALLOW_IP
SSH_IP=""
if [[ -n "${SSH_CONNECTION:-}" ]]; then
  SSH_IP="$(echo "$SSH_CONNECTION" | awk '{print $1}')"
elif [[ -n "${SSH_CLIENT:-}" ]]; then
  SSH_IP="$(echo "$SSH_CLIENT" | awk '{print $1}')"
fi
EXTRA="${KEYON_SSH_ALLOW_IP:-}"

allow_ssh() {
  local ip="$1"
  [[ -z "$ip" ]] && return 0
  # skip if looks like private/docker weirdness without public
  ufw allow from "$ip" to any port 22 proto tcp comment 'KEYON-SSH' >/dev/null || true
  echo "ssh_allow $ip"
}

allow_ssh "$SSH_IP"
if [[ -n "$EXTRA" && "$EXTRA" != "$SSH_IP" ]]; then
  allow_ssh "$EXTRA"
fi

# Remove wide-open web rules (keep labeled CF rules)
# Delete by matching rules that allow Anywhere on 80/443/22
python3 - <<'PY'
import subprocess, re
out = subprocess.check_output(["ufw", "status", "numbered"], text=True, errors="replace")
# Collect rule numbers to delete (reverse order)
nums = []
for line in out.splitlines():
    m = re.match(r"\[\s*(\d+)\]\s+(.*)", line)
    if not m:
        continue
    n, rest = m.group(1), m.group(2)
    # Open world web/ssh without CF comment
    if re.search(r"\b(80|443)/tcp\b", rest) and "Anywhere" in rest and "CF-" not in rest and "ALLOW IN" in rest:
        nums.append(n)
    if re.search(r"\b22/tcp\b", rest) and "Anywhere" in rest and "KEYON-SSH" not in rest and "ALLOW IN" in rest:
        # Only remove open SSH if we have at least one KEYON-SSH rule
        nums.append(("ssh", n))

# Check KEYON-SSH exists
has_ssh_pin = "KEYON-SSH" in out
to_del = []
for item in nums:
    if isinstance(item, tuple):
        if has_ssh_pin:
            to_del.append(item[1])
    else:
        to_del.append(item)

for n in sorted((int(x) for x in to_del), reverse=True):
    subprocess.run(["ufw", "--force", "delete", str(n)], check=False)
    print(f"deleted_rule {n}")
print(f"ssh_pin={has_ssh_pin}")
PY

ufw reload >/dev/null || true
echo "=== ufw status ==="
ufw status numbered | head -80
echo "FIREWALL_CLOUDFLARE_LOCK_OK"
if [[ -z "$SSH_IP" && -z "$EXTRA" ]]; then
  echo "WARN: could not detect SSH client IP — port 22 may still be open from Anywhere"
fi
