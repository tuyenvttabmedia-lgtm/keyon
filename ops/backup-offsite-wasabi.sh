#!/usr/bin/env bash
# Optional offsite copy of a dump dir → Wasabi.
# Prefers Admin storage.json (AES secrets) over ENV — no SSH secret paste needed.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
ENV_FILE="${APP_ROOT}/.env.production"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/keyon}"
WEB_DIR="${APP_ROOT}/web"

LATEST="${LATEST:-}"
if [[ -z "$LATEST" ]]; then
  LATEST="$(find "$BACKUP_ROOT" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort | tail -1 || true)"
fi
if [[ -z "$LATEST" || ! -f "$LATEST/database.dump" ]]; then
  echo "offsite: no local dump — skip"
  exit 0
fi

STAMP="${STAMP:-$(basename "$LATEST")}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "offsite: no env — skip"
  exit 0
fi

export LATEST STAMP APP_ROOT WEB_DIR ENV_FILE
export WASABI_BACKUP_PREFIX="${WASABI_BACKUP_PREFIX:-keyon-backups}"

cd "$WEB_DIR"
node --input-type=module <<'NODE'
import { readFileSync, existsSync } from "fs";
import { createDecipheriv, scryptSync } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { join } from "path";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    if (i <= 0) continue;
    const k = line.slice(0, i);
    let v = line.slice(i + 1);
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

function decryptPayload(payloadEnc, rawKey) {
  const key = scryptSync(rawKey, "keyon-delivery", 32);
  const buf = Buffer.from(payloadEnc, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

function loadAdminWasabi() {
  const candidates = [
    join(process.env.WEB_DIR || "", "data/cms/storage.json"),
    join(process.env.APP_ROOT || "", "web/data/cms/storage.json"),
  ];
  const encKey = process.env.DELIVERY_ENCRYPTION_KEY || "";
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const d = JSON.parse(readFileSync(p, "utf8"));
    if (d.driver !== "wasabi" || !d.wasabi) continue;
    const w = d.wasabi;
    let secret = "";
    if (w.secretAccessKeyEnc && encKey.length >= 32) {
      try {
        secret = decryptPayload(w.secretAccessKeyEnc, encKey);
      } catch (e) {
        console.error("offsite: decrypt admin wasabi failed", e.message);
      }
    }
    if (w.accessKeyId && secret && w.bucket) {
      return {
        accessKeyId: w.accessKeyId,
        secretAccessKey: secret,
        bucket: w.bucket,
        endpoint: w.endpoint || "https://s3.ap-southeast-1.wasabisys.com",
        region: w.region || "ap-southeast-1",
        source: "admin",
      };
    }
  }
  return null;
}

function loadEnvWasabi() {
  const accessKeyId = (process.env.WASABI_ACCESS_KEY || "").trim();
  const secretAccessKey = (process.env.WASABI_SECRET_KEY || "").trim();
  const bucket = (process.env.WASABI_BUCKET || "").trim();
  if (!accessKeyId || !secretAccessKey || !bucket) return null;
  return {
    accessKeyId,
    secretAccessKey,
    bucket,
    endpoint: (process.env.WASABI_ENDPOINT || "https://s3.ap-southeast-1.wasabisys.com").trim(),
    region: (process.env.WASABI_REGION || "ap-southeast-1").trim(),
    source: "env",
  };
}

loadEnvFile(process.env.ENV_FILE);

const cfg = loadAdminWasabi() || loadEnvWasabi();
if (!cfg) {
  console.log("offsite: Wasabi not configured (Admin storage or ENV) — skip");
  process.exit(0);
}

const client = new S3Client({
  region: cfg.region,
  endpoint: cfg.endpoint,
  credentials: {
    accessKeyId: cfg.accessKeyId,
    secretAccessKey: cfg.secretAccessKey,
  },
  forcePathStyle: true,
});

const stamp = process.env.STAMP;
const prefix = process.env.WASABI_BACKUP_PREFIX || "keyon-backups";
const dir = process.env.LATEST;

for (const name of ["database.dump", "database.dump.sha256", "backup-manifest.json"]) {
  const body = readFileSync(`${dir}/${name}`);
  const Key = `${prefix}/${stamp}/${name}`;
  await client.send(new PutObjectCommand({ Bucket: cfg.bucket, Key, Body: body }));
  console.log("uploaded", Key, body.length);
}
console.log("OFFSITE_BACKUP_OK", stamp, "source=" + cfg.source);
NODE
