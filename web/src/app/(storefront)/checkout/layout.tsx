import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/server/seo/noindex";

export const metadata: Metadata = {
  title: "Thanh toán",
  robots: NOINDEX_ROBOTS,
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
