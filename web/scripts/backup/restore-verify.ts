/**
 * Restore backup dump onto a NEW empty database and verify counts + checksum.
 * Never restores onto the live source DB.
 *
 * Usage: npm run backup:restore-verify -- --dir ../backups/keyon-...
 */
import { createHash } from "crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { execFileSync } from "child_process";

const PG_CONTAINER = process.env.KEYON_PG_CONTAINER ?? "keyon-dev-postgres";
const PG_USER = process.env.KEYON_PG_USER ?? "keyon";
const SOURCE_DB = process.env.KEYON_PG_DB ?? "keyon";
const RESTORE_DB = process.env.KEYON_RESTORE_DB ?? "keyon_restore_test";

export type RecordCounts = {
  User: number;
  Product: number;
  Variant: number;
  License: number;
  Order: number;
  Payment: number;
};

export type RestoreVerifyResult = {
  ok: boolean;
  restoreDb: string;
  checksumOk: boolean;
  expectedSha256: string;
  actualSha256: string;
  source: RecordCounts;
  restored: RecordCounts;
  migrationsOk: boolean;
  detail: string;
};

function docker(...args: string[]) {
  return execFileSync("docker", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function psql(db: string, sql: string): string {
  return docker(
    "exec",
    "-e",
    "PGPASSWORD=keyon",
    PG_CONTAINER,
    "psql",
    "-U",
    PG_USER,
    "-d",
    db,
    "-v",
    "ON_ERROR_STOP=1",
    "-t",
    "-A",
    "-c",
    sql,
  ).trim();
}

function countRecords(db: string): RecordCounts {
  const q = `
SELECT json_build_object(
  'User', (SELECT COUNT(*)::int FROM "User"),
  'Product', (SELECT COUNT(*)::int FROM "Product"),
  'Variant', (SELECT COUNT(*)::int FROM "ProductVariant"),
  'License', (SELECT COUNT(*)::int FROM "LicenseItem"),
  'Order', (SELECT COUNT(*)::int FROM "Order"),
  'Payment', (SELECT COUNT(*)::int FROM "Payment")
);
`.trim();
  return JSON.parse(psql(db, q)) as RecordCounts;
}

function countsEqual(a: RecordCounts, b: RecordCounts): boolean {
  return (
    a.User === b.User &&
    a.Product === b.Product &&
    a.Variant === b.Variant &&
    a.License === b.License &&
    a.Order === b.Order &&
    a.Payment === b.Payment
  );
}

function dropAndCreateRestoreDb() {
  // Terminate connections then recreate empty DB
  psql(
    "postgres",
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${RESTORE_DB}' AND pid <> pg_backend_pid();`,
  );
  psql("postgres", `DROP DATABASE IF EXISTS ${RESTORE_DB};`);
  psql("postgres", `CREATE DATABASE ${RESTORE_DB} OWNER ${PG_USER};`);
}

function checkMigrations(db: string): boolean {
  try {
    const n = Number(
      psql(db, `SELECT COUNT(*)::int FROM "_prisma_migrations";`),
    );
    return Number.isFinite(n) && n > 0;
  } catch {
    return false;
  }
}

export function restoreAndVerify(bundleDir: string): RestoreVerifyResult {
  const dumpPath = join(bundleDir, "database.dump");
  const checksumPath = join(bundleDir, "checksums.sha256");
  if (!existsSync(dumpPath)) {
    throw new Error(`Missing dump: ${dumpPath}`);
  }

  const actualSha256 = sha256File(dumpPath);
  let expectedSha256 = actualSha256;
  if (existsSync(checksumPath)) {
    const line = readFileSync(checksumPath, "utf8").trim().split(/\s+/)[0];
    if (line) expectedSha256 = line;
  }
  const checksumOk = expectedSha256 === actualSha256;

  const source = countRecords(SOURCE_DB);

  dropAndCreateRestoreDb();

  const remoteDump = `/tmp/keyon-restore-${Date.now()}.dump`;
  docker("cp", dumpPath, `${PG_CONTAINER}:${remoteDump}`);
  docker(
    "exec",
    PG_CONTAINER,
    "pg_restore",
    "-U",
    PG_USER,
    "-d",
    RESTORE_DB,
    "--no-owner",
    "--no-acl",
    remoteDump,
  );
  try {
    docker("exec", PG_CONTAINER, "rm", "-f", remoteDump);
  } catch {
    /* ignore */
  }

  const restored = countRecords(RESTORE_DB);
  const migrationsOk = checkMigrations(RESTORE_DB);
  const countsOk = countsEqual(source, restored);
  const ok = checksumOk && countsOk && migrationsOk;

  return {
    ok,
    restoreDb: RESTORE_DB,
    checksumOk,
    expectedSha256,
    actualSha256,
    source,
    restored,
    migrationsOk,
    detail: ok
      ? "checksum + counts + migrations PASS"
      : `checksumOk=${checksumOk} countsOk=${countsOk} migrationsOk=${migrationsOk}`,
  };
}

export function dropRestoreDb() {
  try {
    psql(
      "postgres",
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${RESTORE_DB}' AND pid <> pg_backend_pid();`,
    );
    psql("postgres", `DROP DATABASE IF EXISTS ${RESTORE_DB};`);
  } catch {
    /* ignore */
  }
}

function parseDirArg(): string {
  const i = process.argv.indexOf("--dir");
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  throw new Error("Usage: backup:restore-verify -- --dir ../backups/keyon-...");
}

function main() {
  const dir = parseDirArg();
  const result = restoreAndVerify(dir);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

const isDirect =
  process.argv[1] &&
  (process.argv[1].endsWith("restore-verify.ts") ||
    process.argv[1].includes("restore-verify"));

if (isDirect) {
  main();
}
