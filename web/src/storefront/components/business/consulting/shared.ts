/** Shared links and interest options for Licensing Consulting landing. */

export const FORM_ID = "consultation-form";
export const AREAS_ID = "consulting-areas";

export const FORM_HREF = `#${FORM_ID}` as const;
export const AREAS_HREF = `#${AREAS_ID}` as const;

export const SECTION_PAD = "py-14 md:py-16 lg:py-20" as const;

export const INTEREST_OPTIONS = [
  { id: "MICROSOFT_365", label: "Microsoft 365" },
  { id: "OFFICE", label: "Office" },
  { id: "WINDOWS", label: "Windows" },
  { id: "SECURITY", label: "Security" },
  { id: "OTHER", label: "Khác" },
  { id: "NOT_SURE", label: "Chưa chắc" },
] as const;

export type InterestId = (typeof INTEREST_OPTIONS)[number]["id"];

export function interestLabel(id: InterestId): string {
  return INTEREST_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

export function consultFormHref(interest?: InterestId) {
  if (!interest) return FORM_HREF;
  return `${FORM_HREF}?interestedIn=${interest}`;
}

/** Scroll to form; optional interest prefill via custom event. */
export function goToConsultation(interest?: InterestId) {
  if (typeof window === "undefined") return;
  if (interest) {
    window.dispatchEvent(
      new CustomEvent("keyon:consult-interest", { detail: { interest } }),
    );
  }
  const el = document.getElementById(FORM_ID);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}
