/**
 * Streaming skeleton for curated segment route transitions. Mirrors the old
 * path detail route's chrome + intro + section rhythm while keeping the
 * placeholder minimal for the curated-view surface.
 */

import type { CSSProperties } from "react";

const barStyle: CSSProperties = {
  background: "var(--hair)",
  borderRadius: 6,
  opacity: 0.45,
};

export default function Loading() {
  return (
    <div
      className="stage"
      aria-busy="true"
      aria-live="polite"
      aria-label="策展段加载中"
    >
      <div
        className="stage-inner"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="app-chrome detail-mode">
          <span className="back-btn" aria-hidden="true">
            <span style={{ width: 16, height: 16 }} />
            <span>Path</span>
          </span>
          <div className="center-title">Curated View</div>
        </div>

        <main
          className="detail-body"
          id="detail-body"
          style={{ pointerEvents: "none" }}
        >
          <section className="card-intro" data-kind="event" aria-hidden="true">
            <div className="kicker">
              <span className="pip" />
              <span
                style={{
                  ...barStyle,
                  display: "inline-block",
                  width: 92,
                  height: 10,
                }}
              />
            </div>
            <div
              style={{ ...barStyle, height: 30, width: "72%", marginTop: 8 }}
            />
            <div
              style={{ ...barStyle, height: 14, width: "88%", marginTop: 12 }}
            />
          </section>

          {["贴身", "探索"].map((label, index) => (
            <section key={label} className="d-sec" aria-hidden="true">
              <div className="d-sec-head">
                <span className="num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{label}</h2>
              </div>
              <div
                style={{ ...barStyle, height: 14, width: "95%", marginTop: 6 }}
              />
              <div
                style={{ ...barStyle, height: 14, width: "80%", marginTop: 6 }}
              />
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
