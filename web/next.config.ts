import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Baseline CSP — style-src still needs unsafe-inline (Tailwind/Next).
  // script-src keeps unsafe-inline until nonce rollout; Turnstile + GA4/GTM allowlisted.
  // GA4 hosts per https://developers.google.com/tag-platform/security/guides/csp
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com",
      "frame-src 'self' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google.com https://maps.google.com https://www.openstreetmap.org",
      // No blanket https: — Turnstile + media + GA4/GTM collection endpoints only.
      "connect-src 'self' https://challenges.cloudflare.com https://*.wasabisys.com https://s3.ap-southeast-1.wasabisys.com https://qr.sepay.vn https://my.sepay.vn https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Image optimizer re-enabled after VPS DNS fix (media.keyon.vn → Cloudflare).
  // See docs/OPERATIONS.md § Media CDN DNS.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "media.keyon.vn", pathname: "/**" },
      { protocol: "https", hostname: "**.wasabisys.com", pathname: "/**" },
      { protocol: "https", hostname: "s3.ap-southeast-1.wasabisys.com", pathname: "/**" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/solutions/software-licensing",
        destination: "/solutions/by-need",
        permanent: true,
      },
      // Canonical host: apex only (www → keyon.vn)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.keyon.vn" }],
        destination: "https://keyon.vn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
