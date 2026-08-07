/** Support Center shared links and helpers — no fake contact / counts. */

export const SECTION_PAD = "py-10 md:py-12 lg:py-14" as const;
export const SURFACE =
  "rounded-2xl border border-border bg-white" as const;
export const SURFACE_MUTED =
  "rounded-2xl border border-border bg-[#F7FAFC]" as const;

export const TICKETS_HREF = "/account/tickets";
export const FAQ_HREF = "/faq";
export const GUIDES_HREF = "/resources/guides";
export const CONTACT_HREF = "/contact";

export type SupportSearchDoc = {
  id: string;
  kind: "faq" | "guide";
  title: string;
  excerpt?: string;
  href: string;
};

export type SupportChannel = {
  type: "email" | "hotline" | "hours";
  label: string;
  value: string;
  href?: string;
  hint?: string;
};

const PLACEHOLDER_HOTLINES = new Set([
  "19001234",
  "1900 1234".replace(/\s/g, ""),
  "1800636246",
  "1800 636 246".replace(/\s/g, ""),
]);

export function isPlaceholderHotline(raw: string): boolean {
  const digits = raw.replace(/\D/g, "");
  return PLACEHOLDER_HOTLINES.has(raw.replace(/\s/g, "")) || digits === "19001234" || digits === "1800636246";
}

export type ContactChannelSource = {
  emailLabel?: string;
  emailValue?: string;
  emailHint?: string;
  hotlineLabel?: string;
  hotlineValue?: string;
  hotlineHint?: string;
  hoursLabel?: string;
  hoursValue?: string;
  hoursHint?: string;
};

/** Only emit channels that look configured — skip known placeholder hotlines / empty values. */
export function resolveSupportChannels(cms: ContactChannelSource): SupportChannel[] {
  const out: SupportChannel[] = [];
  const email = cms.emailValue?.trim();
  if (email && email.includes("@")) {
    out.push({
      type: "email",
      label: cms.emailLabel?.trim() || "Email",
      value: email,
      href: `mailto:${email}`,
      hint: cms.emailHint?.trim() || undefined,
    });
  }
  const hotline = cms.hotlineValue?.trim();
  if (hotline && !isPlaceholderHotline(hotline)) {
    out.push({
      type: "hotline",
      label: cms.hotlineLabel?.trim() || "Hotline",
      value: hotline,
      href: `tel:${hotline.replace(/\s/g, "")}`,
      hint: cms.hotlineHint?.trim() || undefined,
    });
  }
  const hours = cms.hoursValue?.trim();
  if (hours) {
    out.push({
      type: "hours",
      label: cms.hoursLabel?.trim() || "Giờ làm việc",
      value: hours,
      hint: cms.hoursHint?.trim() || undefined,
    });
  }
  return out;
}

export type SuggestChip = { label: string; query: string };

const SUGGEST_CANDIDATES: SuggestChip[] = [
  { label: "Kích hoạt Windows", query: "windows" },
  { label: "Cài đặt Office", query: "office" },
  { label: "Gia hạn subscription", query: "gia hạn" },
  { label: "Thanh toán & hóa đơn", query: "thanh toán" },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Only chips that match at least one real FAQ/guide doc. */
export function buildSuggestedSearches(docs: SupportSearchDoc[]): SuggestChip[] {
  return SUGGEST_CANDIDATES.filter((chip) => {
    const q = normalize(chip.query);
    return docs.some(
      (d) =>
        normalize(d.title).includes(q) ||
        (d.excerpt ? normalize(d.excerpt).includes(q) : false),
    );
  });
}

export function searchSupportDocs(
  docs: SupportSearchDoc[],
  rawQuery: string,
  limit = 6,
): SupportSearchDoc[] {
  const q = normalize(rawQuery.trim());
  if (q.length < 2) return [];
  return docs
    .filter(
      (d) =>
        normalize(d.title).includes(q) ||
        (d.excerpt ? normalize(d.excerpt).includes(q) : false),
    )
    .slice(0, limit);
}
