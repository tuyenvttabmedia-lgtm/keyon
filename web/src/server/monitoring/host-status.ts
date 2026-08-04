import { promises as fs } from "fs";
import path from "path";

const OPS_DIR = path.join(process.cwd(), "data", "ops");

export type HostAlert = {
  level: "info" | "warn" | "error";
  code: string;
  message: string;
};

export type HostStatusFile = {
  at: string;
  host: string;
  status: "ok" | "warn" | "critical" | string;
  metrics: {
    nproc: number;
    load1: number;
    load_limit: number;
    cpu_used_pct: number;
    mem_avail_mb: number;
    mem_total_mb: number;
    disk_used_pct: number;
    disk_avail: string;
    pm2_web_status: string;
    pm2_web_restarts: number;
    pm2_worker_status: string;
    pm2_worker_restarts: number;
    health_http: number;
    health_status: string;
    health_ttfb_s: number;
  };
  alerts: HostAlert[];
};

export type SecurityScanFile = {
  at: string;
  host: string;
  mode: "lite" | "full" | string;
  ok: boolean;
  findings: { severity: string; kind: string; detail: string }[];
};

export type IncidentRow = {
  at: string;
  status: string;
  alerts: HostAlert[];
  findings: { severity: string; kind: string; detail: string }[];
};

async function readJsonSafe<T>(file: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function readHostStatus(): Promise<HostStatusFile | null> {
  return readJsonSafe<HostStatusFile>(path.join(OPS_DIR, "host-status.json"));
}

export async function readSecurityScan(): Promise<SecurityScanFile | null> {
  return readJsonSafe<SecurityScanFile>(path.join(OPS_DIR, "security-scan.json"));
}

export async function readRecentIncidents(take = 15): Promise<IncidentRow[]> {
  try {
    const raw = await fs.readFile(path.join(OPS_DIR, "incidents.jsonl"), "utf8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const rows: IncidentRow[] = [];
    for (const line of lines.slice(-take)) {
      try {
        rows.push(JSON.parse(line) as IncidentRow);
      } catch {
        /* skip */
      }
    }
    return rows.reverse();
  } catch {
    return [];
  }
}

/** Age of host-status snapshot; stale if older than maxAgeMs (default 15m). */
export function hostStatusFresh(
  host: HostStatusFile | null,
  maxAgeMs = 15 * 60_000,
): boolean {
  if (!host?.at) return false;
  const t = Date.parse(host.at);
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= maxAgeMs;
}
