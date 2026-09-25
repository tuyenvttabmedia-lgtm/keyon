import type { Metadata } from "next";
import { noindexMetadata } from "@/server/seo/noindex";

export const metadata: Metadata = noindexMetadata("Demo");

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
