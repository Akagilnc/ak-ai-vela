"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Keyboard + touch navigation for the detail page. Mirrors demo:
 *   ←   →     previous / next activity card (if any)
 *   Esc       back to overview
 *   swipe     horizontal swipe > 80px dominant-axis → prev / next
 *
 * Registered once per detail page; cleans up on route change. Skipped
 * when lightbox or any modal is open (checks body .no-scroll as a proxy).
 */
export function PathDetailNav({
  prevSlug,
  nextSlug,
}: {
  prevSlug?: string | null;
  nextSlug?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  // Navigation lock — set while a push is in flight so holding arrow keys
  // doesn't enqueue multiple transitions. useRef survives re-renders but is
  // reset below when the route actually changes (pathname dep on the effect)
  // or after an 800ms safety timeout so a failed / silent router.push can't
  // wedge nav permanently.
  const navigatingRef = useRef(false);
  const unlockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Route actually changed — release the lock.
    navigatingRef.current = false;
    if (unlockTimerRef.current) {
      clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    function isModalOpen(): boolean {
      return document.body.classList.contains("no-scroll");
    }

    // Guard against hijacking keyboard / swipe while the user is interacting
    // with a form control, editable content, a focusable wrapper, or a
    // native button / link. EXCEPT the footer prev/next links — those ARE
    // the nav action, so the arrow-key shortcut and the link click have the
    // same semantics, no conflict.
    //
    // Uses `.closest(...)` throughout so that descendants of interactive
    // elements are also treated as interactive — otherwise a touch that
    // lands on an `<img>` or `<span>` inside a link/button escapes the
    // guard and the swipe handler hijacks the gesture.
    function isInInteractiveTarget(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false;
      if (target.closest<HTMLElement>("input, textarea, select")) return true;
      const el = target as HTMLElement;
      if (el.isContentEditable) return true;
      if (el.closest<HTMLElement>('[role="button"]')) return true;
      // tabindex=0 means the element was deliberately made focusable; treat
      // arrow keys as local there, not as app-wide navigation.
      if (el.closest<HTMLElement>('[tabindex="0"]')) return true;
      // Native <button> / <a> ancestor — sub-nav pills, back button, share,
      // form submit, in-content cite links, loc-card internal links.
      // Footer prev/next links are the one exception (arrow = click for
      // those). Disabled buttons fall through to the global nav path since
      // they don't respond to click or keyboard anyway.
      const interactiveAncestor = el.closest<HTMLElement>("a, button");
      if (interactiveAncestor) {
        if ((interactiveAncestor as HTMLButtonElement).disabled) return false;
        if (!interactiveAncestor.closest(".d-footer")) return true;
      }
      return false;
    }

    function hasScrollableAncestor(target: EventTarget | null): boolean {
      let node = target instanceof Element ? target : null;
      while (node && node !== document.body) {
        const style = window.getComputedStyle(node);
        const overflowX = style.overflowX;
        if (
          (overflowX === "auto" || overflowX === "scroll") &&
          node.scrollWidth > node.clientWidth
        ) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    }

    // Nav lock: once a router.push fires, ignore further arrow/swipe until
    // the route actually changes (pathname dep on the outer effect releases
    // the lock) or the safety timeout fires (prevents wedge on failed push).
    function navTo(href: string) {
      if (navigatingRef.current) return;
      navigatingRef.current = true;
      if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
      // 2s safety unlock — covers cold WeChat WebView / slow 4G where a real
      // transition can exceed 800ms. The pathname effect still releases the
      // lock earlier on fast transitions; the timer only fires if router.push
      // silently fails or hangs.
      unlockTimerRef.current = setTimeout(() => {
        navigatingRef.current = false;
        unlockTimerRef.current = null;
      }, 2000);
      router.push(href);
    }

    function onKey(e: KeyboardEvent) {
      if (isModalOpen()) return;
      if (isInInteractiveTarget(e.target)) return;
      // e.repeat is true for auto-repeated keydowns on held keys.
      if (e.repeat) return;
      if (e.key === "ArrowLeft" && prevSlug) {
        navTo(`/path/${prevSlug}`);
      } else if (e.key === "ArrowRight" && nextSlug) {
        navTo(`/path/${nextSlug}`);
      } else if (e.key === "Escape") {
        navTo("/path");
      }
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartedInInteractive = false;
    function onTouchStart(e: TouchEvent) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartedInInteractive =
        isInInteractiveTarget(e.target) || hasScrollableAncestor(e.target);
    }
    function onTouchEnd(e: TouchEvent) {
      if (isModalOpen()) return;
      if (touchStartedInInteractive) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      // horizontal dominance + min distance
      if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx < 0 && nextSlug) navTo(`/path/${nextSlug}`);
        else if (dx > 0 && prevSlug) navTo(`/path/${prevSlug}`);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      if (unlockTimerRef.current) {
        clearTimeout(unlockTimerRef.current);
        unlockTimerRef.current = null;
      }
    };
  }, [prevSlug, nextSlug, router]);

  return null;
}
