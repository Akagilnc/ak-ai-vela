"use client";

import { useRef, useState } from "react";
import { ShareIcon } from "./path-icons";

type Status = "idle" | "shared" | "copied" | "error";

/**
 * Share button for the detail-page chrome.
 *
 * Strategy (R9 hardening):
 * - Inside WeChat webview, `navigator.share` is known to silently resolve
 *   on older iOS versions or bypass WeChat's forward sheet on Android.
 *   Detect via User-Agent and go straight to clipboard + "已复制" hint
 *   so the user can paste into a WeChat chat / Moments.
 * - Outside WeChat (iOS Safari / Android Chrome / desktop), prefer native
 *   `navigator.share` when available.
 * - Clipboard fallback guards against non-secure-context environments
 *   (HTTP cloudflare quick-tunnel) where `navigator.clipboard` is
 *   undefined — falls back to the legacy `execCommand("copy")` path so
 *   seed users testing over HTTP tunnels still get a working copy.
 * - Status text lives in a visually-hidden <span role="status" aria-live>
 *   rather than swapping the button's own aria-label, so VoiceOver /
 *   TalkBack don't fire a second announcement when the label flips back
 *   to idle 1.7s later.
 */
export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const resetTimerRef = useRef<number | null>(null);

  function scheduleReset() {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimerRef.current = null;
    }, 1700);
  }

  function isWeChatWebview(): boolean {
    if (typeof navigator === "undefined") return false;
    return /MicroMessenger/i.test(navigator.userAgent);
  }

  async function copyViaClipboard(url: string): Promise<boolean> {
    // Modern path (secure context)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        return true;
      } catch {
        /* fall through to legacy */
      }
    }
    // Legacy path (works on HTTP / Safari <13.4 / some webviews)
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.setAttribute("readonly", "");
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  async function handleShare() {
    const url = window.location.href;

    // WeChat webview: skip native share (unreliable), go straight to copy.
    if (isWeChatWebview()) {
      setStatus((await copyViaClipboard(url)) ? "copied" : "error");
      scheduleReset();
      return;
    }

    // Non-WeChat: prefer native share sheet when available.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus("shared");
        scheduleReset();
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        // Other errors: fall through to clipboard.
      }
    }

    setStatus((await copyViaClipboard(url)) ? "copied" : "error");
    scheduleReset();
  }

  const statusMessage =
    status === "copied"
      ? "已复制链接，粘贴到微信发送"
      : status === "shared"
        ? "已分享"
        : status === "error"
          ? "复制失败，长按地址栏复制链接"
          : "";

  return (
    <>
      <button
        className="icon-btn"
        type="button"
        aria-label="分享"
        onClick={handleShare}
      >
        <ShareIcon />
      </button>
      {/* Off-screen live region; announces outcome exactly once per action,
          no re-announce when label resets to idle. */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {statusMessage}
      </span>
    </>
  );
}
