import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import { buildRootMetadata } from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { AnalyticsScripts } from "@/storefront/components/seo/AnalyticsScripts";

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await loadSiteSettings();

  return (
    <html lang="vi">
      <head>
        <AnalyticsScripts
          ga4MeasurementId={settings.ga4MeasurementId}
          gtmContainerId={settings.gtmContainerId}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
