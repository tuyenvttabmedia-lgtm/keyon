"use client";

import dynamic from "next/dynamic";
import type { HomeContent } from "@/storefront/content/types";

const TrustPartnersSection = dynamic(
  () =>
    import("./TrustPartnersSection").then((m) => m.TrustPartnersSection),
  { ssr: false, loading: () => null },
);

/** Client boundary so `ssr: false` is legal — keeps partners off the LCP HTML. */
export function TrustPartnersLazy({
  data,
  className,
}: {
  data: HomeContent["partners"];
  className?: string;
}) {
  return <TrustPartnersSection data={data} className={className} />;
}
