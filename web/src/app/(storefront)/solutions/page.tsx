import { permanentRedirect } from "next/navigation";

/** Legacy hub — permanently moved under /business (IA merge). */
export default function SolutionsHubRedirectPage() {
  permanentRedirect("/business");
}
