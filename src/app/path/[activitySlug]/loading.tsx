/**
 * Streaming skeleton shown during route transitions between activity cards
 * (keyboard ←/→, swipe, tile click). Without this, users see a blank screen
 * for the SSR round-trip on slow networks (4G WeChat can be 300-800ms),
 * leading to double-taps that misfire another navigation.
 */
export default function Loading() {
  return (
    <div className="stage">
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="app-chrome detail-mode">
          <span className="back-btn" aria-hidden="true">
            <span style={{ width: 16, height: 16 }} />
            <span>5 月</span>
          </span>
          <div className="center-title">
            <span className="idx">·· / ··</span>加载中…
          </div>
          <span className="icon-btn" aria-hidden="true" />
        </div>
        <div
          aria-busy="true"
          aria-live="polite"
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--mute)",
            fontSize: 13,
          }}
        >
          加载中…
        </div>
      </div>
    </div>
  );
}
