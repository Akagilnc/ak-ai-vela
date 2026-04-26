/**
 * Copy quality — Slice 1: P1 UI surfaces
 *
 * Tests assert the DESIRED state. They fail against the current copy,
 * and pass once the copy is fixed.
 *
 * Three quality standards (content-quality-three-standards learning):
 *   1. Data correct — what we promise must be real
 *   2. Reasoning valid — every claim has a causal chain
 *   3. No AI slop — zero-information sentences removed
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

// Root is two levels up from src/__tests__/
const root = resolve(__dirname, "../..");

function src(relPath: string): string {
  return readFileSync(resolve(root, "src", relPath), "utf-8");
}

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------
describe("Landing page (app/page.tsx)", () => {
  const content = src("app/page.tsx");

  it("should not use 'AI 驱动' buzzword subtitle", () => {
    expect(content).not.toContain("AI 驱动");
  });

  it("should state a specific value proposition about understanding the child", () => {
    expect(content).toContain("先了解孩子，再规划美本申请");
  });
});

// ---------------------------------------------------------------------------
// Path overview
// ---------------------------------------------------------------------------
describe("Path overview (app/path/page.tsx)", () => {
  const content = src("app/path/page.tsx");

  it("should not show 'baseline' as visible Chinese-UI label in tally line", () => {
    // Current: "</b> baseline ·"  — English jargon leaked into user-facing copy
    expect(content).not.toContain("baseline ·");
  });

  it("should use '基础卡' for baseline card type label", () => {
    expect(content).toContain("基础卡");
  });

  it("should not use '活动卡' for event type (keep '活动卡' consistent)", () => {
    // This test verifies the replacement is '活动卡', not something else
    expect(content).toContain("活动卡");
  });

  it("should not append '点击进入' to the tile-count header", () => {
    // Generic call-to-action with zero information — tiles are already clickable
    expect(content).not.toContain("点击进入");
  });

  it("should not show 'G1' suffix in active month pill", () => {
    // 'G1' is ambiguous (Grade 1? Gap 1?); stage is already shown in stage-tabs
    expect(content).not.toMatch(/5\s*月\s*·\s*G1/);
  });
});

// ---------------------------------------------------------------------------
// Interest form
// ---------------------------------------------------------------------------
describe("Interest form (components/path/path-interest-form.tsx)", () => {
  const content = src("components/path/path-interest-form.tsx");

  it("should not use '单独联系你' (corporate email tone)", () => {
    expect(content).not.toContain("单独联系你");
  });

  it("should use a success message that echoes the CTA body promise", () => {
    // v0.2 multi-month: both CTA body and success message must be month-agnostic
    // (was '6 月卡出来发你' in v0.1, but reading "6 月卡出来发你" while ON
    // /path?month=6 is nonsense). Both strings genericized to "下次更新".
    expect(content).toContain("下次更新第一时间发你");
    expect(content).toContain("下次更新我们发给你");
  });

  it("should not hardcode any specific month name in user-facing copy", () => {
    // Same-shape guard: no "5 月卡" / "6 月卡" / "7 月卡" hardcoded promises
    // in the form. Promises tied to a specific month go stale the moment that
    // month ships — exactly the v0.1 → v0.2 drift we just fixed.
    expect(content).not.toMatch(/[0-9]+\s*月卡/);
  });
});

// ---------------------------------------------------------------------------
// Path error page
// ---------------------------------------------------------------------------
describe("Path error page (app/path/error.tsx)", () => {
  const content = src("app/path/error.tsx");

  it("should not use '卡片列表' (dry system label)", () => {
    expect(content).not.toContain("卡片列表");
  });

  it("should use '当月卡片' as the destination (specific, not the dry '卡片列表')", () => {
    // v0.2 multi-month: error.tsx is route-level so it doesn't know which
    // month the user came from. /path routes to current/fallback month, so
    // '当月' is honest and warmer than '卡片列表' (the v0.1 anti-target).
    expect(content).toContain("当月卡片");
  });

  it("back-button label should be '返回当月卡片' — clear destination", () => {
    expect(content).toContain("返回当月卡片");
  });
});
