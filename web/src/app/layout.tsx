import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildRootMetadata } from "@/server/seo/metadata";

/** HOME.spec.md — Font family: Inter (home-v5) */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

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
      <body
        className={`${inter.variable} ${inter.className} flex min-h-screen flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
