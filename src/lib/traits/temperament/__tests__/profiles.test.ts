/**
 * Tests for v0.6 trait copy: 4 type heros + 9 dim insights + smart picks.
 */
import { describe, expect, it } from "vitest";
import {
  TRAIT_HEROES,
  DIM_COPY,
  getDimLevel,
  getDimInsight,
  pickInsightDims,
} from "../profiles";
import { DIMENSION_LIST } from "../dimensions";
import type { TraitType } from "../score";

describe("TRAIT_HEROES — 4 type hero copy", () => {
  const TYPES: TraitType[] = ["灵活型", "慎重型", "慢热型", "平衡型"];

  it.each(TYPES)("hero exists for %s with required fields", (t) => {
    const hero = TRAIT_HEROES[t];
    expect(hero.type).toBe(t);
    expect(hero.lead.length).toBeGreaterThan(50);
    expect(hero.percentageNote).toMatch(/%/);
    expect(hero.keywords.length).toBeGreaterThanOrEqual(2);
    expect(hero.tint).toMatch(/^(easy|notable|strong|balanced)$/);
  });

  it("no hero contains v0.5 forbidden phrases", () => {
    const FORBIDDEN = [
      "看起来",
      "充满好奇心",
      "如鱼得水",
      "沉迷其中",
      "你娃外向",
      "你娃内向",
    ];
    for (const t of TYPES) {
      const hero = TRAIT_HEROES[t];
      const allText = `${hero.lead} ${hero.keywords.join(" ")} ${hero.percentageNote}`;
      for (const phrase of FORBIDDEN) {
        expect(allText).not.toContain(phrase);
      }
    }
  });

  it("no hero contains academic labels (per Phase 1 disclosure rule)", () => {
    const ACADEMIC = ["困难型", "迟缓型", "容易型", "中间型"];
    for (const t of TYPES) {
      const hero = TRAIT_HEROES[t];
      const text = hero.lead + hero.percentageNote;
      for (const label of ACADEMIC) {
        expect(text).not.toContain(label);
      }
    }
  });

  it("慎重型 hero inlines difficulty signals (R1#3 P0 from design review)", () => {
    const lead = TRAIT_HEROES["慎重型"].lead;
    // Must mention sensitivity OR strong emotion OR slow adaptation
    expect(
      /敏感|外显|强烈|判断|耐心|预告/.test(lead),
    ).toBe(true);
  });

  it("平衡型 hero anti-narrative ('不等于没特点')", () => {
    const lead = TRAIT_HEROES["平衡型"].lead;
    expect(lead).toMatch(/不等于|不是|均衡/);
  });
});

describe("DIM_COPY — 9 dim × 3 level insights", () => {
  it("every 9 dim has copy for low / mid / high levels", () => {
    for (const dim of DIMENSION_LIST) {
      const copy = DIM_COPY[dim.id];
      expect(copy.low.observation).toBeTruthy();
      expect(copy.low.action).toBeTruthy();
      expect(copy.mid.observation).toBeTruthy();
      expect(copy.mid.action).toBeTruthy();
      expect(copy.high.observation).toBeTruthy();
      expect(copy.high.action).toBeTruthy();
    }
  });

  it("every action starts with → arrow (consistent format)", () => {
    for (const dim of DIMENSION_LIST) {
      const copy = DIM_COPY[dim.id];
      for (const level of ["low", "mid", "high"] as const) {
        expect(copy[level].action.trim().startsWith("→")).toBe(true);
      }
    }
  });

  it("no dim insight contains forbidden phrases", () => {
    const FORBIDDEN = ["看起来", "充满好奇心", "如鱼得水", "沉迷其中"];
    for (const dim of DIMENSION_LIST) {
      const copy = DIM_COPY[dim.id];
      for (const level of ["low", "mid", "high"] as const) {
        const text = copy[level].observation + copy[level].action;
        for (const phrase of FORBIDDEN) {
          expect(text).not.toContain(phrase);
        }
      }
    }
  });

  it("observations are specific (mention concrete behaviors / scenarios)", () => {
    // Heuristic: each observation should mention at least one concrete marker
    const concreteMarkers = [
      "她", "他", "陌生", "新", "玩具", "学", "睡", "吃", "拼", "画",
      "声音", "环境", "标签", "商场", "餐厅", "光", "温", "动",
      "笑", "哭", "皱", "情绪", "动作", "时间", "公园",
    ];
    for (const dim of DIMENSION_LIST) {
      const copy = DIM_COPY[dim.id];
      for (const level of ["low", "mid", "high"] as const) {
        const obs = copy[level].observation;
        const hasConcrete = concreteMarkers.some((m) => obs.includes(m));
        expect(hasConcrete).toBe(true);
      }
    }
  });
});

describe("getDimLevel — score bucketing", () => {
  it("score 1, 2 → low", () => {
    expect(getDimLevel(1)).toBe("low");
    expect(getDimLevel(2)).toBe("low");
  });
  it("score 3 → mid", () => {
    expect(getDimLevel(3)).toBe("mid");
  });
  it("score 4, 5 → high", () => {
    expect(getDimLevel(4)).toBe("high");
    expect(getDimLevel(5)).toBe("high");
  });
});

describe("getDimInsight — lookup by dim + score", () => {
  it("returns observation + action", () => {
    const insight = getDimInsight("intensity", 5);
    expect(insight.observation).toBeTruthy();
    expect(insight.action.trim().startsWith("→")).toBe(true);
  });

  it("score 1 vs 5 returns different copy (low vs high level)", () => {
    const low = getDimInsight("rhythmicity", 1);
    const high = getDimInsight("rhythmicity", 5);
    expect(low.observation).not.toBe(high.observation);
  });
});

describe("pickInsightDims — top-K by deviation from midpoint", () => {
  it("picks 3 dims with largest |score - 3|", () => {
    const dimScores = {
      activityLevel: 3, // dev 0
      rhythmicity: 1, // dev 2
      approach: 5, // dev 2
      adaptability: 1, // dev 2
      intensity: 5, // dev 2
      threshold: 3, // dev 0
      mood: 3, // dev 0
      distractibility: 3, // dev 0
      persistence: 3, // dev 0
    };
    const picks = pickInsightDims(dimScores, 3);
    expect(picks).toHaveLength(3);
    // All picks should have deviation >= 1
    for (const id of picks) {
      expect(Math.abs(dimScores[id as keyof typeof dimScores] - 3)).toBeGreaterThanOrEqual(1);
    }
  });

  it("k=5 returns 5 items", () => {
    const dimScores = Object.fromEntries(
      DIMENSION_LIST.map((d) => [d.id, 3]),
    ) as Parameters<typeof pickInsightDims>[0];
    const picks = pickInsightDims(dimScores, 5);
    expect(picks).toHaveLength(5);
  });

  it("returns at most 9 (total dims)", () => {
    const dimScores = Object.fromEntries(
      DIMENSION_LIST.map((d) => [d.id, 3]),
    ) as Parameters<typeof pickInsightDims>[0];
    const picks = pickInsightDims(dimScores, 99);
    expect(picks.length).toBeLessThanOrEqual(9);
  });
});
