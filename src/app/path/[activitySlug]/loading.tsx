/**
 * Streaming skeleton shown during route transitions between activity cards
 * (keyboard ←/→, swipe, tile click). Matches the real detail page's layout
 * (chrome + sub-nav + card intro + 2 section stubs + footer) so hydration
 * doesn't produce a large jump that pushes the prev/next buttons into view.
 */

const barStyle: React.CSSProperties = {
  background: "var(--hair)",
  borderRadius: 6,
  opacity: 0.45,
};

export default function Loading() {
  return (
    <div className="stage" aria-busy="true" aria-live="polite">
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* chrome skeleton — keeps back button + title + share slot */}
        <div className="app-chrome detail-mode">
          <span className="back-btn" aria-hidden="true">
            <span style={{ width: 16, height: 16 }} />
            <span>返回</span>
          </span>
          <div className="center-title">
            <span className="idx">·· / ··</span>
            <span style={{ ...barStyle, display: "inline-block", width: 120, height: 14 }} />
          </div>
          <span className="icon-btn" aria-hidden="true" />
        </div>

        {/* sub-nav skeleton — 5 pill-shaped placeholders, matches count of real pages */}
        <nav className="sub-nav" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              style={{
                ...barStyle,
                display: "inline-flex",
                minHeight: 44,
                padding: "0 14px",
                minWidth: 64,
                borderRadius: 22,
                background: "var(--cream-2)",
                border: "1px solid var(--hair)",
              }}
            />
          ))}
        </nav>

        <div className="detail-body" id="detail-body" style={{ pointerEvents: "none" }}>
          <div className="card-intro" data-kind="baseline">
            <div className="kicker">
              <span className="pip" />
              <span style={{ ...barStyle, display: "inline-block", width: 80, height: 10 }} />
            </div>
            <div style={{ ...barStyle, height: 30, width: "70%", marginTop: 8 }} />
            <div style={{ ...barStyle, height: 14, width: "90%", marginTop: 12 }} />
            <div style={{ ...barStyle, height: 14, width: "60%", marginTop: 6 }} />
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <section key={i} className="d-sec" aria-hidden="true">
              <div className="d-sec-head">
                <span className="num">§</span>
                <span style={{ ...barStyle, display: "inline-block", width: 140, height: 18 }} />
              </div>
              <div style={{ ...barStyle, height: 14, width: "95%", marginTop: 6 }} />
              <div style={{ ...barStyle, height: 14, width: "80%", marginTop: 6 }} />
              <div style={{ ...barStyle, height: 14, width: "88%", marginTop: 6 }} />
            </section>
          ))}
        </div>

        {/* footer disabled prev/next — keeps height stable */}
        <div className="d-footer">
          <button className="prev" disabled type="button">
            <span className="ic">←</span>
            <div className="stack">
              <span className="dir">上一张</span>
              <span className="ti">…</span>
            </div>
          </button>
          <button className="next" disabled type="button">
            <div className="stack">
              <span className="dir">下一张</span>
              <span className="ti">…</span>
            </div>
            <span className="ic">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
