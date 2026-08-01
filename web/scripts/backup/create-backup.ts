/**
 * Create KEYON backup bundle (3 parts): database + storage verify + config template.
 * Does NOT include .env or real secrets.
 *
 * Usage: npm run backup:create
 */
import { createHash } from "crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { execFileSync } from "child_process";

const WEB_ROOT = process.cwd();
const REPO_ROOT = join(WEB_ROOT, "..");
const BACKUPS_ROOT = join(REPO_ROOT, "backups");

const PG_CONTAINER = process.env.KEYON_PG_CONTAINER ?? "keyon-dev-postgres";
const PG_USER = process.env.KEYON_PG_USER ?? "keyon";
const PG_DB = process.env.KEYON_PG_DB ?? "keyon";

export type BackupBundle = {
  dir: string;
  stamp: string;
  dumpPath: string;
  checksumSha256: string;
  manifestPath: string;
};

function docker(...args: string[]) {
  return execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function stampNow() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function sha256File(path: string): string {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

function resolveEnvTemplate(): string {
  const candidates = [
    join(WEB_ROOT, ".env.production.example"),
    join(REPO_ROOT, ".env.production.example"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error("Missing .env.production.example (web/ or repo root)");
}

function verifyWasabiConfig(): Record<string, unknown> {
  const driver = process.env.STORAGE_DRIVER ?? "local";
  const endpoint = process.env.WASABI_ENDPOINT ?? "";
  const region = process.env.WASABI_REGION ?? "";
  const bucket = process.env.WASABI_BUCKET ?? "";
  const hasAccessKey = Boolean(process.env.WASABI_ACCESS_KEY);
  const hasSecretKey = Boolean(process.env.WASABI_SECRET_KEY);

  return {
    verified_at: new Date().toISOString(),
    note: "Config presence only — objects are NOT copied into backup",
    storage_driver: driver,
    wasabi: {
      endpoint_configured: Boolean(endpoint),
      region_configured: Boolean(region),
      bucket_name: bucket || null,
      access_key_present: hasAccessKey,
      secret_key_present: hasSecretKey,
      // Never embed secret values
    },
    objects_backed_up: false,
  };
}

export function createBackupBundle(opts?: { stamp?: string }): BackupBundle {
  const stamp = opts?.stamp ?? stampNow();
  const dir = join(BACKUPS_ROOT, `keyon-${stamp}`);
  mkdirSync(join(dir, "config"), { recursive: true });
  mkdirSync(join(dir, "storage"), { recursive: true });

  const remoteDump = `/tmp/keyon-backup-${stamp}.dump`;
  docker(
    "exec",
    PG_CONTAINER,
    "pg_dump",
    "-U",
    PG_USER,
    "-d",
    PG_DB,
    "-Fc",
    "-f",
    remoteDump,
  );

  const dumpPath = join(dir, "database.dump");
  docker("cp", `${PG_CONTAINER}:${remoteDump}`, dumpPath);
  try {
    docker("exec", PG_CONTAINER, "rm", "-f", remoteDump);
  } catch {
    /* ignore cleanup */
  }

  if (!existsSync(dumpPath) || readFileSync(dumpPath).length < 64) {
    throw new Error(`Dump missing or too small: ${dumpPath}`);
  }

  const checksumSha256 = sha256File(dumpPath);
  writeFileSync(join(dir, "checksums.sha256"), `${checksumSha256}  database.dump\n`);

  const templateSrc = resolveEnvTemplate();
  copyFileSync(templateSrc, join(dir, "config", "env.production.example"));

  const wasabi = verifyWasabiConfig();
  writeFileSync(
    join(dir, "storage", "wasabi-verify.json"),
    JSON.stringify(wasabi, null, 2) + "\n",
  );

  const manifest = {
    created_at: new Date().toISOString(),
    stamp,
    app: "keyon",
    parts: {
      database: "database.dump",
      storage: "storage/wasabi-verify.json",
      config: "config/env.production.example",
    },
    postgres: {
      container: PG_CONTAINER,
      database: PG_DB,
      user: PG_USER,
      // No connection string / password
    },
    checksum_sha256: checksumSha256,
    forbidden_not_included: [
      ".env",
      ".env.local",
      ".env.production",
      "API secrets",
      "SePay secrets",
      "SMTP password",
      "Wasabi secret",
    ],
  };
  const manifestPath = join(dir, "config", "backup-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  // Marker that this is a full bundle (helps B1)
  writeFileSync(join(dir, "BACKUP_OK"), `keyon backup ${stamp}\n`);

  return { dir, stamp, dumpPath, checksumSha256, manifestPath };
}

function main() {
  const bundle = createBackupBundle();
  console.log(JSON.stringify({ ok: true, ...bundle }, null, 2));
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("create-backup.ts") ||
    process.argv[1].includes("create-backup"));

if (isDirect) {
  main();
}
