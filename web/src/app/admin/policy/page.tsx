import { redirect } from "next/navigation";

/** Orphan ops-policy hardcode → CMS Policy hub. */
export default function AdminPolicyRedirectPage() {
  redirect("/admin/cms/policy");
}
