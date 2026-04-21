/**
 * Copy quality — Slice 3: Trait quiz UI strings
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

const quizPage = src("app/trait-quiz/page.tsx");
const resultPage = src("app/trait-quiz/result/[routeId]/page.tsx");
const insightComponent = src("components/trait-quiz/trait-insight.tsx");

// ---------------------------------------------------------------------------
// Quiz welcome screen
// ---------------------------------------------------------------------------
describe("Quiz welcome screen (app/trait-quiz/page.tsx)", () => {
  it("welcome subtitle should not use '专属的' buzzword", () => {
    // "专属的分阶段规划路线图" — this route is a 24-entry lookup table, not
    // truly bespoke. Calling it "专属的" is technically correct but identical
    // to every AI-product welcome screen. Replace with a concrete description.
    expect(quizPage).not.toContain("专属的分阶段");
  });

  it("loading text should not use '专属画像'", () => {
    // "正在为你生成专属画像..." — "专属" has become a zero-info filler.
    // "画像" is already specific enough.
    expect(quizPage).not.toContain("专属画像");
  });

  it("welcome subtitle should not claim '了解孩子的特质' (over-promises)", () => {
    // "特质" carries psychological connotation (trait/temperament) but the quiz
    // only measures interest × interest-detail × learning-drive. Using "特质"
    // sets expectations the 10-question lookup cannot meet.
    expect(quizPage).not.toContain("了解孩子的特质");
  });

  it("welcome subtitle should not claim '规划路线图' (implies deep customisation)", () => {
    // The output is a 24-route lookup table, not a custom-generated plan.
    // "成长规划路线图" implies a level of personalisation that doesn't exist.
    expect(quizPage).not.toContain("规划路线图");
  });

  it("welcome subtitle should still tell the user what they'll receive", () => {
    // Make sure the replacement still tells the user what they'll get
    expect(quizPage).toMatch(/路线|建议/);
  });
});

// ---------------------------------------------------------------------------
// Result page
// ---------------------------------------------------------------------------
describe("Result page (app/trait-quiz/result/[routeId]/page.tsx)", () => {
  it("should not use '由 Vela 提供' as footer (zero information, sounds corporate)", () => {
    // "由 Vela 提供" is the kind of footer that adds no value — user already
    // knows they're in the Vela app. Remove or replace with something actionable.
    expect(resultPage).not.toContain("由 Vela 提供");
  });
});

// ---------------------------------------------------------------------------
// Insight component
// ---------------------------------------------------------------------------
describe("Trait insight component (components/trait-quiz/trait-insight.tsx)", () => {
  it("transition text should mention what the next questions cover", () => {
    // "接下来几个问题帮我们更深入了解学习方式" is informative — keep it.
    // This test ensures the instruction remains present in the component.
    expect(insightComponent).toContain("学习");
  });
});

// ---------------------------------------------------------------------------
// "学习风格" must not appear in the welcome subtitle
// The project's scientific direction (no-diy-trait-framework) explicitly
// excludes learning-style models (VARK / Kolb). The quiz doesn't measure
// VARK-style modality preferences — it measures interest, learning drive,
// and social preferences. Using "学习风格" sets expectations the system
// cannot meet and references a discredited pseudoscientific framework.
// ---------------------------------------------------------------------------
describe("Quiz welcome subtitle: no '学习风格' pseudoscience term", () => {
  it("welcome subtitle should not claim '学习风格' (VARK/Kolb excluded by project direction)", () => {
    expect(quizPage).not.toContain("学习风格");
  });

  it("welcome subtitle should still describe what the quiz measures", () => {
    // After removing "学习风格", replacement must still tell the user what
    // they'll learn about the child. "兴趣" alone or a specific alternative
    // for the learning dimension is required.
    expect(quizPage).toMatch(/兴趣.{0,20}(特点|节奏|方式|特质|成长)/);
  });
});
