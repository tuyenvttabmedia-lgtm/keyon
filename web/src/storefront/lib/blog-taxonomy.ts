import type {
  CmsBlogTaxonomy,
  CmsBlogTaxonomySection,
  CmsBlogTaxonomyTopic,
} from "@/server/cms/types";
import { defaultCmsBlogTaxonomy } from "@/server/cms/types";
import type { ResourceSectionId } from "@/storefront/lib/resources";

const SECTION_IDS = new Set(["insights", "guides", "news"]);

function slugifyTopicId(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48);
}

/** Merge CMS JSON with defaults — always keep 3 chuyên mục ids. */
export function mergeBlogTaxonomy(
  raw: Partial<CmsBlogTaxonomy> | null | undefined,
): CmsBlogTaxonomy {
  const base = defaultCmsBlogTaxonomy;
  const hubTitle =
    typeof raw?.hubTitle === "string" && raw.hubTitle.trim()
      ? raw.hubTitle.trim()
      : base.hubTitle;
  const hubLead =
    typeof raw?.hubLead === "string" && raw.hubLead.trim()
      ? raw.hubLead.trim()
      : base.hubLead;

  const byId = new Map(
    (Array.isArray(raw?.sections) ? raw.sections : []).map((s) => [s.id, s]),
  );
  const sections: CmsBlogTaxonomySection[] = base.sections.map((def) => {
    const o = byId.get(def.id);
    if (!o) return def;
    return {
      id: def.id,
      label: o.label?.trim() || def.label,
      title: o.title?.trim() || def.title,
      subtitle: o.subtitle?.trim() || def.subtitle,
      visible: o.visible !== false,
    };
  });

  const rawTopics = Array.isArray(raw?.topics) ? raw.topics : base.topics;
  const seen = new Set<string>();
  const topics: CmsBlogTaxonomyTopic[] = [];
  for (const t of rawTopics) {
    const id = slugifyTopicId(String(t?.id ?? ""));
    if (!id || seen.has(id) || SECTION_IDS.has(id) || id === "chu-de") continue;
    seen.add(id);
    const defaultSection = SECTION_IDS.has(String(t?.defaultSection))
      ? (t.defaultSection as ResourceSectionId)
      : "insights";
    topics.push({
      id,
      label: String(t?.label ?? id).trim() || id,
      defaultSection,
      visible: t?.visible !== false,
      sortOrder: Number.isFinite(t?.sortOrder) ? Number(t.sortOrder) : topics.length,
    });
  }
  if (topics.length === 0) {
    topics.push(...base.topics);
  }

  return { hubTitle, hubLead, sections, topics };
}

export function topicLabelMap(taxonomy: CmsBlogTaxonomy): Record<string, string> {
  const map: Record<string, string> = {};
  for (const t of taxonomy.topics) map[t.id] = t.label;
  return map;
}

export { slugifyTopicId };
