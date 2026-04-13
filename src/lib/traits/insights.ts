import type { Interest, InterestDetail } from "./types";

// Mid-quiz insight text: shown after Q3 (interest + interestDetail answered)
// Pure string lookup, no AI. Each of the 12 combinations gets a unique line.
const INSIGHT_MAP: Record<string, string> = {
  "animal-science:caring": "看起来孩子是一个对动物很有爱的小观察者",
  "animal-science:science": "看起来孩子对自然界充满了好奇心",
  "animal-science:career": "看起来孩子已经有了清晰的职业梦想",
  "stem:builder": "看起来孩子是一个喜欢动手的小工程师",
  "stem:digital": "看起来孩子在数字世界里很有天赋",
  "stem:experiment": "看起来孩子是一个好奇的小实验家",
  "humanities:visual": "看起来孩子有很强的视觉创造力",
  "humanities:narrative": "看起来孩子特别善于用文字表达自己",
  "humanities:performing": "看起来孩子在表演和音乐上很有热情",
  "exploring:physical": "看起来孩子精力充沛，热爱运动和探索",
  "exploring:screen": "看起来孩子对数字世界很感兴趣",
  "exploring:quiet": "看起来孩子喜欢在安静中专注创造",
};

export function generateInsight(interest: Interest, interestDetail: InterestDetail): string {
  const key = `${interest}:${interestDetail}`;
  return INSIGHT_MAP[key] ?? "看起来孩子有独特的兴趣和天赋";
}
