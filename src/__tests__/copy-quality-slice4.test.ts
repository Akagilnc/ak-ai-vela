/**
 * Copy quality — Slice 4: Questionnaire steps + gaps page
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

const root = resolve(__dirname, "../..");

function src(relPath: string): string {
  return readFileSync(resolve(root, "src", relPath), "utf-8");
}

const step1 = src("components/questionnaire/steps/step-1-basics.tsx");
const step3 = src("components/questionnaire/steps/step-3-academics.tsx");
const step5 = src("components/questionnaire/steps/step-5-activities.tsx");
const questionnairePage = src("app/questionnaire/page.tsx");
const completePage = src("app/questionnaire/complete/page.tsx");
const gapsPage = src("app/questionnaire/complete/gaps/page.tsx");

// ---------------------------------------------------------------------------
// Step subtitles: no AI-slop meta-commentary
// ---------------------------------------------------------------------------
describe("Step 3 subtitle: no slop placeholder", () => {
  it("should not use '每个孩子都有闪光点' (zero information on an academic form)", () => {
    // The subtitle appears above GPA/grade fields. "每个孩子都有闪光点" sounds
    // like defensive preamble — if every child has a "闪光点", the phrase
    // tells the user nothing. Replace with functional copy.
    expect(step3).not.toContain("每个孩子都有闪光点");
  });

  it("step-3 subtitle should tell the user what the step is about", () => {
    // The replacement should be informative, not just a feel-good phrase
    expect(step3).toMatch(/subtitle=".{2,}"/);
  });
});

describe("Step 1 subtitle: not a filler opener", () => {
  it("should not use '让我们先了解一下基本情况' (no-information filler)", () => {
    // The title "孩子基本信息" already tells the user what this step is.
    // "让我们先了解一下基本情况" adds nothing — replace with what the data is used for.
    expect(step1).not.toContain("让我们先了解一下基本情况");
  });
});

describe("Step 5 subtitle: not corporate '我们来看看'", () => {
  it("should not use '我们来看看孩子的特长和爱好' (imprecise + editorial voice)", () => {
    // "我们来看看" is corporate editorial. The title "课外活动" already covers it.
    // Replace with a functional hint about what to fill in.
    expect(step5).not.toContain("我们来看看孩子的特长和爱好");
  });
});

// ---------------------------------------------------------------------------
// Questionnaire intro page
// ---------------------------------------------------------------------------
describe("Questionnaire intro page (app/questionnaire/page.tsx)", () => {
  it("should not use '可执行的' modifier (slop adjective — all useful analysis is actionable)", () => {
    expect(questionnairePage).not.toContain("可执行的");
  });

  it("intro subtitle should specify what the report covers (not just '差距分析' in isolation)", () => {
    // "差距分析" alone is too abstract. Must tell the user what dimension: 各学校 / 录取.
    expect(questionnairePage).toMatch(/学校.*报告|录取.*差距|差距.*报告/);
  });
});

// ---------------------------------------------------------------------------
// Complete page
// ---------------------------------------------------------------------------
describe("Complete page (app/questionnaire/complete/page.tsx)", () => {
  it("should not claim '我们已经了解了' (presumptuous — form collected data, not deep understanding)", () => {
    // "我们已经了解了 {childName} 的情况" implies the system deeply understands
    // the child, but it collected 8 form fields. Overstates what happened.
    expect(completePage).not.toContain("我们已经了解了");
  });
});

// ---------------------------------------------------------------------------
// Complete page: terminology consistency
// The intro page (questionnaire/page.tsx) calls the output "录取差距报告".
// The complete page button says "查看差距分析". The paragraph must not use
// a third synonym "匹配分析" — three names for the same output in the same
// user flow creates unnecessary confusion.
// ---------------------------------------------------------------------------
describe("Complete page: consistent '差距' terminology (not '匹配分析')", () => {
  it("should not call the output '匹配分析' on the complete page (button on same page says '差距分析')", () => {
    expect(completePage).not.toContain("匹配分析");
  });
});

// ---------------------------------------------------------------------------
// Gaps page: regression fence for Slice 2 copy change
// The pill text logic in gaps/page.tsx used to check r.action.includes("不要求")
// to identify test-free schools. Slice 2 changed the copy to use "非必须"
// so the check must be updated to match.
// ---------------------------------------------------------------------------
describe("Gaps page: pill text regression fence (Slice 2 sync)", () => {
  it("should not check for the old '不要求' string in pill text logic", () => {
    // After Slice 2, SAT/ACT test-free copy uses "非必须" not "不要求".
    // Checking for "不要求" would make all test-free schools show "暂无" instead
    // of "免试" — silent wrong label that's hard to catch without this test.
    expect(gapsPage).not.toContain('includes("不要求")');
  });

  it("should check for '非必须' in pill text logic to identify test-free schools", () => {
    expect(gapsPage).toContain('includes("非必须")');
  });

  it("sat test-free recommendation contains '非必须' (verifies r.action source is hardcoded)", () => {
    // r.action is the return value of getRecommendation() in recommendations.ts,
    // which is a hardcoded in-memory lookup (NOT a DB string). This test verifies
    // the full chain: test-free reason → recommendations.ts returns "非必须" →
    // gaps/page.tsx pill check finds "非必须" → shows "免试".
    // If recommendations.ts changes the copy again, this test breaks first.
    const recs = src("lib/gap/recommendations.ts");
    expect(recs).toContain("非必须");
    expect(recs).not.toContain("不要求");
  });

  it("recommendations should not contain '未公布' (dead pill-text branch removed — regression fence)", () => {
    // The '未公布' pill-text branch was removed from gaps/page.tsx in this branch
    // because no recommendation path ever produced that string. This test ensures
    // no future recommendation accidentally introduces '未公布', which would now
    // silently fall through to '暂无' instead of displaying correctly.
    const recs = src("lib/gap/recommendations.ts");
    expect(recs).not.toContain("未公布");
  });
});
