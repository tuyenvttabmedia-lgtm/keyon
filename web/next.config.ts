import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Index only — per-slug redirect is handled in /blog/[slug] (needs section resolve)
      { source: "/blog", destination: "/resources/news", permanent: true },
      {
        source: "/solutions/software-licensing",
        destination: "/solutions/by-need",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
