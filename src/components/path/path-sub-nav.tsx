"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Pick scroll behavior honoring `prefers-reduced-motion`. iOS Safari and
 * WebKit historically ignore the user-agent's hint for JS-driven smooth
 * scroll, so we have to gate on `matchMedia` ourselves. R15 a11y fix.
 */
function scrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") return "auto";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

/**
 * Sticky sub-nav with scroll-spy. Mirrors demo behavior:
 * - Click a pill → smooth-scroll to the corresponding `.d-sec` section.
 * - Scrolling the detail body updates which pill is active.
 * - Active pill auto-scrolls horizontally into view when off-screen.
 *
 * Expects each section in the DOM to have `id="sec-{index}"`. Sections
 * render inside `#detail-body` which is the scroll container.
 */
export function PathSubNav({ targets }: { targets: string[] }) {
  const [active, setActive] = useState(0);
  const navRef = useRef<HTMLElement | null>(null);
  const firstMountRef = useRef(true);
  // Content-based key so effects re-run when the actual target list changes,
  // not just when the length happens to differ. Two 5-section cards with
  // different content previously reused the old `active` state.
  const targetsKey = targets.join("|");

  // Reset active pill + detail-body scroll on activity switch. Skipped on
  // the very first mount so future deep-link anchors like `/path/xx#sec-3`
  // don't get zeroed-out at load.
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
    setActive(0);
    const body = document.getElementById("detail-body");
    if (body) body.scrollTop = 0;
  }, [targetsKey]);

  // Scroll-spy: watch #detail-body scroll, find the section whose offsetTop
  // is closest to but not past the current scrollTop + 20px cushion.
  //
  // R2 review fix (Gemini): cache section elements ONCE at effect setup
  // instead of calling `document.getElementById` in a loop on every scroll
  // tick. The previous implementation did N DOM lookups per scroll frame
  // (N = section count, typically 2–5). On mobile Safari + WeChat webview
  // this caused scroll jank, especially on slower devices. The cached
  // array stays valid for the lifetime of the effect because the section
  // DOM is rendered by the parent alongside `targetsKey` — the same
  // dependency that re-runs this effect. Avoiding IntersectionObserver
  // here because it reports based on viewport, not the scroll container
  // `#detail-body`'s own scroll state, which would need extra root config.
  // eslint-disable-next-line react-hooks/exhaustive-deps -- targets ref
  //   is fresh each render; targetsKey is the stable content hash.
  useEffect(() => {
    const body = document.getElementById("detail-body");
    if (!body) return;

    const sections: HTMLElement[] = [];
    for (let i = 0; i < targets.length; i++) {
      const sec = document.getElementById(`sec-${i}`);
      if (sec) sections.push(sec);
    }

    const update = () => {
      const top = body.scrollTop + 20;
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= top) idx = i;
      }
      setActive(idx);
    };

    body.addEventListener("scroll", update, { passive: true });
    update();
    return () => body.removeEventListener("scroll", update);
  }, [targetsKey]);

  // Keep the active pill visible in the horizontally-scrolling nav bar.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const btn = nav.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    if (!btn) return;
    const btnL = btn.offsetLeft;
    const btnR = btnL + btn.offsetWidth;
    const scrollL = nav.scrollLeft;
    const scrollR = scrollL + nav.clientWidth;
    const behavior = scrollBehavior();
    if (btnL < scrollL + 10) {
      nav.scrollTo({ left: btnL - 10, behavior });
    } else if (btnR > scrollR - 10) {
      nav.scrollTo({ left: btnR - nav.clientWidth + 10, behavior });
    }
  }, [active]);

  function handleClick(i: number) {
    const sec = document.getElementById(`sec-${i}`);
    const body = document.getElementById("detail-body");
    if (sec && body) {
      body.scrollTo({ top: sec.offsetTop - 8, behavior: scrollBehavior() });
    }
  }

  return (
    <nav
      className="sub-nav"
      id="sub-nav"
      ref={navRef}
      aria-label="段落导航"
    >
      {targets.map((t, i) => (
        <button
          key={t}
          type="button"
          data-idx={i}
          data-target={t}
          className={i === active ? "active" : undefined}
          onClick={() => handleClick(i)}
        >
          {t}
        </button>
      ))}
    </nav>
  );
}
