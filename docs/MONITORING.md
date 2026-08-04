# Monitoring — Sprint + Host watchdog

**Status:** ✅ **M1–M7 ALL PASS** · Host watchdog (ops)  
**Exit:** `npm run test:monitoring`

```
M1 ✅ Health DB/Redis/Worker
M2 ✅ Queue depth
M3 ✅ Worker heartbeat
M4 ✅ Payment latency
M5 ✅ Fulfillment latency
M6 ✅ Error rate
M7 ✅ Alert test
H1 ✅ Host watchdog (CPU/RAM/disk/PM2/health) → data/ops/host-status.json
H2 ✅ Security lite scan → data/ops/security-scan.json
H3 ✅ Telegram + Healthchecks (optional env)
H4 ✅ Admin Monitoring: Máy chủ · Bảo mật · Sự cố
```

## Host watchdog

Repo: [`ops/`](../ops/README.md)

| Cron | Job |
|------|-----|
| `*/5` | `ops/host-watchdog.sh` |
| `03:15 UTC` | `--security-full` |

Env: `/opt/keyon/.env.ops` — `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `HEALTHCHECKS_PING_URL`.

Uptime ngoài: UptimeRobot HTTP check `https://keyon.vn/api/health` (khuyến nghị song song Healthchecks cron ping).

**Next:** Sentry (optional) khi traffic lớn.
