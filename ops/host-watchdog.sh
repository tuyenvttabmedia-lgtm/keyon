#!/usr/bin/env bash
# KEYON host watchdog — CPU/RAM/disk/PM2/health + light security scan.
set -euo pipefail

SECURITY_FULL=0
for arg in "$@"; do
  [[ "$arg" == "--security-full" ]] && SECURITY_FULL=1
done

APP_ROOT="${APP_ROOT:-/opt/keyon}"
WEB_ROOT="${WEB_ROOT:-$APP_ROOT/web}"
OPS_DATA="${OPS_DATA:-$WEB_ROOT/data/ops}"
mkdir -p "$OPS_DATA"
TMPDIR_W="$(mktemp -d)"
trap 'rm -rf "$TMPDIR_W"' EXIT

load_env() {
  local f line
  for f in "$APP_ROOT/.env.ops" "$WEB_ROOT/.env.production" "$WEB_ROOT/.env"; do
    [[ -f "$f" ]] || continue
    while IFS= read -r line || [[ -n "$line" ]]; do
      line="${line%$'\r'}"
      [[ "$line" =~ ^(TELEGRAM_|HEALTHCHECKS_|WATCHDOG_) ]] || continue
      [[ "$line" == \#* ]] && continue
      export "$line" 2>/dev/null || true
    done < "$f"
  done
}
load_env

CPU_PCT_MAX="${WATCHDOG_CPU_PCT:-85}"
LOAD_MAX_RATIO="${WATCHDOG_LOAD_RATIO:-1.5}"
RAM_AVAIL_MIN_MB="${WATCHDOG_RAM_AVAIL_MB:-200}"
DISK_PCT_MAX="${WATCHDOG_DISK_PCT:-85}"
PM2_RESTART_WARN="${WATCHDOG_PM2_RESTARTS_WARN:-8}"
COOLDOWN_SEC="${WATCHDOG_COOLDOWN_SEC:-1800}"
HEALTH_URL="${WATCHDOG_HEALTH_URL:-http://127.0.0.1:3000/api/health}"

NOW_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
HOSTNAME_S="$(hostname -s 2>/dev/null || hostname)"
echo '[]' > "$TMPDIR_W/alerts.json"
echo '[]' > "$TMPDIR_W/findings.json"
echo ok > "$TMPDIR_W/status.txt"

append_alert() {
  local level="$1" code="$2" msg="$3"
  python3 - "$TMPDIR_W/alerts.json" "$TMPDIR_W/status.txt" "$level" "$code" "$msg" <<'PY'
import json,sys
path, stpath, level, code, msg = sys.argv[1:6]
arr=json.load(open(path,encoding="utf-8"))
arr.append({"level":level,"code":code,"message":msg})
json.dump(arr, open(path,"w",encoding="utf-8"))
cur=open(stpath,encoding="utf-8").read().strip()
if level=="error":
  open(stpath,"w").write("critical")
elif cur=="ok" and level=="warn":
  open(stpath,"w").write("warn")
PY
}

append_finding() {
  local sev="$1" kind="$2" detail="$3"
  python3 - "$TMPDIR_W/findings.json" "$sev" "$kind" "$detail" <<'PY'
import json,sys
path, sev, kind, detail = sys.argv[1:5]
arr=json.load(open(path,encoding="utf-8"))
arr.append({"severity":sev,"kind":kind,"detail":detail})
json.dump(arr, open(path,"w",encoding="utf-8"))
PY
}

NPROC="$(nproc 2>/dev/null || echo 1)"
LOAD1="$(awk '{print $1}' /proc/loadavg)"
LOAD_LIMIT="$(python3 -c "print(round(float('$NPROC')*float('$LOAD_MAX_RATIO'),2))")"

CPU_IDLE="$(vmstat 1 2 2>/dev/null | tail -1 | awk '{print $(NF-2)}' || echo 40)"
CPU_USED="$(python3 -c "print(max(0,min(100,100-int(float('$CPU_IDLE' or 40)))))")"

MEM_AVAIL_MB=$(( $(awk '/MemAvailable:/ {print $2}' /proc/meminfo) / 1024 ))
MEM_TOTAL_MB=$(( $(awk '/MemTotal:/ {print $2}' /proc/meminfo) / 1024 ))
DISK_PCT="$(df -P / | awk 'NR==2 {gsub(/%/,"",$5); print $5}')"
DISK_AVAIL="$(df -h / | awk 'NR==2 {print $4}')"

PM2_WEB_STATUS="unknown"; PM2_WEB_RESTARTS=0
PM2_WORKER_STATUS="unknown"; PM2_WORKER_RESTARTS=0
if command -v pm2 >/dev/null 2>&1; then
  pm2 jlist > "$TMPDIR_W/pm2.json" 2>/dev/null || echo '[]' > "$TMPDIR_W/pm2.json"
  eval "$(python3 - "$TMPDIR_W/pm2.json" <<'PY'
import json,sys
apps=json.load(open(sys.argv[1],encoding="utf-8"))
def pick(name):
  for a in apps:
    if a.get("name")==name:
      e=a.get("pm2_env") or {}
      return e.get("status","unknown"), int(e.get("restart_time") or 0)
  return "missing", 0
ws,wr=pick("keyon-web"); ks,kr=pick("keyon-worker")
print(f"PM2_WEB_STATUS={ws}")
print(f"PM2_WEB_RESTARTS={wr}")
print(f"PM2_WORKER_STATUS={ks}")
print(f"PM2_WORKER_RESTARTS={kr}")
PY
)"
fi

HEALTH_CODE="000"; HEALTH_STATUS="unreachable"; HEALTH_TTFB="0"
if HEALTH_OUT="$(curl -sS -m 15 -o "$TMPDIR_W/health.json" -w '%{http_code} %{time_starttransfer}' "$HEALTH_URL" 2>/dev/null)"; then
  HEALTH_CODE="$(echo "$HEALTH_OUT" | awk '{print $1}')"
  HEALTH_TTFB="$(echo "$HEALTH_OUT" | awk '{print $2}')"
  HEALTH_STATUS="$(python3 -c "import json;print(json.load(open('$TMPDIR_W/health.json')).get('status','?'))" 2>/dev/null || echo parse_error)"
fi

python3 -c "raise SystemExit(0 if float('$LOAD1')<=float('$LOAD_LIMIT') else 1)" || \
  append_alert warn high_load "Load $LOAD1 > limit $LOAD_LIMIT (${NPROC} CPU x ${LOAD_MAX_RATIO})"

python3 -c "raise SystemExit(0 if int('$CPU_USED')<=int('$CPU_PCT_MAX') else 1)" || \
  append_alert warn high_cpu "CPU ~${CPU_USED}% > ${CPU_PCT_MAX}%"

python3 -c "raise SystemExit(0 if int('$MEM_AVAIL_MB')>=int('$RAM_AVAIL_MIN_MB') else 1)" || \
  append_alert warn low_ram "RAM available ${MEM_AVAIL_MB}MB < ${RAM_AVAIL_MIN_MB}MB"

python3 -c "raise SystemExit(0 if int('$DISK_PCT')<=int('$DISK_PCT_MAX') else 1)" || \
  append_alert error disk_full "Disk / ${DISK_PCT}% used (max ${DISK_PCT_MAX}%)"

[[ "$PM2_WEB_STATUS" == "online" ]] || append_alert error pm2_web "keyon-web status=$PM2_WEB_STATUS"
[[ "$PM2_WORKER_STATUS" == "online" ]] || append_alert error pm2_worker "keyon-worker status=$PM2_WORKER_STATUS"

python3 -c "raise SystemExit(0 if int('$PM2_WEB_RESTARTS')<=int('$PM2_RESTART_WARN') else 1)" || \
  append_alert warn pm2_restarts "keyon-web restarts=$PM2_WEB_RESTARTS (> $PM2_RESTART_WARN)"

if [[ "$HEALTH_CODE" != "200" ]]; then
  append_alert error health_http "Health HTTP $HEALTH_CODE from $HEALTH_URL"
elif [[ "$HEALTH_STATUS" != "healthy" ]]; then
  append_alert warn health_degraded "Health status=$HEALTH_STATUS"
fi

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  append_finding high suspicious_process "$line"
  append_alert error malware_process "Suspicious process: $line"
done < <(ps -eo pid,cmd --no-headers 2>/dev/null | grep -E 'syslog-ng-[0-9a-f]{6,}|\.syslog-|kdevtmpfsi|xmrig|cryptonight|syslog-helper' | grep -v grep || true)

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  append_finding high hidden_path "$line"
  append_alert error malware_path "Hidden/suspicious path: $line"
done < <(find /usr/share/man /tmp /var/tmp /dev/shm -maxdepth 3 \( -name '.syslog*' -o -name '*xmrig*' -o -name 'kdevtmpfsi' \) 2>/dev/null | head -20)

while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  append_finding high deleted_exe "$line"
  append_alert warn deleted_binary "Running deleted binary: $line"
done < <(ls -l /proc/[0-9]*/exe 2>/dev/null | grep '(deleted)' | grep -vE 'next-server| /usr/bin/node|pm2|redis|postgres|nginx|docker|containerd|systemd|sshd' | head -15 || true)

if [[ "$SECURITY_FULL" == "1" ]]; then
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    append_finding medium world_writable "$line"
  done < <(find /opt/keyon /etc/cron.d -type f -perm -0002 2>/dev/null | head -20)

  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    append_finding high cron_suspect "$line"
    append_alert warn cron_suspect "Cron: $line"
  done < <(grep -RInE 'curl .*(base64|/dev/tcp|bash -s)|wget .*\|.*/\.syslog' /etc/cron* /var/spool/cron 2>/dev/null | head -20 || true)
fi

STATUS="$(cat "$TMPDIR_W/status.txt")"

python3 - "$OPS_DATA/host-status.json" "$TMPDIR_W/alerts.json" "$STATUS" <<PY
import json,sys
out, alerts_path, status = sys.argv[1:4]
alerts=json.load(open(alerts_path,encoding="utf-8"))
doc={
  "at":"$NOW_ISO",
  "host":"$HOSTNAME_S",
  "status":status,
  "metrics":{
    "nproc":int("$NPROC"),
    "load1":float("$LOAD1"),
    "load_limit":float("$LOAD_LIMIT"),
    "cpu_used_pct":int("$CPU_USED"),
    "mem_avail_mb":int("$MEM_AVAIL_MB"),
    "mem_total_mb":int("$MEM_TOTAL_MB"),
    "disk_used_pct":int("$DISK_PCT"),
    "disk_avail":"$DISK_AVAIL",
    "pm2_web_status":"$PM2_WEB_STATUS",
    "pm2_web_restarts":int("$PM2_WEB_RESTARTS"),
    "pm2_worker_status":"$PM2_WORKER_STATUS",
    "pm2_worker_restarts":int("$PM2_WORKER_RESTARTS"),
    "health_http":int("$HEALTH_CODE") if str("$HEALTH_CODE").isdigit() else 0,
    "health_status":"$HEALTH_STATUS",
    "health_ttfb_s":float("$HEALTH_TTFB" or 0),
  },
  "alerts":alerts,
}
json.dump(doc, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
open(out,"a",encoding="utf-8").write("\n")
print("wrote", out, "status=", status, "alerts=", len(alerts))
PY

python3 - "$OPS_DATA/security-scan.json" "$TMPDIR_W/findings.json" <<PY
import json,sys
out, findings_path = sys.argv[1:3]
findings=json.load(open(findings_path,encoding="utf-8"))
doc={"at":"$NOW_ISO","host":"$HOSTNAME_S","mode":("full" if "$SECURITY_FULL"=="1" else "lite"),"findings":findings,"ok":len(findings)==0}
json.dump(doc, open(out,"w",encoding="utf-8"), ensure_ascii=False, indent=2)
open(out,"a",encoding="utf-8").write("\n")
print("wrote", out, "findings=", len(findings))
PY

python3 - "$OPS_DATA/incidents.jsonl" "$TMPDIR_W/alerts.json" "$TMPDIR_W/findings.json" "$NOW_ISO" "$STATUS" <<'PY'
import json,sys
path, ap, fp, at, status = sys.argv[1:6]
alerts=json.load(open(ap,encoding="utf-8"))
findings=json.load(open(fp,encoding="utf-8"))
if not alerts and not findings:
  raise SystemExit(0)
with open(path,"a",encoding="utf-8") as f:
  f.write(json.dumps({"at":at,"status":status,"alerts":alerts,"findings":findings},ensure_ascii=False)+"\n")
lines=open(path,encoding="utf-8").read().splitlines()
if len(lines)>200:
  open(path,"w",encoding="utf-8").write("\n".join(lines[-200:])+"\n")
PY

# Telegram with cooldown
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
  MSG="$(python3 - "$OPS_DATA/alert-cooldown.json" "$TMPDIR_W/alerts.json" "$COOLDOWN_SEC" "$HOSTNAME_S" "$NOW_ISO" <<'PY'
import json,sys,time,os
path, ap, cool, host, now = sys.argv[1:6]
cool=int(cool)
alerts=json.load(open(ap,encoding="utf-8"))
try: state=json.load(open(path,encoding="utf-8"))
except Exception: state={}
now_ts=int(time.time()); to_send=[]
for a in alerts:
  code=a.get("code") or "x"
  if now_ts - int(state.get(code) or 0) < cool: continue
  state[code]=now_ts; to_send.append(a)
json.dump(state, open(path,"w",encoding="utf-8"), indent=2)
if not to_send: raise SystemExit(0)
lines=[f"KEYON watchdog · {host}", f"time {now}"]
for a in to_send:
  lines.append(f"[{str(a.get('level','?')).upper()}] {a.get('code')}: {a.get('message')}")
print("\n".join(lines))
PY
)" || MSG=""
  if [[ -n "${MSG:-}" ]]; then
    curl -sS -m 15 -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d "chat_id=${TELEGRAM_CHAT_ID}" \
      --data-urlencode "text=${MSG}" \
      -d "disable_web_page_preview=true" >/dev/null 2>&1 || true
  fi
fi

if [[ -n "${HEALTHCHECKS_PING_URL:-}" ]]; then
  if [[ "$STATUS" == "ok" ]]; then
    curl -sS -m 10 "$HEALTHCHECKS_PING_URL" >/dev/null 2>&1 || true
  else
    curl -sS -m 10 "${HEALTHCHECKS_PING_URL%/}/fail" >/dev/null 2>&1 || \
      curl -sS -m 10 "${HEALTHCHECKS_PING_URL}?status=${STATUS}" >/dev/null 2>&1 || true
  fi
fi

echo "WATCHDOG_OK status=$STATUS"
