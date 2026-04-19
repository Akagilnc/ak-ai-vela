import { prisma } from "@/lib/prisma";
import { PathActivityTile } from "@/components/path/path-activity-tile";
import { PathInterestForm } from "@/components/path/path-interest-form";
import { MoreIcon } from "@/components/path/path-icons";

export default async function PathOverviewPage() {
  // v0.1: single stage (G1-G3), single month (5), all activities ordered by displayOrder.
  // Future: stage/month selectors drive these query params.
  const stage = await prisma.pathStage.findFirst({
    where: { slug: "g1-to-g3-foundation" },
  });

  const activities = await prisma.pathActivity.findMany({
    orderBy: { displayOrder: "asc" },
  });

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
            <button className="icon-btn" aria-label="更多" type="button">
              <MoreIcon />
            </button>
          </header>

          <div className="app-body">
            <section className="path-head">
              <h1>
                小小<span className="accent">动物科学家</span>
              </h1>
            </section>

            <div className="stage-tabs" role="tablist" aria-label="阶段">
              <button aria-current="true" role="tab" type="button">
                <span className="t">G1–G3 · 一~三年级</span>
                <span className="s">好奇心扎根</span>
              </button>
              <button disabled role="tab" aria-disabled="true" type="button">
                <span className="t">G4–G6 · 四~六年级</span>
                <span className="s">目的性探索</span>
              </button>
              <button disabled role="tab" aria-disabled="true" type="button">
                <span className="t">G7–G9 · 初中</span>
                <span className="s">理解转换</span>
              </button>
            </div>

            <div className="month-scroll compact">
              <div className="months" role="tablist" aria-label="月份（左右滑动）">
                <button className="m-pill" data-status="ghost" type="button">
                  3 月
                </button>
                <button className="m-pill" data-status="ghost" type="button">
                  4 月
                </button>
                <button className="m-pill" aria-current="true" type="button">
                  5 月 · G1
                </button>
                <button className="m-pill" data-status="ghost" type="button">
                  6 月
                </button>
                <button className="m-pill" data-status="ghost" type="button">
                  7 月
                </button>
                <button className="m-pill" data-status="ghost" type="button">
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
                  <b>{baselineCount}</b> baseline · <b>{eventCount}</b> 事件卡
                </span>
              </div>
            </section>

            <div className="section-head">
              <span className="tag">本月 {activities.length} 张卡 · 点击进入</span>
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

            <PathInterestForm sourcePath="/path" />

            {stage ? null : (
              <p style={{ padding: 16, color: "#a00" }}>
                ⚠ PathStage 未 seed，跑 <code>bun run db:seed</code>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
