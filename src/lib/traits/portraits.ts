import type { TraitAnswers } from "./types";

export type Portrait = {
  title: string;       // e.g. "温柔观察者"
  description: string; // 1-3 sentences describing the child
};

// Title map: interest + interestDetail → portrait title
const TITLE_MAP: Record<string, string> = {
  // animal-science branch
  "animal-science:caring": "温柔观察者",
  "animal-science:science": "自然探索家",
  "animal-science:career": "小小兽医梦",
  // stem branch
  "stem:builder": "动手小工程师",
  "stem:digital": "数字小创客",
  "stem:experiment": "好奇实验家",
  // humanities branch
  "humanities:visual": "视觉小艺术家",
  "humanities:narrative": "故事编织者",
  "humanities:performing": "小小表演家",
  // exploring branch
  "exploring:physical": "活力探险家",
  "exploring:screen": "数字世界游侠",
  "exploring:quiet": "安静创造者",
};

// Description fragments by dimension
const INTEREST_DESC: Record<string, string> = {
  "animal-science:caring": "孩子对动物有天然的温柔和耐心，喜欢观察、照顾小生命。",
  "animal-science:science": "孩子对自然界充满好奇，喜欢追问动物背后的科学原理。",
  "animal-science:career": "孩子已经有了清晰的职业画面，对兽医或动物保护工作充满向往。",
  "stem:builder": "孩子喜欢拆开东西研究结构，动手能力强，享受从零搭建的过程。",
  "stem:digital": "孩子在电脑和数字世界里如鱼得水，对编程或创作有浓厚兴趣。",
  "stem:experiment": "孩子喜欢做实验看反应，对化学变化、植物生长这类现象着迷。",
  "humanities:visual": "孩子在视觉创作上有天赋，画画、手工、设计都让他沉浸其中。",
  "humanities:narrative": "孩子喜欢用文字表达，读书、写故事、编剧情是他的快乐源泉。",
  "humanities:performing": "孩子热爱表演和音乐，在舞台上或音乐中能找到自信和快乐。",
  "exploring:physical": "孩子精力充沛，热爱户外活动，跑跳骑行是他释放能量的方式。",
  "exploring:screen": "孩子在屏幕世界里有自己的兴趣圈，但还没找到线下的深度投入。",
  "exploring:quiet": "孩子喜欢安静地做手工、拼图，在专注中找到乐趣。",
};

const DRIVE_DESC: Record<string, string> = {
  "self-driven": "学习上比较自主，能自己琢磨出方法。",
  "guided-start": "入门时需要引导，但上手后能独立探索。",
  "companion": "更喜欢有人陪伴的学习方式，互动中进步更快。",
};

export function generatePortrait(answers: TraitAnswers): Portrait {
  const key = `${answers.interest}:${answers.interestDetail}`;
  const title = TITLE_MAP[key] ?? "成长探索者";
  const interestDesc = INTEREST_DESC[key] ?? "";
  const driveDesc = DRIVE_DESC[answers.learningDrive] ?? "";
  const description = `${interestDesc}${driveDesc}`;

  return { title, description };
}
