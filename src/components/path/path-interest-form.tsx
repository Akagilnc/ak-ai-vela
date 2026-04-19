"use client";

import { useState } from "react";

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/path/interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          childGrade: grade || null,
          sourcePath,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error === "invalid_payload" ? "邮箱格式不对" : "提交失败，稍后再试");
        return;
      }

      setStatus("ok");
      setMessage("收到，我们会单独联系你");
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
        留个邮箱，6 月卡出来我们发给你。不 spam，不转售。
      </p>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
          style={{
            appearance: "none",
            border: "1px solid var(--hair)",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 14,
            fontFamily: "inherit",
            background: "var(--cream)",
            color: "var(--ink)",
          }}
        />
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          style={{
            appearance: "none",
            border: "1px solid var(--hair)",
            borderRadius: 10,
            padding: "10px 12px",
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
              : "留个邮箱"}
        </button>
        {message ? (
          <p
            style={{
              fontSize: 12,
              margin: 0,
              color: status === "error" ? "#a64" : "var(--mute)",
            }}
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
