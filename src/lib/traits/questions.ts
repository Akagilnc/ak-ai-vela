import type { TraitAnswers } from "./types";

export type QuestionOption = {
  label: string;
  value: string;
};

export type QuestionDef = {
  id: string;
  key: keyof TraitAnswers;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  // Declarative branching: given current answers, return next question id
  next: (answers: Partial<TraitAnswers>) => string | null;
};

// Question definitions — order matters for the default flow
// Branching happens via the `next` function on each question

export const QUESTIONS: Record<string, QuestionDef> = {
  ageGroup: {
    id: "ageGroup",
    key: "ageGroup",
    title: "孩子现在几年级？",
    options: [
      { label: "小学低年级（1-3 年级）", value: "lower" },
      { label: "小学高年级（4-6 年级）", value: "upper" },
      { label: "初中（7-9 年级）", value: "middle-school" },
    ],
    next: () => "interest",
  },

  interest: {
    id: "interest",
    key: "interest",
    title: "周末自由时间，孩子最可能做什么？",
    subtitle: "选最接近的一个，没有标准答案",
    options: [
      { label: "看动物纪录片、养小宠物、去动物园或农场", value: "animal-science" },
      { label: "拆玩具研究结构、编程、做科学小实验", value: "stem" },
      { label: "画画、读故事书、写日记、做手工", value: "humanities" },
      { label: "什么都玩一点，还没有特别偏好", value: "exploring" },
    ],
    next: (answers) => {
      switch (answers.interest) {
        case "animal-science": return "interestDetail_animal";
        case "stem": return "interestDetail_stem";
        case "humanities": return "interestDetail_humanities";
        case "exploring": return "interestDetail_exploring";
        default: return null;
      }
    },
  },

  // --- Interest detail branches ---
  interestDetail_animal: {
    id: "interestDetail_animal",
    key: "interestDetail",
    title: "孩子对动物的兴趣更偏向哪种？",
    options: [
      { label: "喜欢观察和照顾（养仓鼠、喂流浪猫、看动物怎么生活）", value: "caring" },
      { label: "喜欢了解原理（为什么恐龙灭绝、动物怎么呼吸、看科普书）", value: "science" },
      { label: "想当兽医 / 想在动物园工作（有明确的职业画面）", value: "career" },
    ],
    next: () => "learningDrive",
  },

  interestDetail_stem: {
    id: "interestDetail_stem",
    key: "interestDetail",
    title: "哪种场景最像孩子？",
    options: [
      { label: "喜欢拆开看里面什么结构（机械、电子、乐高）", value: "builder" },
      { label: "喜欢用电脑做东西（编程、游戏设计、视频剪辑）", value: "digital" },
      { label: "喜欢做实验看反应（化学小实验、种植观察、混合颜料）", value: "experiment" },
    ],
    next: () => "learningDrive",
  },

  interestDetail_humanities: {
    id: "interestDetail_humanities",
    key: "interestDetail",
    title: "孩子更投入的是？",
    options: [
      { label: "视觉创作（画画、手工、设计、搭配）", value: "visual" },
      { label: "文字表达（写故事、读书、编剧情、写信）", value: "narrative" },
      { label: "表演和音乐（唱歌、乐器、戏剧、舞蹈）", value: "performing" },
    ],
    next: () => "learningDrive",
  },

  interestDetail_exploring: {
    id: "interestDetail_exploring",
    key: "interestDetail",
    title: "如果必须选一个让孩子连续投入一小时的事，最可能是？",
    options: [
      { label: "户外活动（跑、爬、骑车、球类）", value: "physical" },
      { label: "屏幕类（游戏、视频、社交）", value: "screen" },
      { label: "安静类（拼图、积木、涂色、折纸）", value: "quiet" },
    ],
    next: () => "learningDrive",
  },

  // --- Learning drive ---
  learningDrive: {
    id: "learningDrive",
    key: "learningDrive",
    title: "遇到一个新东西（比如新游戏、新手工），孩子通常怎么开始？",
    options: [
      { label: "自己研究规则，琢磨出来再开始", value: "self-driven" },
      { label: "需要大人带着入门，上手后就能自己玩", value: "guided-start" },
      { label: "更喜欢跟着大人一步步来，有人陪着更投入", value: "companion" },
    ],
    next: (answers) => {
      switch (answers.learningDrive) {
        case "self-driven": return "driveDetail_self";
        case "guided-start": return "driveDetail_guided";
        case "companion": return "driveDetail_companion";
        default: return null;
      }
    },
  },

  // --- Drive detail branches ---
  driveDetail_self: {
    id: "driveDetail_self",
    key: "driveDetail",
    title: "孩子钻研的时候，通常是什么状态？",
    options: [
      { label: "能一个人专注很久，不喜欢被打断", value: "deep-focus" },
      { label: "同时开好几个「项目」，兴趣转得快但每个都有点成果", value: "multi-explorer" },
      { label: "先广泛试，找到喜欢的就一头扎进去", value: "funnel" },
    ],
    next: () => "socialStyle",
  },

  driveDetail_guided: {
    id: "driveDetail_guided",
    key: "driveDetail",
    title: "上手之后，孩子更倾向？",
    options: [
      { label: "按自己的方式改造（改规则、换玩法、加花样）", value: "creative-adapter" },
      { label: "把学到的练到很熟，享受变厉害的过程", value: "mastery-seeker" },
      { label: "教别的小朋友怎么玩，当小老师", value: "peer-teacher" },
    ],
    next: () => "socialStyle",
  },

  driveDetail_companion: {
    id: "driveDetail_companion",
    key: "driveDetail",
    title: "陪伴时孩子最享受的部分是？",
    options: [
      { label: "和大人一起讨论、追问「为什么」", value: "dialogue-learner" },
      { label: "看大人做，然后自己模仿着来", value: "observer-learner" },
      { label: "大人陪在旁边就行，按自己节奏慢慢摸索", value: "comfort-explorer" },
    ],
    next: () => "socialStyle",
  },

  // --- Social style ---
  socialStyle: {
    id: "socialStyle",
    key: "socialStyle",
    title: "课外活动时，孩子更享受哪种方式？",
    options: [
      { label: "和一群小朋友一起完成任务", value: "team" },
      { label: "和一两个好朋友搭档", value: "small-group" },
      { label: "一个人专注做自己的事", value: "solo" },
    ],
    next: (answers) => {
      switch (answers.socialStyle) {
        case "team": return "socialDetail_team";
        case "small-group": return "socialDetail_small";
        case "solo": return "socialDetail_solo";
        default: return null;
      }
    },
  },

  // --- Social detail branches ---
  socialDetail_team: {
    id: "socialDetail_team",
    key: "socialDetail",
    title: "在团队里，孩子通常是什么角色？",
    options: [
      { label: "带头组织、出主意的那个", value: "leader" },
      { label: "积极参与，哪里需要补哪里", value: "collaborator" },
      { label: "负责把事情做好做细，团队的可靠后盾", value: "executor" },
    ],
    next: () => "englishLevel",
  },

  socialDetail_small: {
    id: "socialDetail_small",
    key: "socialDetail",
    title: "和好朋友在一起时，孩子更多是？",
    options: [
      { label: "两个人一起想办法、做东西", value: "co-creator" },
      { label: "各做各的，但喜欢待在一起，偶尔分享", value: "parallel-player" },
      { label: "通常是带着朋友玩的那个", value: "mentor-friend" },
    ],
    next: () => "englishLevel",
  },

  socialDetail_solo: {
    id: "socialDetail_solo",
    key: "socialDetail",
    title: "一个人的时候，孩子的状态更像？",
    options: [
      { label: "沉浸在自己的世界里，很享受很满足", value: "content-solo" },
      { label: "其实想参与，但需要时间观察和适应", value: "slow-warmer" },
      { label: "独处时特别有创造力，自己发明游戏、编故事", value: "solo-creator" },
    ],
    next: () => "englishLevel",
  },

  // --- Modifiers (no branching) ---
  englishLevel: {
    id: "englishLevel",
    key: "englishLevel",
    title: "孩子目前接触英语的方式最接近哪种？",
    options: [
      { label: "双语环境（家里说英语、国际学校、英文原版书是日常）", value: "strong" },
      { label: "有课外英语学习（补习班、线上课、能看简单英文内容）", value: "average" },
      { label: "主要在学校学英语，课外接触不多", value: "weak" },
    ],
    next: () => "resourceLevel",
  },

  resourceLevel: {
    id: "resourceLevel",
    key: "resourceLevel",
    title: "目前孩子的课外学习安排最接近哪种？",
    subtitle: "这帮我们匹配更现实的规划路线",
    options: [
      { label: "国际学校或双语学校，课外活动丰富", value: "high" },
      { label: "公立/民办学校，有 1-2 个重点课外班", value: "medium" },
      { label: "主要靠学校资源，课外以自主探索为主", value: "limited" },
    ],
    next: () => "parentStyle",
  },

  parentStyle: {
    id: "parentStyle",
    key: "parentStyle",
    title: "关于孩子的课外学习，你更倾向？",
    options: [
      { label: "我会主动规划和安排，带孩子去体验", value: "proactive" },
      { label: "我愿意配合，但希望有人告诉我具体该做什么", value: "need-guidance" },
      { label: "我主要提供支持，让孩子自己选择方向", value: "hands-off" },
    ],
    next: () => null, // End of quiz
  },
};

// Starting question
export const FIRST_QUESTION_ID = "ageGroup";

// Build the question flow for a given set of answers
// Returns ordered array of question IDs the user will/has walked through
export function buildQuestionFlow(answers: Partial<TraitAnswers>): string[] {
  const flow: string[] = [];
  let currentId: string | null = FIRST_QUESTION_ID;

  while (currentId) {
    const q = QUESTIONS[currentId];
    if (!q) break;
    flow.push(currentId);
    currentId = q.next(answers);
  }

  return flow;
}

// Total questions is always 10 (fixed by branching design)
export const TOTAL_TRAIT_QUESTIONS = 10;
