import { redirect } from "next/navigation";

/** Legacy/nav alias — home section id="how-it-works". */
export default function HowItWorksRedirectPage() {
  redirect("/#how-it-works");
}
