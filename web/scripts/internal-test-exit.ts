/**
 * Internal Test Exit IT1–IT8 — Pilot Ready gate
 * npm run test:internal
 *
 * Gom domain exit suites đã có + IT7 E2E. Không thay thế test domain.
 */
import { spawnSync } from "child_process";
import { runInternalE2E } from "./internal-e2e";

type R = { id: string; ok: boolean; detail: string };
const results: R[] = [];

function pass(id: string, detail: string) {
  results.push({ id, ok: true, detail });
  console.log(`IT${id} ✅ PASS  ${detail}`);
}
function fail(id: string, detail: string) {
  results.push({ id, ok: false, detail });
  console.log(`IT${id} ❌ FAIL  ${detail}`);
}

const SUITES: { id: string; script: string; label: string }[] = [
  { id: "1", script: "test:license-pool", label: "License Pool E1–E9" },
  { id: "2", script: "test:inventory", label: "Inventory I1–I6" },
  { id: "3", script: "test:sepay", label: "Payment P1–P10" },
  { id: "4", script: "test:monitoring", label: "Monitoring M1–M7" },
  { id: "5", script: "test:dashboard", label: "Dashboard D1–D6" },
  { id: "6", script: "test:backup", label: "Backup B1–B5" },
];

function runNpmScript(script: string): { ok: boolean; detail: string } {
  const r = spawnSync("npm", ["run", script], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: true,
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  const out = `${r.stdout ?? ""}\n${r.stderr ?? ""}`;
  const ok = r.status === 0;
  const tail = out
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-3)
    .join(" | ");
  return {
    ok,
    detail: ok
      ? `exit 0 · ${tail.slice(0, 200)}`
      : `exit ${r.status} · ${tail.slice(0, 400)}`,
  };
}

async function main() {
  console.log("\n=== KEYON Internal Test IT1–IT8 (Pilot Ready) ===\n");
  console.log("Pipeline: Pool → Inventory → Payment → Monitoring → Dashboard → Backup → E2E\n");

  for (const s of SUITES) {
    console.log(`\n----- IT${s.id}: ${s.label} (${s.script}) -----\n`);
    const r = runNpmScript(s.script);
    if (r.ok) pass(s.id, `${s.label} PASS`);
    else fail(s.id, `${s.label} FAIL — ${r.detail}`);
  }

  console.log("\n----- IT7: E2E Order → Payment → Fulfillment → Delivery → Resend/Replace -----\n");
  const e2e = await runInternalE2E();
  if (e2e.ok) pass("7", e2e.detail);
  else fail("7", e2e.detail);

  const failed = results.filter((r) => !r.ok);
  if (failed.length === 0 && results.length === 7) {
    pass("8", "Toàn bộ pipeline PASS — không có FAIL → Pilot Ready");
  } else {
    fail(
      "8",
      `pipeline incomplete or has FAIL — passed=${results.filter((r) => r.ok).length}/7 domain+e2e failed=${failed.map((f) => `IT${f.id}`).join(",") || "none"}`,
    );
  }

  console.log("\n--- Summary ---");
  for (const r of results) {
    console.log(`${r.ok ? "✅" : "❌"} IT${r.id}: ${r.detail}`);
  }
  const allFailed = results.filter((r) => !r.ok);
  if (allFailed.length) {
    console.log(`\n❌ Internal Test NOT Pilot Ready — ${allFailed.length} FAIL\n`);
    process.exit(1);
  }
  console.log("\n✅ ALL IT1–IT8 PASS — Pilot Ready\n");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
