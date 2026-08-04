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
