"use client";

// Error boundary for /path routes. Replaces Next.js's default English
// "Application error" screen with Chinese brand-styled copy + a retry
// path so seed users on stale tunnel URLs / Prisma hiccups don't see a
// trust-breaking blank page.

import Link from "next/link";

export default function PathError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="stage">
      <div className="stage-inner">
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 22px",
            textAlign: "center",
            gap: 14,
          }}
        >
          <h1
            style={{
              fontFamily: "var(--zh)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            加载出了点问题
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "var(--mute)",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 320,
            }}
          >
            请稍后重试，或者回到 5 月卡片列表。
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "0 22px",
                background: "var(--forest)",
                color: "var(--cream)",
                border: 0,
                borderRadius: 12,
                fontFamily: "var(--zh-sans)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              重试
            </button>
            <Link
              href="/path"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                padding: "0 22px",
                background: "var(--cream-2)",
                color: "var(--ink-2)",
                borderRadius: 12,
                border: "1px solid var(--hair)",
                fontFamily: "var(--zh-sans)",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              返回卡片列表
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
