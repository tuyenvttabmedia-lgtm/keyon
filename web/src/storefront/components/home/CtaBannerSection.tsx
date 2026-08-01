import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import {
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

type Cta = HomeContent["ctaBanner"];

export function CtaBannerSection({ data }: { data: Cta }) {
  if (!data.visible) return null;

  return (
    <section className="pb-7 pt-2 md:pb-6 md:pt-2 lg:pb-10 lg:pt-3">
      <div className="home-container">
        <div className="flex flex-col items-stretch gap-4 rounded-2xl bg-footer px-5 py-6 text-white sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <h3 className={`${SECTION_TITLE_CLASS} !text-white`}>{data.title}</h3>
            <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS} !text-slate-300`}>{data.subtitle}</p>
          </div>
          <Link
            href={data.ctaHref}
            className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white transition hover:bg-accent-hover md:w-auto`}
          >
            {data.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
