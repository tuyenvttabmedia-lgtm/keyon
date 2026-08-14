import { permanentRedirect } from "next/navigation";

/** Hub `/solutions` = Doanh nghiệp. Topic landings stay at `/solutions/{slug}`. */
export default function SolutionsHubRedirectPage() {
  permanentRedirect("/business");
}
