"use client";

/**
 * Share button — copies result URL to clipboard and shows toast.
 * Falls back to Web Share API on supporting platforms.
 */

import { useState } from "react";
import type { TraitType } from "@/lib/traits/temperament/score";

interface ShareButtonProps {
  type: TraitType;
}

export function ShareButton({ type }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const title = `Vela 气质画像 · ${type}`;
    const text = `给伴侣看一下：${title}`;

    // Prefer native share on mobile
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last fallback: prompt user to copy manually
      window.prompt("复制这个链接", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="bg-vela-primary text-white rounded-md min-h-[52px] flex items-center justify-center font-semibold text-[16px] hover:bg-vela-primary-dark"
      aria-live="polite"
    >
      {copied ? "✓ 链接已复制" : "分享给伴侣"}
    </button>
  );
}
