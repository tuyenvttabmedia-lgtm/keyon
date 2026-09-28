/** Shared links, rhythm, and interest options for Licensing Consulting. */

export const FORM_ID = "consultation-form";
export const AREAS_ID = "consulting-areas";

export const FORM_HREF = `#${FORM_ID}` as const;
export const AREAS_HREF = `#${AREAS_ID}` as const;

/** Same vertical rhythm as Home (`.home-section`). */
export const SECTION_PAD = "home-section" as const;

export const SURFACE =
  "rounded-2xl border border-border bg-white" as const;
export const SURFACE_MUTED =
  "rounded-2xl border border-border bg-[#F7FAFC]" as const;

export const INTEREST_OPTIONS = [
  { id: "MICROSOFT_365", label: "Microsoft 365" },
  { id: "OFFICE", label: "Microsoft Office" },
  { id: "WINDOWS", label: "Windows" },
  { id: "SECURITY", label: "Security" },
  { id: "CLOUD", label: "Cloud & Hạ tầng" },
  { id: "BACKUP", label: "Backup & Khôi phục" },
  { id: "NOT_SURE", label: "Chưa xác định" },
] as const;

export type InterestId = (typeof INTEREST_OPTIONS)[number]["id"];

export function interestLabel(id: InterestId): string {
  return INTEREST_OPTIONS.find((o) => o.id === id)?.label ?? id;
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
