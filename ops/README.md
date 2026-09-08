# KEYON ops — host watchdog & security lite

## Mục tiêu

- Kiểm tra sức khỏe **máy chủ** (CPU, RAM, disk, PM2, `/api/health`) mỗi 5 phút
- Quét nhẹ malware/path lạ; quét sâu hơn lúc 03:15 UTC
- Ghi JSON cho Admin → **Monitoring**
- Alert Telegram (tuỳ chọn) + ping Healthchecks.io / Better Stack (tuỳ chọn)

## Cài trên VPS

```bash
cd /opt/keyon
git pull   # hoặc copy thư mục ops/
bash ops/install-host-watchdog.sh
```

Điền `/opt/keyon/.env.ops`:

```bash
TELEGRAM_BOT_TOKEN=123:ABC
TELEGRAM_CHAT_ID=123456789
HEALTHCHECKS_PING_URL=https://hc-ping.com/<uuid>
```

Tạo bot: [@BotFather](https://t.me/BotFather) → lấy token → chat với bot → lấy `chat_id` qua `https://api.telegram.org/bot<token>/getUpdates`.

Uptime ngoài: tạo check HTTP `https://keyon.vn/api/health` trên UptimeRobot **và/hoặc** Healthchecks cron ping URL ở trên.

## Output

| File | |
|------|--|
| `/opt/keyon/web/data/ops/host-status.json` | Metrics + alerts gần nhất |
| `/opt/keyon/web/data/ops/security-scan.json` | Findings |
| `/opt/keyon/web/data/ops/incidents.jsonl` | Lịch sử (max ~200 dòng) |
| `/var/log/keyon-watchdog.log` | Log cron |

## Chạy tay

```bash
/opt/keyon/ops/host-watchdog.sh
/opt/keyon/ops/host-watchdog.sh --security-full
```

## Security hardening (VPS)

```bash
cd /opt/keyon
bash ops/install-security-hardening.sh
```

Cài: unattended-upgrades · sysctl · SSH no-password · Cloudflare Authenticated Origin Pulls · backup Postgres hàng ngày (`/var/backups/keyon`, 7 ngày) · baseline `authorized_keys` cho watchdog.

**Cloudflare (bắt buộc sau khi cài):** SSL/TLS → Origin Server → **Authenticated Origin Pulls → ON**.  
SSL/TLS encryption mode: **Full (strict)**. Bật WAF Managed Rules + Bot Fight Mode trên dashboard.

Backup tay: `/opt/keyon/ops/backup-postgres-daily.sh`  
Offsite Wasabi (khi đã có `WASABI_*`): `/opt/keyon/ops/backup-offsite-wasabi.sh`

## App user (non-root)

```bash
bash ops/install-app-user.sh
```

PM2 chạy dưới user `keyon`. Deploy sau khi build:

```bash
sudo -u keyon -H bash -lc 'cd /opt/keyon/web && pm2 restart keyon-web keyon-worker --update-env'
```
