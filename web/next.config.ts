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
  // script-src keeps unsafe-inline until nonce rollout; Turnstile host allowlisted.
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
      "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
      "frame-src 'self' https://challenges.cloudflare.com",
      // No blanket https: — browser XHR is same-origin; Turnstile + media hosts only.
      "connect-src 'self' https://challenges.cloudflare.com https://*.wasabisys.com https://s3.ap-southeast-1.wasabisys.com https://qr.sepay.vn https://my.sepay.vn",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
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
    ];
  },
};

export default nextConfig;
