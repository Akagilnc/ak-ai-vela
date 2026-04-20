"use client";

import { useEffect, useRef } from "react";

/**
 * Restore the overview page's scroll position when returning from a detail
 * card. `#path-main` is its own scroll container (its parent
 * `.overview-view` uses `overflow: hidden` + flex layout), so the browser's
 * built-in window-level scroll restoration does not apply.
 *
 * Restore fires only when the user is actually coming back from a card
 * they opened FROM this overview:
 *   (a) in-app back (or browser back in an SPA) from a detail page the
 *       user reached BY TAPPING A TILE — the tile click writes a
 *       timestamped `departed-at` flag here; we consume it on the next
 *       /path mount. This covers both Next.js `<Link>`-based client-side
 *       push AND browser history back within the SPA (which also
 *       preserves sessionStorage and keeps the flag live).
 *   (b) BFCache restore — `pageshow` with `persisted === true`.
 *
 * Why the flag is written on tile click (not on detail mount):
 * A detail-mount beacon would fire even when the user opens a detail via
 * a shared URL or deep link without ever having been on the overview. If
 * they then tap "5 月" back, the beacon would cause a bogus restore to a
 * stale SCROLL_KEY from some earlier /path visit. Writing the flag only
 * when a tile on THIS overview instance is clicked narrows the signal to
 * "the user departed from this overview toward a card, and scrollTop at
 * that moment is what we want to come back to".
 *
 * We intentionally do NOT restore on fresh arrivals to `/path` (homepage
 * link, direct URL, navigation from `/schools`, reload). A stale scrollTop
 * from an earlier in-tab visit would teleport the user to the middle of
 * the page.
 *
 * All `sessionStorage` access is try/catch guarded because Safari private
 * mode, iOS Lockdown Mode, and several in-app webviews (WeChat, Weibo)
 * throw on any storage API access. A single throw would otherwise
 * dead-lock the throttled save path. When storage is unavailable the
 * feature silently no-ops for that session.
 */
const SCROLL_KEY = "vela:path-overview:scroll";
const DEPARTED_KEY = "vela:path-overview:departed-at";
// 5 minutes — narrow enough that a user who wandered off /path (hard nav
// away from the detail page, left the tab idle, opened a new window, etc.)
// won't get a bogus restore when they come back. The typical "open a card,
// read for a minute or two, hit back" flow stays well inside this window.
// Gemini R2 on PR #28 flagged the old 1-hour TTL as the core of a teleport
// UX bug — the detail-page-unmount cleanup (`PathDetailExitCleanup`)
// handles SPA Link navigation to non-/path routes; this TTL is the
// belt-and-braces defense for hard-nav exits that React cannot observe.
const DEPARTED_TTL_MS = 5 * 60 * 1000;

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

function departedFromOverview(): boolean {
  const raw = safeGet(DEPARTED_KEY);
  if (!raw) return false;
  const ts = parseInt(raw, 10);
  if (!Number.isFinite(ts)) return false;
  return Date.now() - ts <= DEPARTED_TTL_MS;
}

export function PathOverviewScrollRestore() {
  // Guards the one-shot mount decision against React Strict Mode's dev
  // effect double-fire. Without this, run 1 consumes the departed flag
  // and restores, run 2 sees a now-empty flag and takes the "fresh
  // arrival" branch, incorrectly clearing SCROLL_KEY.
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
        // Re-assert once, in case lazy-loaded above-the-fold images
        // expanded layout between our sync write and this frame —
        // without this, the browser clamps scrollTop to the smaller
        // `scrollHeight - clientHeight` at mount time.
        if (main.scrollTop !== top && top <= main.scrollHeight - main.clientHeight) {
          main.scrollTop = top;
        }
        main.style.scrollBehavior = prevBehavior;
      });
    };

    // Mount-time decision — run exactly once per component instance, even
    // under Strict Mode's dev double-fire.
    if (!handledMountRef.current) {
      handledMountRef.current = true;
      // We previously also consulted `performance.navigation.type ===
      // "back_forward"` here, but Gemini R3 on PR #28 pointed out (and
      // verified) that the Navigation Timing API only reflects the
      // INITIAL document-load nav type and stays stale for the entire
      // document lifetime. In an SPA, every /path re-mount would read
      // the same value, so a user whose initial /path load happened via
      // cross-document back-forward would get a bogus restore on every
      // unrelated future /path re-mount. Beacon alone (set on tile
      // click) is the reliable signal; the `pageshow` listener below
      // separately handles the BFCache case.
      if (departedFromOverview()) {
        doRestore();
      } else {
        // Fresh arrival from an unrelated entry — clear the stale
        // scrollTop so a later in-tab tile click doesn't restore to a
        // position that pre-dates the user's current /path visit.
        safeRemove(SCROLL_KEY);
      }
      safeRemove(DEPARTED_KEY);
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

    // Tile click → user is departing this overview instance to open a
    // card. Capture phase so we run before Next.js's `<Link>` onClick
    // starts client-side navigation. Two things happen here:
    //   1. Set the departed flag, which triggers restore on the eventual
    //      back navigation.
    //   2. SYNCHRONOUSLY flush the current scrollTop — cannot be deferred
    //      to the effect cleanup, because by cleanup time Next.js has
    //      already swapped the /path DOM out and `main.scrollTop` reads
    //      as 0 on the detached element. This is the concrete failure the
    //      round-2 adversarial review flagged.
    //
    // We only respond to unmodified primary-button clicks. Cmd/Ctrl/Shift
    // -click opens a new tab or window while leaving the current tab on
    // /path — writing the departed flag in that case would leak a
    // one-hour-valid restore trigger that fires on any later /path
    // remount. Enter-key activation on a focused `.tile` fires a
    // synthetic click with `button: 0` and no modifier keys, which is
    // correctly allowed through.
    const onTileClick = (e: Event) => {
      const me = e as MouseEvent;
      if (me.defaultPrevented) return;
      if (me.button !== 0) return;
      if (me.metaKey || me.ctrlKey || me.shiftKey || me.altKey) return;
      const target = e.target as Element | null;
      if (target?.closest?.("a.tile")) {
        safeSet(DEPARTED_KEY, String(Date.now()));
        if (saveTimer !== null) {
          clearTimeout(saveTimer);
          saveTimer = null;
        }
        safeSet(SCROLL_KEY, String(main.scrollTop));
      }
    };
    main.addEventListener("click", onTileClick, { capture: true });

    // Flush any pending save on page hide, so a user who flicks the list
    // and immediately taps a tile captures their final position instead
    // of a 100ms-old one. NOTE: pagehide / visibilitychange do NOT fire
    // on Next.js SPA `<Link>` navigation (same-document push). That case
    // is covered by the `flushSave()` call in the cleanup below — which
    // runs when React unmounts this component during a route change.
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
      main.removeEventListener("click", onTileClick, { capture: true } as EventListenerOptions);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Cleanup-time flush — only safe if `main` is still in the DOM.
      // On Next.js client-side nav, by the time this cleanup runs,
      // `main` has been detached and `main.scrollTop` reads as 0 on
      // Chromium; writing that to SCROLL_KEY would clobber the correct
      // value flushed synchronously from the tile-click handler above.
      // So we skip the flush when `main` is detached. For other unmount
      // paths (HMR, strict-mode dev double-fire before any scroll has
      // happened), `isConnected` is true and the flush proceeds normally.
      if (saveTimer !== null) {
        clearTimeout(saveTimer);
        if (main.isConnected) {
          safeSet(SCROLL_KEY, String(main.scrollTop));
        }
      }
    };
  }, []);

  return null;
}
