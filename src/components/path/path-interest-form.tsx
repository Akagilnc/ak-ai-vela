"use client";

import { useRef, useState } from "react";
import { canonicalSourcePath } from "@/lib/path/canonical-source";

/**
 * Visually-hidden class equivalent — pushed off-screen but still announced
 * by screen readers. Inline so we don't need to touch the shared CSS.
 */
const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * CTA form below the tile list. Captures email + optional grade/budget into
 * PathInterest via POST /api/path/interest. Pre-monetization signal only —
 * we read these to know who wants this product enough to leave contact.
 */

type Status = "idle" | "submitting" | "ok" | "error";

export function PathInterestForm({
  sourcePath = "/path",
}: {
  sourcePath?: string;
}) {
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const emailRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting" || status === "ok") return;

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setStatus("error");
      setMessage("请输入邮箱");
      emailRef.current?.focus();
      return;
    }

    // R12 fix: validate format client-side BEFORE the network round-trip.
    // The `<input type="email">` is rendered with `noValidate` on the form
    // so HTML5's built-in popover doesn't fire — that lets us own the error
    // copy in Chinese, but means we have to re-implement the format check.
    // The regex is the same loose shape the server's Zod schema accepts:
    // one or more non-space-at chars, `@`, one or more non-space-at,
    // `.`, one or more. Catches typos like "abc@gmail" or trailing comma
    // before the user pays a 1–3s 4G round-trip in Shanghai for the same
    // verdict.
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(normalizedEmail)) {
      setStatus("error");
      setMessage("邮箱格式不对");
      emailRef.current?.focus();
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/path/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          childGrade: grade || null,
          sourcePath: canonicalSourcePath(sourcePath),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        const isFormatError =
          data.error === "invalid_payload" || data.error === "invalid_json";
        const errMsg = isFormatError
          ? "邮箱格式不对"
          : data.error === "write_failed" && data.retryable
            ? "服务器忙，请稍后再试"
            : "提交失败，稍后再试";
        setMessage(errMsg);
        // R12 fix: only refocus the email input when the error is about
        // the email itself. For server / network errors the user just
        // needs to re-tap the (now-relabeled "重试") submit button —
        // jerking focus back to email mis-signals "your email is wrong"
        // when the actual issue is server-side.
        if (isFormatError) emailRef.current?.focus();
        return;
      }

      setStatus("ok");
      setMessage("收到了，下次更新第一时间发你");
      setEmail("");
      setGrade("");
    } catch {
      setStatus("error");
      setMessage("网络不通，稍后再试");
    }
  }

  return (
    <section
      aria-labelledby="cta-title"
      style={{
        margin: "18px 22px 40px",
        padding: "16px 18px",
        background: "var(--cream-2)",
        border: "1px solid var(--hair)",
        borderRadius: 14,
      }}
    >
      <h3
        id="cta-title"
        style={{
          fontFamily: "var(--zh-serif, serif)",
          fontSize: 15,
          fontWeight: 600,
          margin: "0 0 4px",
        }}
      >
        想看后续月份？
      </h3>
      <p
        style={{
          fontSize: 12.5,
          color: "var(--mute)",
          margin: "0 0 12px",
          lineHeight: 1.5,
        }}
      >
        留个邮箱，下次更新我们发给你。不 spam，不转售。
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
        noValidate
      >
        <label htmlFor="cta-email" style={srOnlyStyle}>
          邮箱
        </label>
        <input
          id="cta-email"
          ref={emailRef}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          aria-invalid={status === "error" ? "true" : "false"}
          aria-describedby={message ? "cta-status" : undefined}
          style={{
            appearance: "none",
            border: "1px solid var(--hair)",
            borderRadius: 10,
            padding: "10px 12px",
            // R13 fix: WCAG 2.5.5 AAA tap target 44x44. Padding+font alone
            // resolved to ~37px (10+14+10 + line gap), missing finger
            // contact reliability on iPhone SE.
            minHeight: 44,
            fontSize: 14,
            fontFamily: "inherit",
            background: "var(--cream)",
            color: "var(--ink)",
          }}
        />
        <label htmlFor="cta-grade" style={srOnlyStyle}>
          孩子年级
        </label>
        <select
          id="cta-grade"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{
            appearance: "none",
            border: "1px solid var(--hair)",
            borderRadius: 10,
            padding: "10px 12px",
            minHeight: 44,
            fontSize: 14,
            fontFamily: "inherit",
            background: "var(--cream)",
            color: "var(--ink)",
          }}
        >
          <option value="">孩子年级（选填）</option>
          <option value="G4">G4</option>
          <option value="G5">G5</option>
          <option value="G6">G6</option>
          <option value="G7">G7</option>
          <option value="G8">G8</option>
        </select>
        <button
          type="submit"
          disabled={status === "submitting" || status === "ok"}
          style={{
            appearance: "none",
            background: status === "ok" ? "var(--hair)" : "var(--forest)",
            color: "var(--cream)",
            border: "none",
            borderRadius: 10,
            padding: "11px 14px",
            minHeight: 44,
            fontSize: 14,
            fontFamily: "var(--zh-sans)",
            fontWeight: 600,
            cursor: status === "submitting" ? "progress" : "pointer",
          }}
        >
          {status === "submitting"
            ? "提交中..."
            : status === "ok"
              ? "已提交 ✓"
              : status === "error"
                ? "重试"
                : "留个邮箱"}
        </button>
        <p
          id="cta-status"
          role="status"
          aria-live="polite"
          style={{
            fontSize: 12,
            margin: 0,
            minHeight: "1em",
            // #7a3412 = darker brick; computes ~6.3:1 contrast on cream-2
            // bg (meets WCAG AA 4.5:1 for small text). #a64 failed at 3.88:1.
            color: status === "error" ? "#7a3412" : "var(--mute)",
          }}
        >
          {message}
        </p>
      </form>
    </section>
  );
}
