"use client";

import { useEffect, useRef, useState } from "react";

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

  // Scroll-spy: watch #detail-body scroll, find the section whose offsetTop
  // is closest to but not past the current scrollTop + 20px cushion.
  useEffect(() => {
    const body = document.getElementById("detail-body");
    if (!body) return;

    const update = () => {
      const top = body.scrollTop + 20;
      let idx = 0;
      for (let i = 0; i < targets.length; i++) {
        const sec = document.getElementById(`sec-${i}`);
        if (sec && sec.offsetTop <= top) idx = i;
      }
      setActive(idx);
    };

    body.addEventListener("scroll", update, { passive: true });
    update();
    return () => body.removeEventListener("scroll", update);
  }, [targets.length]);

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
    if (btnL < scrollL + 10) {
      nav.scrollTo({ left: btnL - 10, behavior: "smooth" });
    } else if (btnR > scrollR - 10) {
      nav.scrollTo({ left: btnR - nav.clientWidth + 10, behavior: "smooth" });
    }
  }, [active]);

  function handleClick(i: number) {
    const sec = document.getElementById(`sec-${i}`);
    const body = document.getElementById("detail-body");
    if (sec && body) {
      body.scrollTo({ top: sec.offsetTop - 8, behavior: "smooth" });
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
