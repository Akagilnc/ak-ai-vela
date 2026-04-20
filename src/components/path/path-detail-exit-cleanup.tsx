"use client";

import { useEffect } from "react";

/**
 * Clears the overview's departure flag on detail-page unmount IF the user
 * is leaving to anywhere outside the `/path` subtree. Without this, a
 * user who clicks a tile on `/path`, reads a card, and then navigates
 * from the detail view to an unrelated route (e.g. `/schools`) would
 * leave `vela:path-overview:departed-at` in sessionStorage for up to its
 * 1-hour TTL. Any later unrelated visit to `/path` within that window
 * would then trigger a bogus scroll restore.
 *
 * We key off `window.location.pathname` at cleanup time — Next.js App
 * Router has already updated the URL by the moment React unmounts the
 * outgoing route (history.pushState is synchronous; popstate is handled
 * synchronously by the router). If the user is still within `/path` or
 * any `/path/[slug]`, we keep the flag so the eventual overview mount
 * can consume it; otherwise we remove it.
 *
 * This component is mounted only inside detail pages. The overview's
 * own mount-time handler (`PathOverviewScrollRestore`) consumes the
 * flag on the happy path. This cleanup exists purely to invalidate the
 * flag on the "user gave up on returning to overview" branch.
 */
const DEPARTED_KEY = "vela:path-overview:departed-at";

export function PathDetailExitCleanup() {
  useEffect(() => {
    return () => {
      try {
        if (!window.location.pathname.startsWith("/path")) {
          sessionStorage.removeItem(DEPARTED_KEY);
        }
      } catch {
        // Storage unavailable (Safari private mode, iOS Lockdown,
        // restricted WebView) — nothing to clean up.
      }
    };
  }, []);
  return null;
}
