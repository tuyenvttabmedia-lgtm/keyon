#!/usr/bin/env bash
# Optional offsite copy of a dump dir → Wasabi. No-op if WASABI_* empty.
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/keyon}"
ENV_FILE="${APP_ROOT}/.env.production"
BACKUP_ROOT="${BACKUP_ROOT:-/var/backups/keyon}"

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

WASABI_ACCESS_KEY="$(grep -E '^WASABI_ACCESS_KEY=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"
WASABI_SECRET_KEY="$(grep -E '^WASABI_SECRET_KEY=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"
WASABI_BUCKET="$(grep -E '^WASABI_BUCKET=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"
WASABI_ENDPOINT="$(grep -E '^WASABI_ENDPOINT=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"
WASABI_REGION="$(grep -E '^WASABI_REGION=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"
WASABI_BACKUP_PREFIX="$(grep -E '^WASABI_BACKUP_PREFIX=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '\r')"

if [[ -z "$WASABI_ACCESS_KEY" || -z "$WASABI_SECRET_KEY" || -z "$WASABI_BUCKET" ]]; then
  echo "offsite: Wasabi not configured — skip"
  exit 0
fi

export WASABI_ACCESS_KEY WASABI_SECRET_KEY WASABI_BUCKET
export WASABI_ENDPOINT="${WASABI_ENDPOINT:-https://s3.ap-southeast-1.wasabisys.com}"
export WASABI_REGION="${WASABI_REGION:-ap-southeast-1}"
export WASABI_BACKUP_PREFIX="${WASABI_BACKUP_PREFIX:-keyon-backups}"
export LATEST STAMP

cd "$APP_ROOT/web"
node --input-type=module <<'NODE'
import { readFileSync } from "fs";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.WASABI_REGION || "ap-southeast-1",
  endpoint: process.env.WASABI_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
  forcePathStyle: true,
});

const stamp = process.env.STAMP;
const prefix = process.env.WASABI_BACKUP_PREFIX || "keyon-backups";
const bucket = process.env.WASABI_BUCKET;
const dir = process.env.LATEST;

for (const name of ["database.dump", "database.dump.sha256", "backup-manifest.json"]) {
  const body = readFileSync(`${dir}/${name}`);
  const Key = `${prefix}/${stamp}/${name}`;
  await client.send(new PutObjectCommand({ Bucket: bucket, Key, Body: body }));
  console.log("uploaded", Key, body.length);
}
console.log("OFFSITE_BACKUP_OK", stamp);
NODE
