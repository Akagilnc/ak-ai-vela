// @vitest-environment jsdom
import type { PathActivity } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { PathActivityTile } from "@/components/path/path-activity-tile";

function activity(slug: string, title = "立夏"): PathActivity {
  return {
    id: `${slug}-id`,
    slug,
    goalId: "goal-id",
    month: 5,
    cardType: "event",
    kicker: "事件卡",
    previews: [],
    title,
    summary: "<b>summary</b>",
    triggerLabel: "Trigger",
    triggerText: "trigger",
    chips: [
      { cls: "trigger", t: "周期" },
      { cls: "time", t: "1 小时" },
    ],
    timeText: "1 小时",
    timePct: "≤ 40%",
    sections: [],
    displayOrder: 1,
    createdAt: new Date("2026-05-01T00:00:00Z"),
    updatedAt: new Date("2026-05-01T00:00:00Z"),
  } as PathActivity;
}

describe("PathActivityTile", () => {
  it("links seeded May activities to their curated segment route", () => {
    render(
      <PathActivityTile
        activity={activity("g1-may-labor-day-holiday", "劳动节 5 天")}
        index={0}
        total={5}
      />,
    );

    expect(screen.getByRole("link", { name: "打开 劳动节 5 天" })).toHaveAttribute(
      "href",
      "/path/seg/g1-may-labor-holiday",
    );
  });

  it("keeps unmapped activities on the legacy detail route", () => {
    render(
      <PathActivityTile
        activity={activity("g1-jun-rainy-season", "六月雨季")}
        index={0}
        total={1}
      />,
    );

    expect(screen.getByRole("link", { name: "打开 六月雨季" })).toHaveAttribute(
      "href",
      "/path/g1-jun-rainy-season",
    );
  });
});
