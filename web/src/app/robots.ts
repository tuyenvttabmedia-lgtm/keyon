import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  allowSearchIndexing,
  getSiteHostname,
} from "@/server/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  const host = getSiteHostname();

  if (!allowSearchIndexing()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
      host,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api/",
        "/account",
        "/account/",
        "/checkout",
        "/checkout/",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host,
  };
}
