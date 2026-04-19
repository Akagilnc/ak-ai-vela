"use client";

import { useEffect, useRef, useState } from "react";
import { ShareIcon } from "./path-icons";

type Status = "idle" | "shared" | "copied" | "error";

function messageFor(s: Status): string {
  switch (s) {
    case "copied":
      return "已复制链接，粘贴到微信发送";
    case "shared":
      return "已分享";
    case "error":
      return "复制失败，长按地址栏复制链接";
    default:
      return "";
  }
}

/**
 * Share button for the detail-page chrome.
 *
 * Strategy:
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
 *
 * Toast a11y (R11):
 * - Two-piece state: `message` (string) + `show` (bool). Reset timer flips
 *   `show` to false (CSS opacity fade out) but LEAVES `message` intact.
 *   That way the aria-live region content doesn't churn back to "" and
 *   re-announce a "blank"/space to VoiceOver / TalkBack. On the next share
 *   action, message either stays the same (no aria-live diff, no
 *   re-announce — acceptable for back-to-back identical actions) or
 *   updates to a new outcome (announced once).
 * - Reset delay raised from 1.7s → 3s. The longest message is
 *   "已复制链接，粘贴到微信发送" (17 chars). 1.7s is faster than most
 *   users finish reading; 3s lands close to natural reading pace without
 *   feeling sticky.
 */
export function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // R1 review fix (Gemini): clear pending 3s reset timer on unmount so the
  // component doesn't call `setShow(false)` on an unmounted fiber if the
  // user navigates away mid-toast (prev/next footer, Escape-to-overview,
  // external back). React 18+ silently no-ops the stale setState, but the
  // timer still runs to completion and holds a closure reference — minor
  // leak + dev-mode warning. Empty dep array: we only want cleanup on
  // unmount, not re-bind on every render.
  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  function announce(next: Status) {
    const text = messageFor(next);
    if (text) setMessage(text);
    setShow(Boolean(text));
    scheduleReset();
  }

  function scheduleReset() {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      // Hide the toast (CSS opacity fade) but keep `message` so the aria-live
      // region doesn't see a "<text>" → "" churn that some screen readers
      // announce as "blank" / a second empty pass.
      setShow(false);
      resetTimerRef.current = null;
    }, 3000);
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
    // Legacy path (HTTP / Safari <13.4 / some webviews). iOS Safari
    // drops the selection if the textarea is off-viewport, so the
    // textarea is positioned onscreen but visually invisible. focus +
    // setSelectionRange work around the iOS "select() with off-screen
    // element" bug that silently fails.
    try {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "0";
      ta.style.opacity = "0";
      ta.style.pointerEvents = "none";
      document.body.appendChild(ta);
      ta.focus();
      ta.setSelectionRange(0, ta.value.length);
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
      announce((await copyViaClipboard(url)) ? "copied" : "error");
      return;
    }

    // Non-WeChat: prefer native share sheet when available.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        announce("shared");
        return;
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        // Other errors: fall through to clipboard.
      }
    }

    announce((await copyViaClipboard(url)) ? "copied" : "error");
  }

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
      {/* Visible toast that doubles as the aria-live region — sighted users
          see the outcome, SR users hear it once. `show` toggles the CSS
          fade; `message` stays in DOM after fade-out so we don't churn the
          aria-live region back to "" (which some SRs read as "blank"). The
          `aria-hidden={!show}` (R12 fix) removes the stale message from the
          a11y tree once the toast fades, so SR users in browse / arrow-nav
          mode can't land on the chip and read it minutes after the fact. */}
      <div
        className={show ? "toast show" : "toast"}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-hidden={!show}
      >
        {message}
      </div>
    </>
  );
}
