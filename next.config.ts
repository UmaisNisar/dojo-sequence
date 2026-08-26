import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * The app ships no third-party scripts and has no HTML sinks, so the point of
 * this policy is not script injection — it is egress. `connect-src` and
 * `media-src` mean that even if something did execute, the only host it could
 * reach is the wiki the frame data already comes from.
 *
 * `'unsafe-inline'` for scripts is unavoidable without nonces, and nonces
 * require middleware on every request, which would make a fully static site
 * dynamic. That trade is not worth it here: the policy's real value is the
 * egress lockdown, `object-src 'none'` and `base-uri 'self'`, none of which
 * `'unsafe-inline'` weakens. Styles need it because Motion writes inline
 * style attributes.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:", // data: is the per-character favicon
  "font-src 'self'", // next/font self-hosts
  "media-src 'self' https://wavu.wiki", // move demo clips
  "worker-src 'self'", // the offline service worker
  "manifest-src 'self'",
  // wavu.wiki: Cargo frame-data check. web3forms: user bug reports.
  "connect-src 'self' https://wavu.wiki https://api.web3forms.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the bare origin to wavu.wiki rather than the curriculum path,
  // so what someone is training is not leaked in a third-party access log.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Belt to CSP's frame-ancestors braces, for older browsers.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework version to anyone scanning for known CVEs.
  poweredByHeader: false,
  headers() {
    return Promise.resolve([
      { source: "/:path*", headers: securityHeaders },
      {
        /* The worker decides what every other request does, so it is the one
           file that must never be answered from a stale cache — otherwise a
           deploy cannot replace the thing that would have fetched it. */
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ]);
  },
};

export default nextConfig;
