/**
 * Absolute document title — prevents Next.js root `title.template`
 * (`%s · KEYON`) from doubling a brand already in the string.
 */
export function absoluteTitle(title: string): { absolute: string } {
  return { absolute: title.trim() };
}
