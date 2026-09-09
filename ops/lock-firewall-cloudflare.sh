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

# Prefer Tailscale SSH (stable) over pinning dynamic home IP.
# Set KEYON_PIN_SSH_CLIENT_IP=1 only for emergency break-glass from current public IP.
PREFER_TS="${KEYON_PREFER_TAILSCALE_SSH:-1}"
if [[ "$PREFER_TS" == "1" ]] && command -v tailscale >/dev/null 2>&1 && tailscale ip -4 >/dev/null 2>&1; then
  ufw allow 41641/udp comment 'Tailscale-WG' >/dev/null || true
  ufw allow in on tailscale0 comment 'Tailscale-iface' >/dev/null || true
  ufw allow from 100.64.0.0/10 to any port 22 proto tcp comment 'KEYON-SSH-TS' >/dev/null || true
  echo "ssh_mode=tailscale"
elif [[ "${KEYON_PIN_SSH_CLIENT_IP:-0}" == "1" ]]; then
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
    ufw allow from "$ip" to any port 22 proto tcp comment 'KEYON-SSH' >/dev/null || true
    echo "ssh_allow $ip"
  }
  allow_ssh "$SSH_IP"
  if [[ -n "$EXTRA" && "$EXTRA" != "$SSH_IP" ]]; then
    allow_ssh "$EXTRA"
  fi
  echo "ssh_mode=client_ip_pin"
else
  echo "ssh_mode=unchanged (enable Tailscale or KEYON_PIN_SSH_CLIENT_IP=1)"
fi

# Stealth: drop ICMP echo-request so casual ping scans do not confirm the host
if [[ -f /etc/ufw/before.rules ]] && ! grep -q 'KEYON-ICMP-STEALTH' /etc/ufw/before.rules; then
  python3 - <<'PY'
from pathlib import Path
import re
p = Path("/etc/ufw/before.rules")
t = p.read_text()
t2, n = re.subn(
    r"-A ufw-before-input -p icmp --icmp-type echo-request -j ACCEPT",
    "-A ufw-before-input -p icmp --icmp-type echo-request -j DROP  # KEYON-ICMP-STEALTH",
    t,
    count=1,
)
if n:
    p.write_text(t2)
    print("icmp_stealth_patched")
else:
    print("icmp_rule_not_found_skip")
PY
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

# Check KEYON-SSH / Tailscale pin exists before deleting open SSH
has_ssh_pin = ("KEYON-SSH" in out) or ("KEYON-SSH-TS" in out)
to_del = []
for item in nums:
    if isinstance(item, tuple):
        if has_ssh_pin:
            to_del.append(item[1])
    else:
        to_del.append(item)

# If Tailscale mode: also drop legacy KEYON-SSH home-IP pins (not KEYON-SSH-TS)
if "KEYON-SSH-TS" in out:
    for line in out.splitlines():
        m = re.match(r"\[\s*(\d+)\]\s+(.*)", line)
        if not m:
            continue
        n, rest = m.group(1), m.group(2)
        if "KEYON-SSH" in rest and "KEYON-SSH-TS" not in rest and "ALLOW IN" in rest:
            to_del.append(n)

for n in sorted({int(x) for x in to_del}, reverse=True):
    subprocess.run(["ufw", "--force", "delete", str(n)], check=False)
    print(f"deleted_rule {n}")
print(f"ssh_pin={has_ssh_pin}")
PY

ufw reload >/dev/null || true
echo "=== ufw status ==="
ufw status numbered | head -80
echo "FIREWALL_CLOUDFLARE_LOCK_OK"
echo "NOTE: Cloudflare A/AAAA for the site must stay Proxied (orange) — dashboard still shows origin IP privately."
