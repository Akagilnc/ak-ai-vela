import { prisma } from "@/lib/prisma";
import { PathActivityTile } from "@/components/path/path-activity-tile";
import { PathInterestForm } from "@/components/path/path-interest-form";
import { PathOverviewScrollRestore } from "@/components/path/path-overview-scroll-restore";

export default async function PathOverviewPage() {
  // v0.1: single stage (G1-G3), single month (5). Query is scoped to that
  // stage + month so multi-month / multi-stage seeds in the future don't
  // silently mix content into this view.
  const stage = await prisma.pathStage.findFirst({
    where: { slug: "g1-to-g3-foundation" },
  });

  const activities = stage
    ? await prisma.pathActivity.findMany({
        where: { goal: { stageId: stage.id }, month: 5 },
        orderBy: [{ month: "asc" }, { displayOrder: "asc" }, { slug: "asc" }],
      })
    : [];

  const baselineCount = activities.filter((a) => a.cardType === "baseline").length;
  const eventCount = activities.filter((a) => a.cardType === "event").length;

  return (
    <div className="stage">
      <div className="stage-inner">
        <div
          className="overview-view"
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <header className="app-chrome">
            <div className="brand">
              <span className="mark">
                Vela<span className="dot"></span>
              </span>
              <span className="sub">Path Explorer · 预览</span>
            </div>
            {/* "更多" menu removed in R9: v0.1 has no menu behind it, so
                leaving the button focusable-but-inert failed WCAG 2.5.3.
                Re-add when a menu exists. */}
          </header>

          <main className="app-body" id="path-main">
            <PathOverviewScrollRestore />
            <section className="path-head">
              <h1>
                小小<span className="accent">动物科学家</span>
              </h1>
            </section>

            {/* R9: active stage shown as a non-interactive <span> (keyboard-
                skipped state indicator, not a tab — there's no real tabpanel
                relationship). Future-stage buttons keep `disabled` so they're
                visible-but-focus-skipped. */}
            <div className="stage-tabs" aria-label="学段">
              <span className="is-active" aria-current="true">
                <span className="t">一~三年级</span>
                <span className="s">好奇心扎根</span>
              </span>
              <button
                disabled
                aria-disabled="true"
                type="button"
                aria-label="四~六年级 · 整理中"
              >
                <span className="t">四~六年级</span>
                <span className="s">目的性探索</span>
              </button>
              <button
                disabled
                aria-disabled="true"
                type="button"
                aria-label="初中 · 整理中"
              >
                <span className="t">初中</span>
                <span className="s">理解转换</span>
              </button>
            </div>

            <div className="month-scroll compact">
              {/* R9: active month as <span>, ghost months as `disabled`
                  buttons so keyboard users skip them (visible hint without
                  a dead focusable control). */}
              <div className="months" aria-label="月份（左右滑动）">
                <button
                  className="m-pill"
                  data-status="ghost"
                  type="button"
                  disabled
                  aria-label="3 月 · 整理中"
                >
                  3 月
                </button>
                <button
                  className="m-pill"
                  data-status="ghost"
                  type="button"
                  disabled
                  aria-label="4 月 · 整理中"
                >
                  4 月
                </button>
                <span className="m-pill" aria-current="true">
                  5 月
                </span>
                <button
                  className="m-pill"
                  data-status="ghost"
                  type="button"
                  disabled
                  aria-label="6 月 · 整理中"
                >
                  6 月
                </button>
                <button
                  className="m-pill"
                  data-status="ghost"
                  type="button"
                  disabled
                  aria-label="7 月 · 整理中"
                >
                  7 月
                </button>
                <button
                  className="m-pill"
                  data-status="ghost"
                  type="button"
                  disabled
                  aria-label="8 月 · 整理中"
                >
                  8 月
                </button>
              </div>
            </div>

            <section className="month-summary compact" aria-label="本月概览">
              <div className="summary-inline">
                <span className="month-label">
                  <span className="num">05</span> 月 · 春末夏初
                </span>
                <span className="dot"></span>
                <span className="tally">
                  <b>{baselineCount}</b> 基础卡 · <b>{eventCount}</b> 活动卡
                </span>
              </div>
            </section>

            <div className="section-head">
              <span className="tag">本月 {activities.length} 张卡</span>
              <span className="bar"></span>
            </div>

            <div className="tile-list" id="tile-list">
              {activities.map((activity, idx) => (
                <PathActivityTile
                  key={activity.id}
                  activity={activity}
                  index={idx}
                  total={activities.length}
                />
              ))}
            </div>

            {activities.length === 0 ? (
              <p
                style={{
                  padding: "0 22px 16px",
                  color: "var(--mute)",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                本月卡片整理中，先留个邮箱。6 月卡出来我们发给你。
              </p>
            ) : null}

            <PathInterestForm sourcePath="/path" />

            {!stage && process.env.NODE_ENV !== "production" ? (
              <p style={{ padding: 16, color: "#a00" }}>
                ⚠ PathStage 未 seed，跑 <code>bun run db:seed</code>
              </p>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
