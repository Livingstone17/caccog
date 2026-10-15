import type { NextConfig } from "next";

/**
 * Security headers (§7). Deliberately NOT shipping a full Content-Security-
 * Policy yet: a strict CSP needs a nonce pipeline via the new `proxy.ts`
 * convention plus allowlisting the YouTube and Google Maps embeds. A broken
 * CSP would silently break those, so it's listed in CONTENT_TODO as a
 * follow-up rather than faked here.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      'payment=(self "https://checkout.paystack.com")',
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    qualities: [50, 75, 90, 100],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
