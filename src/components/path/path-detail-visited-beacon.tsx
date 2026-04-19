"use client";

import { useEffect } from "react";

/**
 * Writes a timestamped sessionStorage flag on mount so the overview page's
 * scroll-restore can tell "user is coming back from a detail card" apart
 * from "user arrived at /path fresh from somewhere else". Without this,
 * in-app back navigation (Next.js `<Link href="/path">` push) is
 * indistinguishable from a homepage-to-/path jump, because both show
 * `performance.navigation.type === "navigate"`.
 *
 * The overview's `PathOverviewScrollRestore` consumes (and clears) this
 * beacon on mount.
 */
const BEACON_KEY = "vela:path-detail:visited-at";

export function PathDetailVisitedBeacon() {
  useEffect(() => {
    try {
      sessionStorage.setItem(BEACON_KEY, String(Date.now()));
    } catch {
      // Storage unavailable (Safari private mode, iOS Lockdown,
      // restricted WebView). Scroll restore will simply not fire for
      // this user's session.
    }
  }, []);
  return null;
}
