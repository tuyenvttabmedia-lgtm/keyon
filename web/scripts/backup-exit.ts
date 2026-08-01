/**
 * Backup Exit B1–B5
 * npm run test:backup
 */
import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";
import { createBackupBundle } from "./backup/create-backup";
import {
  dropRestoreDb,
  restoreAndVerify,
} from "./backup/restore-verify";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`B${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`B${id} ❌ FAIL  ${detail}`);
}

const SECRET_ENV_KEYS = [
  "SESSION_SECRET",
  "DELIVERY_ENCRYPTION_KEY",
  "SEPAY_API_KEY",
  "SEPAY_WEBHOOK_SECRET",
  "SMTP_PASS",
  "WASABI_SECRET_KEY",
  "WASABI_ACCESS_KEY",
  "POSTGRES_PASSWORD",
] as const;

const PLACEHOLDER_HINTS = [
  "CHANGE_ME",
  "REPLACE_WITH",
  "dev-change-me",
  "your-domain",
];

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
}

function assertNoSecretsInBundle(bundleDir: string): { ok: boolean; detail: string } {
  const files = walkFiles(bundleDir);
  const basenames = files.map((f) => f.replace(/\\/g, "/").split("/").pop()!);

  const forbiddenNames = basenames.filter((n) =>
    /^\.env($|\.(local|production)$)/.test(n),
  );
  if (forbiddenNames.length) {
    return { ok: false, detail: `forbidden env files: ${forbiddenNames.join(",")}` };
  }

  // Binary dump skipped for string scan; scan text artifacts only
  const textFiles = files.filter((f) => {
    const n = f.replace(/\\/g, "/");
    return (
      n.endsWith(".json") ||
      n.endsWith(".example") ||
      n.endsWith(".sha256") ||
      n.endsWith("BACKUP_OK")
    );
  });

  const leaked: string[] = [];
  for (const key of SECRET_ENV_KEYS) {
    const val = process.env[key]?.trim();
    if (!val || val.length < 8) continue;
    if (PLACEHOLDER_HINTS.some((h) => val.includes(h))) continue;
    for (const f of textFiles) {
      const body = readFileSync(f, "utf8");
      if (body.includes(val)) {
        leaked.push(`${key} in ${f}`);
      }
    }
  }

  // Manifest must not embed password-bearing URLs
  const manifestPath = join(bundleDir, "config", "backup-manifest.json");
  if (existsSync(manifestPath)) {
    const m = readFileSync(manifestPath, "utf8");
    if (/postgresql:\/\/[^:]+:[^@]+@/.test(m) || /DATABASE_URL/.test(m)) {
      leaked.push("manifest has DATABASE_URL / password URL");
    }
  }

  if (leaked.length) {
    return { ok: false, detail: leaked.join("; ") };
  }
  return { ok: true, detail: "no .env files; no known secret values in text artifacts" };
}

function docsMatchReality(): { ok: boolean; detail: string } {
  const repo = join(process.cwd(), "..");
  const ops = readFileSync(join(repo, "docs", "OPERATIONS.md"), "utf8");
  const runbook = readFileSync(join(repo, "docs", "RUNBOOK.md"), "utf8");
  const backupDoc = readFileSync(join(repo, "docs", "BACKUP.md"), "utf8");

  const needOps = [
    "backup:create",
    "backup:restore-verify",
    "test:backup",
    "Empty Database",
    "env.production.example",
  ];
  const needRun = ["backup:create", "keyon_restore_test", "B1", "checksum"];
  const needBackup = ["B1", "B2", "B3", "B4", "B5", "Wasabi", "không backup"];

  const missOps = needOps.filter((s) => !ops.includes(s));
  const missRun = needRun.filter((s) => !runbook.includes(s));
  const missBackup = needBackup.filter((s) => !backupDoc.includes(s));

  if (missOps.length || missRun.length || missBackup.length) {
    return {
      ok: false,
      detail: `ops:${missOps.join(",")} run:${missRun.join(",")} backup:${missBackup.join(",")}`,
    };
  }
  return { ok: true, detail: "OPERATIONS + RUNBOOK + BACKUP.md khớp scripts B1–B5" };
}

async function main() {
  console.log("\n=== KEYON Backup Exit B1–B5 ===\n");

  let bundleDir = "";

  try {
    // B1
    const bundle = createBackupBundle();
    bundleDir = bundle.dir;
    const hasDump = existsSync(bundle.dumpPath);
    const hasConfig = existsSync(join(bundleDir, "config", "env.production.example"));
    const hasStorage = existsSync(join(bundleDir, "storage", "wasabi-verify.json"));
    const hasManifest = existsSync(join(bundleDir, "config", "backup-manifest.json"));
    if (hasDump && hasConfig && hasStorage && hasManifest) {
      pass(
        "1",
        `Backup bundle OK: ${bundle.stamp} (db+storage verify+config)`,
      );
    } else {
      fail(
        "1",
        `dump=${hasDump} config=${hasConfig} storage=${hasStorage} manifest=${hasManifest}`,
      );
    }

    // B2 + B3
    if (hasDump) {
      try {
        const vr = restoreAndVerify(bundleDir);
        pass("2", `Restore → empty DB ${vr.restoreDb} OK`);
        if (vr.ok) {
          pass(
            "3",
            `Counts + checksum PASS · ${JSON.stringify(vr.restored)}`,
          );
        } else {
          fail(
            "3",
            `${vr.detail} source=${JSON.stringify(vr.source)} restored=${JSON.stringify(vr.restored)}`,
          );
        }
      } catch (e) {
        fail("2", e instanceof Error ? e.message : String(e));
        fail("3", "skipped — restore failed");
      }
    } else {
      fail("2", "skipped — no dump");
      fail("3", "skipped — no dump");
    }

    // B4
    if (bundleDir) {
      const s = assertNoSecretsInBundle(bundleDir);
      if (s.ok) pass("4", s.detail);
      else fail("4", s.detail);
    } else {
      fail("4", "no bundle");
    }

    // B5
    const d = docsMatchReality();
    if (d.ok) pass("5", d.detail);
    else fail("5", d.detail);
  } finally {
    dropRestoreDb();
  }

  console.log("\n--- Summary ---");
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "✅" : "❌"} B${r.id}: ${r.detail}`);
  }
  if (failed.length) {
    console.log(`\n❌ ${failed.length} failed\n`);
    process.exit(1);
  }
  console.log("\n✅ ALL B1–B5 PASS\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
