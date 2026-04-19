"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightbox for species/bird id-table photos. Mirrors demo behavior:
 * - Tap a `.id-row .img.has-photo img` → enlarged overlay.
 * - Click overlay / close button / Escape → dismiss.
 *
 * A11y hardening vs. the demo:
 * - `role="dialog" aria-modal="true"` announces the overlay as modal.
 * - Conditionally rendered so hidden controls aren't Tab-reachable.
 * - Close button is auto-focused on open.
 * - Focus trapped inside the dialog while open (Tab wraps).
 * - Focus restored to the triggering image on close.
 */
export function PathLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const img = target.closest<HTMLImageElement>(
        ".id-row .img.has-photo img",
      );
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      triggerRef.current = img;
      setSrc(img.src);
      setAlt(img.alt || "");
      setOpen(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "Tab") {
        // Trap focus inside the dialog — there's only one interactive element
        // (the close button), so every Tab loops back to it.
        if (closeBtnRef.current) {
          e.preventDefault();
          closeBtnRef.current.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Toggle body scroll lock + focus management while open.
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
      // Next tick: let the conditional render land before focusing.
      const id = requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
      return () => {
        cancelAnimationFrame(id);
        document.body.classList.remove("no-scroll");
        triggerRef.current?.focus();
      };
    }
    document.body.classList.remove("no-scroll");
  }, [open]);

  if (!open) {
    // Render nothing when closed so hidden controls aren't in the tab order.
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || "图片预览"}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      style={{ opacity: 1, pointerEvents: "auto" }}
    >
      <button
        ref={closeBtnRef}
        className="lb-close"
        aria-label="关闭"
        type="button"
        onClick={() => setOpen(false)}
      >
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="lb-img"
        src={src}
        alt={alt}
        onClick={() => setOpen(false)}
      />
      <div
        className="lb-cap"
        aria-live="polite"
        onClick={() => setOpen(false)}
      >
        {alt}
      </div>
    </div>
  );
}
