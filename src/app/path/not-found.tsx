// 404 page for /path routes. Brand-styled (vela.css) so users hitting a
// stale share link see Chinese copy + Vela aesthetic, not Next.js's
// default English error.

import Link from "next/link";

export default function PathNotFound() {
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
            gap: 16,
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
            这张卡找不到了
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
            链接可能已过期，或者卡片还没上线。回到 5 月看看其他活动卡。
          </p>
          <Link
            href="/path"
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 22px",
              background: "var(--forest)",
              color: "var(--cream)",
              borderRadius: 12,
              fontFamily: "var(--zh-sans)",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            返回 5 月卡片
          </Link>
        </main>
      </div>
    </div>
  );
}
