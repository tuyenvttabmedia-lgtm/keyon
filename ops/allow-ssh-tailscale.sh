#!/usr/bin/env bash
# After VPS is joined to Tailscale: allow SSH on overlay, open WireGuard port.
# Does NOT remove existing KEYON-SSH home pins — run drop separately after verify.
set -euo pipefail

command -v tailscale >/dev/null || { echo "tailscale not installed" >&2; exit 1; }
systemctl enable --now tailscaled >/dev/null 2>&1 || true

echo "tailscale_ip=$(tailscale ip -4 | head -1)"
ufw allow 41641/udp comment 'Tailscale-WG' >/dev/null || true
ufw allow in on tailscale0 comment 'Tailscale-iface' >/dev/null || true
ufw allow from 100.64.0.0/10 to any port 22 proto tcp comment 'KEYON-SSH-TS' >/dev/null || true
ufw reload >/dev/null || true
ufw status | grep -E '22/tcp|tailscale|41641|KEYON-SSH' || true
echo "TAILSCALE_SSH_ALLOW_OK"
