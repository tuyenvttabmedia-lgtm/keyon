import { permanentRedirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** Legacy /blog → canonical Knowledge news index (NAV-03). */
export default function BlogIndexRedirect() {
  permanentRedirect("/kien-thuc/tin-tuc");
}
