import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy CMS / mockup link — no /support page; FAQ is the help center
      { source: "/support", destination: "/faq", permanent: true },
      { source: "/support/:path*", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
