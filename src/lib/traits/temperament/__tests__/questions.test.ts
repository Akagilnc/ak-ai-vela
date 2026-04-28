/**
 * Tests for the 30-item temperament question seed.
 *
 * Spec: research notes Section 6 — 5 core dims × 4 questions + 4 nuance dims × 2-3 questions.
 *
 * Per-question metadata:
 *   - id: stable schema key
 *   - dimensionId: which of 9 dims this question loads onto
 *   - prompt: behavioral, specific Chinese copy (no AI slop, no abstract personality)
 *   - reverseScored: true if 5=easy pole, false if 5=hard pole
 *     (encoder/scorer flips reversed items so dim score normalizes
 *      with attention pole convention: high score = hard pole)
 *
 * Per dim, raw answers averaged → dim score 1-5. quantized via
 * quantizeDimScores() before classify (slice 2 invariant).
 */
import { describe, expect, it } from "vitest";
import {
  computeDimScores,
  QUESTIONS,
  QUESTIONS_BY_DIM,
  type Question,
} from "../questions";
import { DIMENSION_LIST, DIMENSION_META } from "../dimensions";

describe("QUESTIONS seed — structure", () => {
  it("has between 28 and 32 questions (target: ~30)", () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(28);
    expect(QUESTIONS.length).toBeLessThanOrEqual(32);
  });

  it("every question has unique id", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(QUESTIONS.length);
  });

  it("every question's dimensionId is in DIMENSION_LIST", () => {
    const validDims = new Set(DIMENSION_LIST.map((d) => d.id));
    for (const q of QUESTIONS) {
      expect(validDims.has(q.dimensionId)).toBe(true);
    }
  });

  it("every question has non-empty Chinese prompt", () => {
    for (const q of QUESTIONS) {
      expect(q.prompt.length).toBeGreaterThan(8); // meaningful length
      expect(q.prompt).toMatch(/[一-龥]/); // contains Chinese
    }
  });

  it("every prompt is unique (no copy-paste)", () => {
    const prompts = QUESTIONS.map((q) => q.prompt);
    expect(new Set(prompts).size).toBe(QUESTIONS.length);
  });
});

