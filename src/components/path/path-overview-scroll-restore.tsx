"use client";

import { useEffect } from "react";

/**
 * Restore the overview page's scroll position when returning via back
 * navigation. The scrollable container is `<main id="path-main">` (not
 * `window`), so the browser's built-in scroll restoration doesn't apply —
 * it only tracks `window.scrollY`. Without this component, tapping a tile
 * to view detail, then swiping back, drops the user back at the TOP of the
 * tile list instead of the card they were looking at.
 *
 * Strategy:
 * - On scroll (throttled via rAF): write `#path-main` scrollTop to
 *   sessionStorage.
 * - On mount: read sessionStorage and set scrollTop. If no value (fresh
 *   visit), stay at 0.
 *
 * sessionStorage is tab-scoped, so closing the tab or opening a fresh tab
 * starts over. That matches the "back navigation within this session"
 * expectation without leaking state across tabs.
 */
const STORAGE_KEY = "vela:path-overview:scroll";

export function PathOverviewScrollRestore() {
  useEffect(() => {
    const main = document.getElementById("path-main");
    if (!main) return;

    const restore = () => {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const top = parseInt(saved, 10);
      if (!Number.isFinite(top) || top <= 0) return;
      // `scrollTo({ behavior: "instant" })` instead of `scrollTop = top`
      // because some browsers silently drop direct property writes on
      // scroll containers that have a smooth-scroll CSS rule. Defer by
      // one tick so layout can settle (images may still be reserving
      // space from lazy-loading).
      setTimeout(() => {
        main.scrollTo({ top, behavior: "instant" });
      }, 0);
    };

    // 1) Restore on fresh mount (first paint after SSR hydration).
    restore();

    // 2) Restore on back/forward navigation. Next.js App Router can keep
    //    the page DOM in its router cache and re-show it without remounting
    //    client components — `popstate` fires regardless. `pageshow` covers
    //    the browser BF-cache case. Both are idempotent because `restore`
    //    just re-applies the stored scrollTop.
    window.addEventListener("popstate", restore);
    window.addEventListener("pageshow", restore);

    // 3) Save on scroll, throttled at 100ms (10x / sec max). `setTimeout`
    //    instead of `requestAnimationFrame` because headless browsers and
    //    background tabs throttle rAF to near-never, which would drop all
    //    writes in those environments. 100ms is finer than rAF (16ms) but
    //    still imperceptible for scroll capture and writes to sessionStorage
    //    only ~10x / sec.
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (timeoutId !== null) return;
      timeoutId = setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, String(main.scrollTop));
        timeoutId = null;
      }, 100);
    };
    main.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      main.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", restore);
      window.removeEventListener("pageshow", restore);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
