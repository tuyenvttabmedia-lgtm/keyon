import type { Metadata } from "next";
import Link from "next/link";
import { buildMainPageMetadata } from "@/server/seo/metadata";
import { isQuotePublicTrackingEnabled } from "@/server/quote/tracking";
import { QuoteTrackView } from "@/storefront/components/quote/QuoteTrackView";
import {
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  LINK_ACCENT_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tra cứu yêu cầu báo giá | KEYON",
    description:
      "Tra cứu trạng thái yêu cầu báo giá KEYON bằng mã QT- và xác minh OTP qua email.",
    robots: { index: false, follow: false },
  };
}

type Props = {
  searchParams: Promise<{ ref?: string }>;
};

export default async function QuoteStatusPage({ searchParams }: Props) {
  const sp = await searchParams;
  const enabled = await isQuotePublicTrackingEnabled();
  const initialRef = sp.ref?.trim().toUpperCase() || undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm">
        <Link href="/" className={BREADCRUMB_CLASS}>
          Trang chủ
        </Link>
        <span className={BREADCRUMB_CLASS}>/</span>
        <Link href="/contact/quote" className={LINK_ACCENT_CLASS}>
          Yêu cầu báo giá
        </Link>
        <span className={BREADCRUMB_CLASS}>/</span>
        <span className={BREADCRUMB_CURRENT_CLASS}>Tra cứu</span>
      </nav>
      <QuoteTrackView enabled={enabled} initialRef={initialRef} />
    </div>
  );
}
