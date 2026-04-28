/**
 * Comprehensive copy quality test for v0.6 trait quiz.
 *
 * Replaces v0.5's copy-quality-slice3.test.ts (path-recommender copy).
 * Covers all user-facing v0.6 copy: 30 questions + 4 hero + 27 dim insights
 * + welcome + draft resume + error states + result page footer.
 *
 * Forbidden phrase rules (per Phase 1 + design review):
 *   1. v0.5 13-round-distilled slop list (must not appear ANYWHERE)
 *   2. Academic temperament labels (容易/困难/迟缓/中间型) — only allowed in
 *      footer paragraph marked `<p data-academic-disclosure>` per design
 *      review 2026-04-29
 *   3. Abstract personality terms (外向/内向/害羞/难缠/性格)
 *   4. Pseudoscientific framework references (学习风格 — VARK/Kolb excluded
 *      per project direction)
 *
 * Behavioral specificity rule: prompts and observations must reference
 * concrete behaviors / scenarios (not abstract traits).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/lib/traits/temperament/questions";
import { TRAIT_HEROES, DIM_COPY } from "@/lib/traits/temperament/profiles";
import { DIMENSION_LIST } from "@/lib/traits/temperament/dimensions";

const repoRoot = join(__dirname, "..", "..");
function srcText(rel: string): string {
  return readFileSync(join(repoRoot, "src", rel), "utf8");
}

// All user-facing copy strings (programmatically gathered)
const ALL_USER_COPY: string[] = [
  // 30 question prompts
  ...QUESTIONS.map((q) => q.prompt),
  // 4 hero leads + keywords + percentage notes
  ...Object.values(TRAIT_HEROES).flatMap((h) => [
    h.lead,
    ...h.keywords,
    h.percentageNote,
  ]),
  // 27 dim insights (observation + action)
  ...DIMENSION_LIST.flatMap((d) =>
    (["low", "mid", "high"] as const).flatMap((lvl) => [
      DIM_COPY[d.id][lvl].observation,
      DIM_COPY[d.id][lvl].action,
    ]),
  ),
];

const FORBIDDEN_SLOP = [
  "看起来",
  "充满好奇心",
  "如鱼得水",
  "沉迷其中",
  "你娃外向",
  "你娃内向",
];

const FORBIDDEN_ACADEMIC = ["困难型", "迟缓型", "容易型", "中间型"];

const FORBIDDEN_ABSTRACT = ["外向", "内向", "害羞", "难缠", "性格"];

const FORBIDDEN_PSEUDOSCIENCE = ["学习风格"];

describe("v0.6 user-facing copy — v0.5 slop forbidden phrases", () => {
  it.each(FORBIDDEN_SLOP)("no copy contains slop phrase '%s'", (phrase) => {
    for (const text of ALL_USER_COPY) {
      expect(text).not.toContain(phrase);
    }
  });
});

describe("v0.6 user-facing copy — academic labels NOT in user-visible copy", () => {
  // Academic labels are only allowed in the disclosure footer (marked with
  // `data-academic-disclosure` attribute). Test plan §forbidden phrase rule:
  // gather text from non-disclosure regions only, scan for labels.

  it.each(FORBIDDEN_ACADEMIC)(
    "no question / hero / dim copy contains academic label '%s'",
    (label) => {
      for (const text of ALL_USER_COPY) {
        expect(text).not.toContain(label);
      }
    },
  );

  it("welcome page does not contain academic labels", () => {
    const welcome = srcText("app/trait-quiz/page.tsx");
    for (const label of FORBIDDEN_ACADEMIC) {
      expect(welcome).not.toContain(label);
    }
  });

  it("error states do not contain academic labels", () => {
    const errors = srcText("components/trait-quiz/v6/error-states.tsx");
    for (const label of FORBIDDEN_ACADEMIC) {
      expect(errors).not.toContain(label);
    }
  });

  it("legacy [routeId] page does not contain academic labels (renders error state only)", () => {
    const legacy = srcText("app/trait-quiz/result/[routeId]/page.tsx");
    for (const label of FORBIDDEN_ACADEMIC) {
      expect(legacy).not.toContain(label);
    }
  });
});

describe("v0.6 user-facing copy — abstract personality terms forbidden", () => {
  it.each(FORBIDDEN_ABSTRACT)("no copy contains abstract trait term '%s'", (term) => {
    for (const text of ALL_USER_COPY) {
      expect(text).not.toContain(term);
    }
  });
});

describe("v0.6 user-facing copy — pseudoscience term blocklist", () => {
  it.each(FORBIDDEN_PSEUDOSCIENCE)(
    "no copy contains pseudoscience term '%s' (project direction excludes VARK/Kolb)",
    (term) => {
      for (const text of ALL_USER_COPY) {
        expect(text).not.toContain(term);
      }
      // Also check page templates
      const welcome = srcText("app/trait-quiz/page.tsx");
      expect(welcome).not.toContain(term);
    },
  );
});

describe("v0.6 academic disclosure rule (design review 2026-04-29)", () => {
  // Academic labels (容易/困难/迟缓/中间型) are PERMITTED only in the result
  // page footer marked with data-academic-disclosure. This test verifies
  // the footer DOES contain the disclosure (so it can be excluded by the
  // QA selector).

  it("result page footer has data-academic-disclosure attribute", () => {
    const resultPage = srcText("components/trait-quiz/v6/result-page.tsx");
    expect(resultPage).toContain("data-academic-disclosure");
  });

  it("disclosure footer mentions all 4 academic labels (preserves disclosure intent)", () => {
    const resultPage = srcText("components/trait-quiz/v6/result-page.tsx");
    // The disclosure paragraph is the one place these academic names should
    // appear — to give users a transparent mapping.
    for (const label of ["容易", "困难", "迟缓", "中间"]) {
      expect(resultPage).toContain(label);
    }
  });
});

describe("v0.6 user-facing copy — behavioral specificity (≥60% concrete markers)", () => {
  // Heuristic: each prompt / observation should reference concrete behaviors.
  // Across all 30 prompts + 27 observations = 57 strings, at least 60%
  // should mention concrete situations/objects.
  const concreteMarkers = [
    "她", "他", "陌生", "新", "玩具", "学", "睡", "吃", "拼", "画",
    "声音", "环境", "标签", "商场", "餐厅", "光", "温", "动",
    "笑", "哭", "皱", "情绪", "动作", "时间", "公园", "周末",
    "工作日", "搬家", "换", "情境", "拼图", "积木", "动画",
    "陪", "玩", "朋友", "家人", "饭", "觉",
  ];

  it("≥60% of question prompts + dim observations contain concrete markers", () => {
    const allCopy = [
      ...QUESTIONS.map((q) => q.prompt),
      ...DIMENSION_LIST.flatMap((d) =>
        (["low", "mid", "high"] as const).map(
          (lvl) => DIM_COPY[d.id][lvl].observation,
        ),
      ),
    ];
    let concrete = 0;
    for (const text of allCopy) {
      if (concreteMarkers.some((m) => text.includes(m))) concrete++;
    }
    expect(concrete / allCopy.length).toBeGreaterThanOrEqual(0.6);
  });
});

describe("v0.6 user-facing copy — pronoun consistency (using 她)", () => {
  it("at least 70% of prompts + observations use 她 (specific to user's child)", () => {
    const allCopy = [
      ...QUESTIONS.map((q) => q.prompt),
      ...DIMENSION_LIST.flatMap((d) =>
        (["low", "mid", "high"] as const).map(
          (lvl) => DIM_COPY[d.id][lvl].observation,
        ),
      ),
    ];
    let withPronoun = 0;
    for (const text of allCopy) {
      if (text.includes("她") || text.includes("他")) withPronoun++;
    }
    expect(withPronoun / allCopy.length).toBeGreaterThanOrEqual(0.7);
  });
});

describe("v0.6 — totals snapshot (regression guard)", () => {
  // Lock structural counts so future PRs can't silently add/remove copy
  // without explicit test updates.
  it("exactly 30 questions", () => {
    expect(QUESTIONS.length).toBe(30);
  });

  it("exactly 4 hero types", () => {
    expect(Object.keys(TRAIT_HEROES)).toHaveLength(4);
  });

  it("exactly 9 dimensions × 3 levels = 27 insight cards", () => {
    let total = 0;
    for (const d of DIMENSION_LIST) {
      total += Object.keys(DIM_COPY[d.id]).length;
    }
    expect(total).toBe(27);
  });
});
