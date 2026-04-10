import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare quick-tunnel host to reach Next.js dev resources (HMR, etc.).
  // Dev-only — has no effect on production builds.
  // NOTE: quick-tunnel URLs are ephemeral; update this list whenever the tunnel
  // hostname changes (e.g. after restarting cloudflared).
  allowedDevOrigins: ["premises-legitimate-anchor-seek.trycloudflare.com"],
};

export default nextConfig;
