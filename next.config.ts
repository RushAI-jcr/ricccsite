import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy per Next.js production checklist
// https://nextjs.org/docs/app/guides/content-security-policy#without-nonces
const cspHeader = `
  default-src 'self';
  script-src 'self' https://unpkg.com https://va.vercel-scripts.com ${isDev ? "'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://va.vercel-analytics.com https://vitals.vercel-insights.com https://eutils.ncbi.nlm.nih.gov https://api.semanticscholar.org https://api.openalex.org;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
