import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { buildRootMetadata } from "@/server/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
