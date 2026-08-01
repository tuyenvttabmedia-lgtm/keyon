/** Shared helpers for Product CMS JSON fields (admin + PDP). */

export type ProductSpecRow = { label: string; value: string };
export type ProductFaqRow = { id: string; question: string; answer: string };

export function parseStringList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0).map((s) => s.trim());
}

export function parseSpecRows(raw: unknown): ProductSpecRow[] {
  if (!Array.isArray(raw)) return [];
  const out: ProductSpecRow[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const label = String((row as { label?: unknown }).label ?? "").trim();
    const value = String((row as { value?: unknown }).value ?? "").trim();
    if (label && value) out.push({ label, value });
  }
  return out;
}

export function parseFaqRows(raw: unknown): ProductFaqRow[] {
  if (!Array.isArray(raw)) return [];
  const out: ProductFaqRow[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const question = String((row as { question?: unknown }).question ?? "").trim();
    const answer = String((row as { answer?: unknown }).answer ?? "").trim();
    if (!question || !answer) continue;
    const id = String((row as { id?: unknown }).id ?? `faq-${out.length + 1}`).trim() || `faq-${out.length + 1}`;
    out.push({ id, question, answer });
  }
  return out;
}

/** Admin textarea: one URL / feature per line */
export function linesToList(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function listToLines(list: string[]): string {
  return list.join("\n");
}

/** Admin textarea: Label|Value per line */
export function linesToSpecs(text: string): ProductSpecRow[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|");
      if (i < 0) return { label: line, value: "—" };
      return { label: line.slice(0, i).trim(), value: line.slice(i + 1).trim() || "—" };
    })
    .filter((r) => r.label);
}

export function specsToLines(rows: ProductSpecRow[]): string {
  return rows.map((r) => `${r.label}|${r.value}`).join("\n");
}

/** Admin textarea: Q||A per line (double pipe) */
export function linesToFaqs(text: string): ProductFaqRow[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const i = line.indexOf("||");
      if (i < 0) return { id: `faq-${idx + 1}`, question: line, answer: "" };
      return {
        id: `faq-${idx + 1}`,
        question: line.slice(0, i).trim(),
        answer: line.slice(i + 2).trim(),
      };
    })
    .filter((r) => r.question && r.answer);
}

export function faqsToLines(rows: ProductFaqRow[]): string {
  return rows.map((r) => `${r.question}||${r.answer}`).join("\n");
}

export const PRODUCT_CATEGORY_KEYS = [
  "windows",
  "office",
  "adobe",
  "cloud",
  "security",
  "other",
] as const;

export type ProductCategoryKey = (typeof PRODUCT_CATEGORY_KEYS)[number];
