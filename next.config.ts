import type { NextConfig } from "next";

// Resolve the allowed dev-origin list from the environment so rotating a
// Cloudflare quick-tunnel URL only requires editing `.env.local`, not
// committing a source change. Accepts a comma-separated list for the rare
// case where a developer runs multiple tunnels in parallel.
//
// Dev-only: `allowedDevOrigins` has no effect on production builds.
// Empty env → empty list → Next falls back to its normal same-origin check.
const devTunnelOrigins = (process.env.DEV_TUNNEL_ORIGIN ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: devTunnelOrigins,
};

export default nextConfig;
