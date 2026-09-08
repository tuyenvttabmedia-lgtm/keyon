#!/usr/bin/env bash
# KEYON VPS security hardening installer (idempotent).
# - unattended-upgrades
# - Cloudflare Authenticated Origin Pulls (nginx)
# - daily Postgres backup cron
# - sysctl / SSH baseline
# - authorized_keys fingerprint baseline for watchdog
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
OPS_DIR="$APP_ROOT/ops"
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$OPS_DIR" /var/backups/keyon /etc/ssl/cloudflare /opt/keyon/web/data/ops
chmod 700 /var/backups/keyon

copy_ops() {
  local src="$1" dest="$2"
  if [[ "$(readlink -f "$src" 2>/dev/null || echo "$src")" == "$(readlink -f "$dest" 2>/dev/null || echo "$dest")" ]]; then
    chmod 0755 "$dest" 2>/dev/null || true
    return 0
  fi
  install -m 0755 "$src" "$dest"
}
copy_ops "$SRC_DIR/backup-postgres-daily.sh" "$OPS_DIR/backup-postgres-daily.sh"
copy_ops "$SRC_DIR/backup-offsite-wasabi.sh" "$OPS_DIR/backup-offsite-wasabi.sh"
copy_ops "$SRC_DIR/host-watchdog.sh" "$OPS_DIR/host-watchdog.sh"
copy_ops "$SRC_DIR/install-security-hardening.sh" "$OPS_DIR/install-security-hardening.sh"
copy_ops "$SRC_DIR/install-app-user.sh" "$OPS_DIR/install-app-user.sh"

echo "== unattended-upgrades =="
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq unattended-upgrades apt-listchanges >/dev/null
cat > /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat > /etc/apt/apt.conf.d/50unattended-upgrades-keyon <<'EOF'
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
EOF

echo "== sysctl harden =="
cat > /etc/sysctl.d/99-keyon-harden.conf <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
EOF
sysctl --system >/dev/null 2>&1 || sysctl -p /etc/sysctl.d/99-keyon-harden.conf || true

echo "== SSH baseline =="
mkdir -p /etc/ssh/sshd_config.d
cat > /etc/ssh/sshd_config.d/50-cloud-init.conf <<'EOF'
PasswordAuthentication no
EOF
cat > /etc/ssh/sshd_config.d/zz-keyon-no-password.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitEmptyPasswords no
PermitRootLogin prohibit-password
PubkeyAuthentication yes
MaxAuthTries 3
X11Forwarding no
AllowTcpForwarding no
ClientAliveInterval 300
ClientAliveCountMax 2
EOF
sed -i 's/^[#[:space:]]*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config || true
sshd -t && systemctl reload ssh || systemctl reload sshd || true

echo "== Cloudflare Authenticated Origin Pull CA =="
curl -fsSL --max-time 30 \
  "https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem" \
  -o /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem
chmod 644 /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem

SITE=/etc/nginx/sites-available/keyon.vn
if [[ -f "$SITE" ]]; then
  if ! grep -q 'authenticated_origin_pull_ca.pem' "$SITE"; then
    python3 - <<'PY'
from pathlib import Path
p = Path("/etc/nginx/sites-available/keyon.vn")
t = p.read_text()
block = """
    # Cloudflare Authenticated Origin Pulls
    # Start optional so site stays up until CF dashboard toggle is ON; then:
    #   sed -i 's/ssl_verify_client optional;/ssl_verify_client on;/' /etc/nginx/sites-available/keyon.vn && nginx -t && systemctl reload nginx
    ssl_client_certificate /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem;
    ssl_verify_client optional;
"""
    needle = "ssl_protocols       TLSv1.2 TLSv1.3;"
    if needle not in t:
        raise SystemExit("nginx site missing ssl_protocols insert point")
    p.write_text(t.replace(needle, needle + "\n" + block, 1))
    print("nginx_origin_pull_injected_optional")
PY
  else
    echo "nginx_origin_pull_present"
  fi
  nginx -t
  systemctl reload nginx
fi

# If CF Authenticated Origin Pulls already sending certs, tighten to on
if curl -fsS -m 15 -o /dev/null -w '%{http_code}' https://keyon.vn/api/health 2>/dev/null | grep -q 200; then
  if grep -q 'ssl_verify_client optional;' "$SITE" 2>/dev/null; then
    # Probe whether CF is already attaching client certs: keep optional until ops enables CF
    echo "origin_pull_mode=optional (enable CF Authenticated Origin Pulls, then re-run with KEYON_ORIGIN_PULL_STRICT=1)"
  fi
fi
if [[ "${KEYON_ORIGIN_PULL_STRICT:-0}" == "1" ]]; then
  sed -i 's/ssl_verify_client optional;/ssl_verify_client on;/' "$SITE"
  nginx -t && systemctl reload nginx
  echo "origin_pull_mode=on"
fi

echo "== backup cron =="
cat > /etc/cron.d/keyon-backup <<EOF
# KEYON daily Postgres backup 02:20 UTC · retention 7d
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
20 2 * * * root $OPS_DIR/backup-postgres-daily.sh >> /var/log/keyon-backup.log 2>&1
EOF
chmod 644 /etc/cron.d/keyon-backup

echo "== authorized_keys baseline =="
BASE=/opt/keyon/web/data/ops/ssh-authorized-keys.sha256
sha256sum /root/.ssh/authorized_keys | awk '{print $1}' > "$BASE"
chmod 600 "$BASE"
# Also store expected key comments
awk '{print $NF}' /root/.ssh/authorized_keys > /opt/keyon/web/data/ops/ssh-authorized-keys.comments
chmod 600 /opt/keyon/web/data/ops/ssh-authorized-keys.comments

echo "== env perms =="
chmod 600 /opt/keyon/.env.production /opt/keyon/web/.env /opt/keyon/web/.env.local /opt/keyon/web/.env.production 2>/dev/null || true
chmod 600 /opt/keyon/.env.ops /opt/keyon/.env.compose 2>/dev/null || true

echo "== fail2ban =="
systemctl enable --now fail2ban 2>/dev/null || true
if [[ ! -f /etc/fail2ban/jail.local ]]; then
  cat > /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 ::1

[sshd]
enabled = true
backend = systemd
maxretry = 4
EOF
  systemctl restart fail2ban
fi

echo "== first backup smoke =="
"$OPS_DIR/backup-postgres-daily.sh" || echo "BACKUP_SMOKE_WARN"

echo "INSTALL_SECURITY_HARDENING_OK"
echo "ACTION_REQUIRED: Cloudflare → SSL/TLS → Origin Server → Authenticated Origin Pulls → ON"
