"use client";

import { useState } from "react";
import { ShareIcon } from "./path-icons";

type Status = "idle" | "shared" | "copied" | "error";

/**
 * Share button for the detail-page chrome. Prefers the native Web Share
 * sheet (WeChat in-app / iOS Safari / Android Chrome all support it), falls
 * back to copying the URL to clipboard with a transient toast in the aria-
 * label. Pre-R8 this was a dead focusable <button> with no onClick — it
 * failed WCAG 2.5.3 basic contract ("focusable + labeled control must do
 * something when activated").
 */
export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus("shared");
        scheduleReset();
        return;
      } catch (err) {
        // User cancelled — do nothing (don't swap to clipboard fallback).
        if ((err as Error)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    scheduleReset();
  }

  function scheduleReset() {
    window.setTimeout(() => setStatus("idle"), 1700);
  }

  const label =
    status === "copied"
      ? "已复制链接到剪贴板"
      : status === "shared"
        ? "已分享"
        : status === "error"
          ? "复制失败"
          : "分享";

  return (
    <button
      className="icon-btn"
      type="button"
      aria-label={label}
      aria-live="polite"
      onClick={handleShare}
    >
      <ShareIcon />
    </button>
  );
}
