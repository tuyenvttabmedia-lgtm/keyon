import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Legacy sales quote URL → canonical /contact/quote */
export default async function ContactSalesRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string" && value) q.set(key, value);
    else if (Array.isArray(value) && value[0]) q.set(key, value[0]);
  }
  const qs = q.toString();
  redirect(qs ? `/contact/quote?${qs}` : "/contact/quote");
}
