import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Index only — per-slug redirect is handled in /blog/[slug] (needs section resolve)
      { source: "/blog", destination: "/resources/news", permanent: true },
      // IA merge: Solutions hub → Business; generic licensing landing → Shop
      { source: "/solutions", destination: "/business", permanent: true },
      {
        source: "/solutions/software-licensing",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
