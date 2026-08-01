export type StockPreviewStatus = "ok" | "duplicate_file" | "duplicate_db" | "invalid";

export type StockPreviewLine = {
  line: number;
  raw: string;
  status: StockPreviewStatus;
  reason?: string;
};

export type StockPreviewCounts = {
  ok: number;
  duplicate_file: number;
  duplicate_db: number;
  invalid: number;
  total: number;
};

/** Client + server shared parse (format / in-file dup). DB dup applied separately. */
export function parseStockKeysText(text: string): StockPreviewLine[] {
  const lines = text.split(/\r?\n/);
  const seen = new Map<string, number>();
  const out: StockPreviewLine[] = [];

  lines.forEach((raw, idx) => {
    const line = idx + 1;
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (trimmed.length < 4) {
      out.push({
        line,
        raw: trimmed,
        status: "invalid",
        reason: "Quá ngắn (< 4)",
      });
      return;
    }
    if (/\s{2,}/.test(trimmed) || trimmed.includes(",,")) {
      out.push({
        line,
        raw: trimmed,
        status: "invalid",
        reason: "Định dạng lạ",
      });
      return;
    }

    const key = trimmed.toLowerCase();
    const first = seen.get(key);
    if (first != null) {
      out.push({
        line,
        raw: trimmed,
        status: "duplicate_file",
        reason: `Trùng dòng ${first}`,
      });
      return;
    }
    seen.set(key, line);
    out.push({ line, raw: trimmed, status: "ok" });
  });

  return out;
}

export function applyDbDuplicates(
  lines: StockPreviewLine[],
  existingNormalized: Set<string>,
): StockPreviewLine[] {
  return lines.map((l) => {
    if (l.status !== "ok") return l;
    if (existingNormalized.has(l.raw.toLowerCase())) {
      return {
        ...l,
        status: "duplicate_db" as const,
        reason: "Đã có trong kho SKU này",
      };
    }
    return l;
  });
}

export function countPreview(lines: StockPreviewLine[]): StockPreviewCounts {
  const counts: StockPreviewCounts = {
    ok: 0,
    duplicate_file: 0,
    duplicate_db: 0,
    invalid: 0,
    total: lines.length,
  };
  for (const l of lines) {
    if (l.status === "ok") counts.ok += 1;
    else if (l.status === "duplicate_file") counts.duplicate_file += 1;
    else if (l.status === "duplicate_db") counts.duplicate_db += 1;
    else counts.invalid += 1;
  }
  return counts;
}

export function csvToKeysText(csv: string): string {
  const rows = csv.split(/\r?\n/).filter((l) => l.trim());
  if (rows.length === 0) return "";
  const firstCell = rows[0]!.split(/[,;\t]/)[0]?.trim().toLowerCase() ?? "";
  const start =
    firstCell === "key" ||
    firstCell === "license" ||
    firstCell === "code" ||
    firstCell === "serial"
      ? 1
      : 0;
  return rows
    .slice(start)
    .map((row) => row.split(/[,;\t]/)[0]?.trim() ?? "")
    .filter(Boolean)
    .join("\n");
}
