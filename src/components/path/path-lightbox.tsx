"use client";

import { useEffect, useState } from "react";

/**
 * Lightbox for species/bird id-table photos. Mirrors demo behavior:
 * - Tap a `.id-row .img.has-photo img` → enlarged overlay.
 * - Click overlay / close button / Escape → dismiss.
 *
 * Tile previews and loc-card photos are already large enough at list
 * size, so we deliberately don't lightbox them.
 */
export function PathLightbox() {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const img = target.closest<HTMLImageElement>(
        ".id-row .img.has-photo img",
      );
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      setSrc(img.src);
      setAlt(img.alt || "");
      setOpen(true);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Toggle body scroll lock while open.
  useEffect(() => {
    if (open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [open]);

  return (
    <div
      className="lightbox"
      aria-hidden={!open}
      onClick={(e) => {
        // dismiss when clicking any part of the overlay chrome
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <button
        className="lb-close"
        aria-label="关闭"
        type="button"
        onClick={() => setOpen(false)}
      >
        ×
      </button>
      {open ? (
        <>
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
        </>
      ) : null}
    </div>
  );
}
