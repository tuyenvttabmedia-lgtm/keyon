/** Collapse blank lines in FAQ answers (admin textarea → storefront). */
export function normalizeFaqAnswerText(raw: string): string {
  return String(raw ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // Remove empty lines between blocks — keep a single newline for list structure.
    .replace(/\n{2,}/g, "\n")
    .trim();
}
