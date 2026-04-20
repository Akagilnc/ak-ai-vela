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

// INTEREST_DESC: the child's behavior pattern tied to (interest, interestDetail).
// Shown on the result page, concatenated with DRIVE_DESC below to form a single
// paragraph-length description. Rewritten with the same discipline as insights.ts:
// no templated opener, varied openings (scene / object / subject), concrete
// behavioral anchors, no LLM cliché ("充满了好奇心" / "如鱼得水" / "沉迷其中"),
// no deficit framing ("还在找自己的角落" was flagged in Slice 1 and must not
// recur), no cross-trait anchor overlap (experiment ≠ science on 植物).
const INTEREST_DESC: Record<string, string> = {
  "animal-science:caring": "对小动物他有耐心也有分寸，愿意蹲下来陪它们一会儿。",
  "animal-science:science": "虫子、鸟、植物，他对身边的生命都想追问到底是怎么回事。",
  "animal-science:career": "动物相关的活动他都想参与，兽医、饲养员、救助站是他常问的几种。",
  "stem:builder": "把东西拆开看里面是他的爱好，做进去就会越做越入迷。",
  "stem:digital": "同一个游戏或小程序他不爱照着玩，总想改一改、做出自己的版本。",
  "stem:experiment": "他爱动手试\u201C如果怎样会怎样\u201D，冰化成水、气球鼓起来都要亲眼看。",
  "humanities:visual": "颜色、形状、摆放他都在意，画画和手工是他静下来的方式。",
  "humanities:narrative": "他的故事比说出口的多，读书、编情节、讲给自己听他都来。",
  "humanities:performing": "一上台他就放得开，音乐、动作、表演里能看到另一个他。",
  "exploring:physical": "户外他整个人伸得开，跑、跳、骑车都让他高兴。",
  "exploring:screen": "屏幕里的游戏和视频他上手快，线下的桌游、卡牌他也会翻出来玩。",
  "exploring:quiet": "一个人待着的时候他最专注——手工、拼图、翻书都能投入很久。",
};

// DRIVE_DESC: appended to INTEREST_DESC to form the full portrait paragraph.
// The opener shifts context to learning style (no longer describing the child's
// interest content), so transitions are handled naturally without glue words.
// Rewritten to avoid "进入状态" (flagged mild slop) and vocabulary that would
// collide with high-signal words in INTEREST_DESC (e.g. "状态" appearing in
// performing's earlier draft).
const DRIVE_DESC: Record<string, string> = {
  "self-driven": "学东西他不太等人推，方法常常自己试出来。",
  "guided-start": "起步有人带一下更顺，上手后他能一个人往下推。",
  "companion": "身边有人一起学他更有劲，来回互动里他推进得快。",
};

export function generatePortrait(answers: TraitAnswers): Portrait {
  const key = `${answers.interest}:${answers.interestDetail}`;
  const title = TITLE_MAP[key] ?? "成长探索者";
  // Fallback IS reachable. Each Trait field is validated as a Zod enum, but
  // the (interest, interestDetail) combination is not enforced at the schema
  // level — the 10-question flow in questions.ts constrains combos at
  // runtime, but an out-of-flow caller (stale URL, malformed state restore)
  // could land here with an unmapped combo. Fallback copy is kept factual
  // and non-metaphoric so a user who genuinely sees it gets a plain
  // "not enough signal yet" message rather than an AI-slop placeholder.
  const interestDesc = INTEREST_DESC[key] ?? "这组答案还没拼出完整画像，多观察他的日常会看得更清楚。";
  const driveDesc = DRIVE_DESC[answers.learningDrive] ?? "";
  const description = `${interestDesc}${driveDesc}`;

  return { title, description };
}
