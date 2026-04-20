import type { Interest, InterestDetail } from "./types";

// Mid-quiz insight text: shown after Q3 (interest + interestDetail answered).
// Pure string lookup, no AI. Each of the 12 combinations gets a unique line
// written in the voice of a real observer — no templated opener, varied
// openings (scene / subject / object / temporal / attributive), concrete
// over generic, no contrast-tic, no autonomy-beat repetition, no over-
// repeated key verbs, em-dash ≤ 2 of 13, each line under 35 CJK chars
// (test-enforced across all 12 keys) to fit the mid-quiz insight card.
const INSIGHT_MAP: Record<string, string> = {
  "animal-science:caring": "对小动物他手会放轻，愿意慢慢陪着。",
  "animal-science:science": "一只虫子就能让他蹲下去看半天——问题一个接一个，答案倒不急着要。",
  "animal-science:career": "路过宠物医院他会停一下，兽医、饲养员、救助都提过。",
  "stem:builder": "他拿到零件就开始拆了装、装了拆，过程比成品更吸引他。",
  "stem:digital": "屏幕前他不爱用默认，想调一调设置，做出自己的版本。",
  "stem:experiment": "他爱问\u201C如果……会怎样\u201D——冰块放进热水，他会蹲在旁边看到化完。",
  "humanities:visual": "颜色、形状、怎么摆的，他看一次，回头就能在纸上重画一遍。",
  "humanities:narrative": "同一本书他能讲三四遍，每次结尾都不一样。",
  "humanities:performing": "轮到他上场，嘴一张声音就出来，动作也大。",
  "exploring:physical": "他在户外待不住，喜欢找远的、找高的地方去。",
  "exploring:screen": "规则清楚、反馈快的东西能让他坐下来，一关一关打过去。",
  "exploring:quiet": "热闹他不硬凑，一个人坐很久，翻翻书、捏捏泥、画几笔都行。",
};

export function generateInsight(interest: Interest, interestDetail: InterestDetail): string {
  const key = `${interest}:${interestDetail}`;
  // Fallback IS reachable. Each Trait field is validated as a Zod enum, but
  // the (interest, interestDetail) combination is not enforced at the schema
  // level — the 10-question flow in questions.ts constrains combos at
  // runtime, but an out-of-flow caller (stale URL, malformed state restore)
  // could land here with an unmapped combo. Kept as a friendly degradation
  // path — better than a blank insight card on the user side. Matches the
  // identical-shape reachability note in portraits.ts.
  return INSIGHT_MAP[key] ?? "先看到这些。再答几题，会看得更清楚。";
}
