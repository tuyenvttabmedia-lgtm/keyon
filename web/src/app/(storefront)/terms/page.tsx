import { redirect } from "next/navigation";

/** Alias — nội dung nằm tại /policy/terms */
export default function TermsPage() {
  redirect("/policy/terms");
}
