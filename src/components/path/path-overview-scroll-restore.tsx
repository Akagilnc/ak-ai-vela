"use client";

import { useEffect, useRef } from "react";

/**
 * Restore the overview page's scroll position when returning from a detail
 * card. `#path-main` is its own scroll container (its parent
 * `.overview-view` uses `overflow: hidden` + flex layout), so the browser's
 * built-in window-level scroll restoration does not apply.
 *
 * Restore fires only when the user is actually coming back from a card:
 *   (a) browser back/forward — `performance.navigation.type === "back_forward"`
 *   (b) BFCache restore — `pageshow` with `persisted === true`
 *   (c) in-app back from a detail page — the detail page sets a beacon
 *       (`vela:path-detail:visited-at`) on mount; we consume it here. This
 *       catches Next.js `<Link>`-based navigation (client-side push), which
 *       does NOT trigger a `back_forward` navigation type.
 *
 * We intentionally do NOT restore on fresh arrivals to `/path` (homepage
 * link, direct URL, navigation from `/schools`, reload). A stale scrollTop
 * from an earlier in-tab visit would teleport the user to the middle of
 * the page — the regression our pre-ship adversarial review flagged.
 *
 * All `sessionStorage` access is try/catch guarded because Safari private
 * mode, iOS Lockdown Mode, and several in-app webviews (WeChat, Weibo)
 * throw on any storage access. A single throw would otherwise dead-lock
 * the throttled save path. When storage is unavailable the feature silently
 * no-ops for that session.
 */
const SCROLL_KEY = "vela:path-overview:scroll";
const BEACON_KEY = "vela:path-detail:visited-at";
const BEACON_TTL_MS = 60 * 60 * 1000; // 1 hour — belt-and-braces against a stale beacon that somehow survived.

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Storage unavailable or quota exceeded — nothing we can do.
  }
}

function safeRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // No-op.
  }
}

function cameFromDetail(): boolean {
  const raw = safeGet(BEACON_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts <= BEACON_TTL_MS;
}

function isBackForwardNav(): boolean {
  try {
    const entries = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    return entries[0]?.type === "back_forward";
  } catch {
    return false;
  }
}

export function PathOverviewScrollRestore() {
  // Guards the one-shot mount decision against React Strict Mode's dev
  // effect double-fire. Without this, run 1 consumes the beacon and
  // restores, run 2 sees a now-empty beacon and takes the "fresh arrival"
  // branch, incorrectly clearing SCROLL_KEY.
  const handledMountRef = useRef(false);

  useEffect(() => {
    const main = document.getElementById("path-main");
    if (!main) return;

    const doRestore = () => {
      const raw = safeGet(SCROLL_KEY);
      if (!raw) return;
      const top = parseInt(raw, 10);
      if (!Number.isFinite(top) || top <= 0) return;

      // `scrollTo({ behavior: "instant" })` is spec-correct but Safari
      // <15.4 silently drops the unknown enum and falls back to the
      // element's CSS `scroll-behavior: smooth`, producing exactly the
      // animated jump we are trying to avoid. Hard-override the computed
      // value, set scrollTop synchronously (so a subsequent unmount
      // cleanup can't cancel a pending timer), then restore the original
      // behavior on the next frame.
      const prevBehavior = main.style.scrollBehavior;
      main.style.scrollBehavior = "auto";
      main.scrollTop = top;
      requestAnimationFrame(() => {
        main.style.scrollBehavior = prevBehavior;
      });
    };

    // Mount-time decision — run exactly once per component instance, even
    // under Strict Mode's dev double-fire.
    if (!handledMountRef.current) {
      handledMountRef.current = true;
      if (isBackForwardNav() || cameFromDetail()) {
        doRestore();
      } else {
        // Fresh arrival from an unrelated entry — clear the stale
        // scrollTop so a later in-tab tile click doesn't restore to a
        // position that pre-dates the user's current /path visit.
        safeRemove(SCROLL_KEY);
      }
      safeRemove(BEACON_KEY);
    }

    // BFCache restore — the browser swaps the DOM back in without
    // remounting our effect. The stored scrollTop may not survive every
    // engine's cache layer, so re-apply it explicitly.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) doRestore();
    };
    window.addEventListener("pageshow", onPageShow);

    // Save scroll, throttled at 100ms. `setTimeout` (not rAF) because
    // headless browsers and background tabs throttle rAF to near-zero,
    // which would drop saves entirely.
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleSave = () => {
      if (saveTimer !== null) return;
      saveTimer = setTimeout(() => {
        safeSet(SCROLL_KEY, String(main.scrollTop));
        saveTimer = null;
      }, 100);
    };
    main.addEventListener("scroll", scheduleSave, { passive: true });

    // Flush any pending save before the page hides, so a user who flicks
    // the list and immediately taps a tile captures their final position
    // instead of a 100ms-old one.
    const flushSave = () => {
      if (saveTimer !== null) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      safeSet(SCROLL_KEY, String(main.scrollTop));
    };
    const onPageHide = () => flushSave();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushSave();
    };
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      main.removeEventListener("scroll", scheduleSave);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (saveTimer !== null) clearTimeout(saveTimer);
    };
  }, []);

  return null;
}
