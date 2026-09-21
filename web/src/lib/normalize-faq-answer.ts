/**
 * FAQ answers: keep intentional line breaks, drop empty blank lines only.
 * `\n\n` (dòng trống) → `\n` (vẫn xuống dòng, không cách 1 hàng trống).
 */
export function normalizeFaqAnswerText(raw: string): string {
  return String(raw ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}
