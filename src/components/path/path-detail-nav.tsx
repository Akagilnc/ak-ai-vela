"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  useEffect(() => {
    function isModalOpen(): boolean {
      return document.body.classList.contains("no-scroll");
    }

    // Guard against hijacking keyboard / swipe while the user is interacting
    // with a form control, editable content, or a horizontally-scrollable
    // region (e.g. dragging the sub-nav pills). Without this, pressing arrow
    // keys to move the text caret in the CTA email field would teleport the
    // user to another activity page.
    function isInInteractiveTarget(target: EventTarget | null): boolean {
      if (!(target instanceof Element)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if ((target as HTMLElement).isContentEditable) return true;
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

    function onKey(e: KeyboardEvent) {
      if (isModalOpen()) return;
      if (isInInteractiveTarget(e.target)) return;
      if (e.key === "ArrowLeft" && prevSlug) {
        router.push(`/path/${prevSlug}`);
      } else if (e.key === "ArrowRight" && nextSlug) {
        router.push(`/path/${nextSlug}`);
      } else if (e.key === "Escape") {
        router.push("/path");
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
        if (dx < 0 && nextSlug) router.push(`/path/${nextSlug}`);
        else if (dx > 0 && prevSlug) router.push(`/path/${prevSlug}`);
      }
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [prevSlug, nextSlug, router]);

  return null;
}
