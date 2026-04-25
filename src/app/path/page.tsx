import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PathActivityTile } from "@/components/path/path-activity-tile";
import { PathInterestForm } from "@/components/path/path-interest-form";
import { PathOverviewScrollRestore } from "@/components/path/path-overview-scroll-restore";
import { resolveMonth, monthSeason, pillRange } from "@/lib/path/month-routing";

type SearchParams = Promise<{ month?: string }>;

export default async function PathOverviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // v0.2: month-aware. Stage slug is still fixed to G1-G3; multi-stage routing
  // is deferred until a second stage is seeded.
  const stage = await prisma.pathStage.findFirst({
    where: { slug: "g1-to-g3-foundation" },
  });

  // Collect all months that have activity data under this stage.
  const availableMonthRows = stage
    ? await prisma.pathActivity.findMany({
        where: { goal: { stageId: stage.id } },
        select: { month: true },
        distinct: ["month"],
        orderBy: { month: "asc" },
      })
    : [];
  const availableMonths = availableMonthRows.map((r) => r.month);

  const resolvedMonth = resolveMonth(params.month, availableMonths);

  // Explicit bad param (?month=99, ?month=foo) → branded 404.
  // Guard: only 404 when the stage exists and the month param is genuinely
  // invalid. If stage is null (DB not seeded), fall through to empty state
  // so the dev-only seed warning renders instead of a dead 404.
  if (resolvedMonth === null && params.month !== undefined && stage !== null) {
    notFound();
  }

  const activities =
    stage && resolvedMonth !== null
      ? await prisma.pathActivity.findMany({
          where: { goal: { stageId: stage.id }, month: resolvedMonth },
          orderBy: [{ displayOrder: "asc" }, { slug: "asc" }],
        })
      : [];

  const baselineCount = activities.filter((a) => a.cardType === "baseline").length;
  const eventCount = activities.filter((a) => a.cardType === "event").length;

  const pills = pillRange(availableMonths);
  const activeMonth = resolvedMonth ?? 0; // 0 = no data, pills won't mark anything active

  // Zero-pad month number for the display label (e.g. 5 → "05", 12 → "12").
  const monthNumLabel = activeMonth > 0 ? String(activeMonth).padStart(2, "0") : "--";
  const seasonLabel = activeMonth > 0 ? monthSeason(activeMonth) : "整理中";

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
          </header>

          <main className="app-body" id="path-main">
            <PathOverviewScrollRestore />
            <section className="path-head">
              <h1>
                {/* TODO(Slice 3): derive theme title from goal data so each
                    month can carry its own theme name. For now the title stays
                    static — v0.1 only shipped May which has a fixed theme. */}
                小小<span className="accent">动物科学家</span>
              </h1>
            </section>

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
              <div className="months" aria-label="月份（左右滑动）">
                {pills.map((m) => {
                  const isActive = m === activeMonth;
                  const isAvailable = availableMonths.includes(m);

                  if (isActive) {
                    return (
                      <span key={m} className="m-pill" aria-current="page">
                        {m} 月
                      </span>
                    );
                  }

                  if (isAvailable) {
                    return (
                      <Link
                        key={m}
                        href={`/path?month=${m}`}
                        className="m-pill"
                        aria-label={`${m} 月`}
                      >
                        {m} 月
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={m}
                      className="m-pill"
                      data-status="ghost"
                      type="button"
                      disabled
                      aria-label={`${m} 月 · 整理中`}
                    >
                      {m} 月
                    </button>
                  );
                })}
              </div>
            </div>

            <section className="month-summary compact" aria-label="本月概览">
              <div className="summary-inline">
                <span className="month-label">
                  <span className="num">{monthNumLabel}</span> 月 · {seasonLabel}
                </span>
                {activeMonth > 0 && (
                  <>
                    <span className="dot"></span>
                    <span className="tally">
                      <b>{baselineCount}</b> 基础卡 · <b>{eventCount}</b> 活动卡
                    </span>
                  </>
                )}
              </div>
            </section>

            <div className="section-head">
              <span className="tag">
                {activeMonth > 0 ? `本月 ${activities.length} 张卡` : "卡片整理中"}
              </span>
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
