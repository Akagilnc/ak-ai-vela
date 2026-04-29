import type { NextConfig } from "next";

// Permanent dev tunnel host: `vela.akbot.top` (named cloudflared tunnel
// `vela-mba`, UUID 625064f1-7c70-42ff-8336-f307d2e0349e). The named tunnel
// preserves the URL across cloudflared restarts so seed users can bookmark.
//
// `DEV_TUNNEL_ORIGIN` env var still supported for ad-hoc quick-tunnel runs
// (additional hosts comma-separated). Empty env → only the permanent host.
//
// Dev-only: `allowedDevOrigins` has no effect on production builds.
const PERMANENT_DEV_TUNNEL = "vela.akbot.top";

const envOrigins = (process.env.DEV_TUNNEL_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedDevOrigins = Array.from(
  new Set([PERMANENT_DEV_TUNNEL, ...envOrigins]),
);

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