describe("QUESTIONS seed — dim coverage", () => {
  function questionsForDim(dimId: string): Question[] {
    return QUESTIONS.filter((q) => q.dimensionId === dimId);
  }

  it("every 9 dim has at least 2 questions", () => {
    for (const dim of DIMENSION_LIST) {
      const qs = questionsForDim(dim.id);
      expect(qs.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("5 core dims have at least 3 questions each (more reliability)", () => {
    const cores = DIMENSION_LIST.filter((d) => d.isCore);
    for (const dim of cores) {
      const qs = questionsForDim(dim.id);
      expect(qs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("4 nuance dims have 2-3 questions each", () => {
    const nuance = DIMENSION_LIST.filter((d) => !d.isCore);
    for (const dim of nuance) {
      const qs = questionsForDim(dim.id);
      expect(qs.length).toBeGreaterThanOrEqual(2);
      expect(qs.length).toBeLessThanOrEqual(3);
    }
  });

  it("dims with ≥3 questions have BOTH forward and reverse-scored items (response set bias mitigation)", () => {
    for (const dim of DIMENSION_LIST) {
      const qs = questionsForDim(dim.id);
      if (qs.length < 3) continue; // 2-question dims may legitimately be all-forward
      const hasReverse = qs.some((q) => q.reverseScored);
      const hasForward = qs.some((q) => !q.reverseScored);
      // Codex-caught bug: original was `hasReverse || hasForward` which is
      // always true for non-empty arrays. Real check is BOTH must be true.
      expect(hasReverse).toBe(true);
      expect(hasForward).toBe(true);
    }
  });
});

describe("QUESTIONS seed — copy quality (forbidden phrases + behavioral specificity)", () => {
  // v0.5 13-round review distilled forbidden phrases
  const FORBIDDEN_SLOP = [
    "看起来",
    "充满好奇心",
    "如鱼得水",
    "沉迷其中",
    "你娃外向",
    "你娃内向",
  ];
  // Forbidden academic labels (v0.6 must use 灵活/慎重/慢热/平衡)
  const FORBIDDEN_ACADEMIC = ["困难型", "迟缓型", "容易型", "中间型"];

  it.each(FORBIDDEN_SLOP)(
    "no question prompt contains slop phrase '%s'",
    (phrase) => {
      for (const q of QUESTIONS) {
        expect(q.prompt).not.toContain(phrase);
      }
    },
  );

  it.each(FORBIDDEN_ACADEMIC)(
    "no question prompt contains academic label '%s'",
    (label) => {
      for (const q of QUESTIONS) {
        expect(q.prompt).not.toContain(label);
      }
    },
  );

  it("prompts mention specific observable behaviors (not abstract traits)", () => {
    // Heuristic: at least 60% of prompts mention concrete situations or
    // verbs (e.g. "新公园" "玩具" "陌生人" "睡觉" "吃饭" "拼图" "画画").
    const concreteMarkers = [
      "新", "公园", "玩具", "陌生", "睡", "吃", "拼", "画", "声音",
      "陪", "玩", "学校", "老师", "同学", "球", "家", "路", "门",
      "屋", "笑", "哭", "气", "动", "跑", "坐", "站", "走", "看",
      "听", "说", "做", "想", "等", "换", "穿", "脱", "拿", "放",
      "打开", "关上", "进", "出",
    ];
    let concrete = 0;
    for (const q of QUESTIONS) {
      if (concreteMarkers.some((m) => q.prompt.includes(m))) concrete++;
    }
    expect(concrete / QUESTIONS.length).toBeGreaterThanOrEqual(0.6);
  });

  it("prompts avoid abstract personality terms (外向, 内向, 害羞, 难缠)", () => {
    const ABSTRACT = ["外向", "内向", "害羞", "难缠", "性格"];
    for (const q of QUESTIONS) {
      for (const term of ABSTRACT) {
        expect(q.prompt).not.toContain(term);
      }
    }
  });

  it("prompts use 她/他 not 孩子 (specific to user's child)", () => {
    // At least 70% of prompts should use 她 (default per V8 mockup with
    // Kailing's daughter). Some may legitimately use 孩子 for general phrasing.
    let withPronoun = 0;
    for (const q of QUESTIONS) {
      if (q.prompt.includes("她") || q.prompt.includes("他")) withPronoun++;
    }
    expect(withPronoun / QUESTIONS.length).toBeGreaterThanOrEqual(0.7);
  });
});

describe("QUESTIONS_BY_DIM — grouping", () => {
  it("every dim has its question list", () => {
    expect(Object.keys(QUESTIONS_BY_DIM).length).toBe(9);
  });

  it("grouped lists sum to QUESTIONS total", () => {
    let total = 0;
    for (const dim of Object.keys(QUESTIONS_BY_DIM)) {
      total += QUESTIONS_BY_DIM[dim as keyof typeof QUESTIONS_BY_DIM].length;
    }
    expect(total).toBe(QUESTIONS.length);
  });
});

describe("computeDimScores — reverse scoring + averaging", () => {
  function fillAll(value: number): Record<string, number> {
    return Object.fromEntries(QUESTIONS.map((q) => [q.id, value]));
  }

  it("all answers = 3 → all dim scores = 3 (midpoint stable)", () => {
    const scores = computeDimScores(fillAll(3));
    for (const dim of Object.keys(scores)) {
      expect(scores[dim as keyof typeof scores]).toBe(3);
    }
  });

  it("all answers = 5: reverse-scored items flip → dim score reflects attentionPole-aligned average", () => {
    // Each dim has mix of forward + reverse. With all answers=5:
    // - Forward (5 = hard pole) contributes 5
    // - Reverse-scored (5 = easy pole, flipped to 1) contributes 1
    // Dim score = (5*forward + 1*reverse) / total
    const scores = computeDimScores(fillAll(5));
    for (const dim of Object.keys(QUESTIONS_BY_DIM)) {
      const qs = QUESTIONS_BY_DIM[dim as keyof typeof QUESTIONS_BY_DIM];
      const fwd = qs.filter((q) => !q.reverseScored).length;
      const rev = qs.filter((q) => q.reverseScored).length;
      const expected = (fwd * 5 + rev * 1) / qs.length;
      expect(scores[dim as keyof typeof scores]).toBeCloseTo(expected, 5);
    }
  });

  it("all answers = 1: reverse-scored items flip → dim score = (1*fwd + 5*rev) / total", () => {
    const scores = computeDimScores(fillAll(1));
    for (const dim of Object.keys(QUESTIONS_BY_DIM)) {
      const qs = QUESTIONS_BY_DIM[dim as keyof typeof QUESTIONS_BY_DIM];
      const fwd = qs.filter((q) => !q.reverseScored).length;
      const rev = qs.filter((q) => q.reverseScored).length;
      const expected = (fwd * 1 + rev * 5) / qs.length;
      expect(scores[dim as keyof typeof scores]).toBeCloseTo(expected, 5);
    }
  });

  it("throws when any question is unanswered", () => {
    const partial = fillAll(3);
    delete partial[QUESTIONS[0].id];
    expect(() => computeDimScores(partial)).toThrow(/unanswered/);
  });

  it("throws on out-of-range raw answer (0 or 6 or NaN)", () => {
    const tooLow = fillAll(3);
    tooLow[QUESTIONS[0].id] = 0;
    expect(() => computeDimScores(tooLow)).toThrow(/out-of-range/);

    const tooHigh = fillAll(3);
    tooHigh[QUESTIONS[0].id] = 6;
    expect(() => computeDimScores(tooHigh)).toThrow(/out-of-range/);

    const nan = fillAll(3);
    nan[QUESTIONS[0].id] = NaN;
    expect(() => computeDimScores(nan)).toThrow(/out-of-range/);
  });

  it("integrates with classify pipeline (slice 2 invariant)", async () => {
    const { classify } = await import("../score");
    const { quantizeDimScores } = await import("../score-encoding");

    // Construct 慎重型 fixture: target dim scores (rhy=1, app=5, ada=1, int=5, moo=1).
    // Per-dim target depends on whether dim score 5 means hard or easy
    // (see CLASSIFICATION_CONFIG highIsHardPole logic):
    //   - rhy/ada/moo dim score 5 = easy → target 1 for max difficulty
    //   - app/int dim score 5 = hard → target 5
    const dimTargets: Record<string, number> = {
      rhythmicity: 1, // dim natural = regularity (easy=high). target irregular = 1
      approach: 5, // dim convention = withdrawal = 5 (per spec footnote 9)
      adaptability: 1,
      intensity: 5,
      mood: 1,
      // nuance dims at midpoint (don't affect classify)
      activityLevel: 3,
      threshold: 3,
      distractibility: 3,
      persistence: 3,
    };

    const answers: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const target = dimTargets[q.dimensionId];
      // To produce aligned=target: raw = reverseScored ? 6-target : target
      answers[q.id] = q.reverseScored ? 6 - target : target;
    }

    const dims = computeDimScores(answers);
    expect(dims.rhythmicity).toBe(1);
    expect(dims.approach).toBe(5);
    expect(dims.adaptability).toBe(1);
    expect(dims.intensity).toBe(5);
    expect(dims.mood).toBe(1);

    const quantized = quantizeDimScores(dims);
    const result = classify({
      scores: quantized,
      lowConfidenceFlag: false,
    });
    expect(result.type).toBe("慎重型");
    expect(result.confidence).toBe("high");
  });

  it("full roundtrip: computeDim → quantize → encode → decodeAndClassify (chain invariant)", async () => {
    const { quantizeDimScores, encodeScore, decodeAndClassifyScore } =
      await import("../score-encoding");

    // 慎重型 fixture per integration test above
    const dimTargets: Record<string, number> = {
      rhythmicity: 1, approach: 5, adaptability: 1, intensity: 5, mood: 1,
      activityLevel: 3, threshold: 3, distractibility: 3, persistence: 3,
    };
    const answers: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const target = dimTargets[q.dimensionId];
      answers[q.id] = q.reverseScored ? 6 - target : target;
    }

    const dims = computeDimScores(answers);
    const quantized = quantizeDimScores(dims);
    const url = encodeScore({
      schemaVersion: 1,
      cutoffVersion: 1,
      dims: quantized,
      lowConfidenceFlag: false,
    });
    const decoded = decodeAndClassifyScore(url);
    if ("error" in decoded) throw new Error("decode failed");

    expect(decoded.type).toBe("慎重型");
    expect(decoded.confidence).toBe("high");
    expect(decoded.dims).toEqual(quantized);
  });

  it("constructs 灵活型 fixture: easy-pole-loaded core dims + low intensity", async () => {
    const { classify } = await import("../score");
    const { quantizeDimScores } = await import("../score-encoding");

    // 灵活型: rhy=5 (regular), app=1 (approach), ada=5 (adapts), int=1 (mild), moo=5 (positive)
    const dimTargets: Record<string, number> = {
      rhythmicity: 5,
      approach: 1,
      adaptability: 5,
      intensity: 1,
      mood: 5,
      activityLevel: 3,
      threshold: 3,
      distractibility: 3,
      persistence: 3,
    };

    const answers: Record<string, number> = {};
    for (const q of QUESTIONS) {
      const target = dimTargets[q.dimensionId];
      answers[q.id] = q.reverseScored ? 6 - target : target;
    }

    const dims = computeDimScores(answers);
    const quantized = quantizeDimScores(dims);
    const result = classify({
      scores: quantized,
      lowConfidenceFlag: false,
    });
    expect(result.type).toBe("灵活型");
  });
});
