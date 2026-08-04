import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Legacy /blog → canonical Resources news index (NAV-03 Phase 2). */
export default function BlogIndexRedirect() {
  permanentRedirect("/resources/news");
}
