import type { Route, Stage } from "./types";

// Helper to build stage sections concisely
function action(title: string, items: Array<{ text: string; verified?: boolean; source?: string }>) {
  return { type: "action" as const, title, items: items.map((i) => ({ text: i.text, verified: i.verified, source: i.source })) };
}
function relax(title: string, items: Array<{ text: string; verified?: boolean; source?: string }>) {
  return { type: "relax" as const, title, items: items.map((i) => ({ text: i.text, verified: i.verified, source: i.source })) };
}
function why(title: string, items: Array<{ text: string }>) {
  return { type: "why" as const, title, items: items.map((i) => ({ text: i.text })) };
}

// Lower elementary (G1-G3) stages template
function lowerStages(): Stage[] {
  return [
    { label: "小学低年级", period: "G1-G3 (6-9岁)", sections: [] },
    { label: "小学高年级", period: "G4-G6 (10-12岁)", sections: [] },
    { label: "初中阶段", period: "G7-G9 (13-15岁)", sections: [] },
  ];
}

// Upper elementary (G4-G6) stages template
function upperStages(): Stage[] {
  return [
    { label: "小学高年级", period: "G4-G6 (10-12岁)", sections: [] },
    { label: "初中阶段", period: "G7-G9 (13-15岁)", sections: [] },
    { label: "高中准备", period: "G9-G10 (14-16岁)", sections: [] },
  ];
}

// Middle school (G7-G9) stages template
function middleStages(): Stage[] {
  return [
    { label: "初中当下", period: "G7-G9 (13-15岁)", sections: [] },
    { label: "高中阶段", period: "G10-G12 (16-18岁)", sections: [] },
    { label: "大学申请准备", period: "G11-G12 (17-18岁)", sections: [] },
  ];
}

// ============================================================================
// ROUTE DATA — 24 routes (3 ages × 4 interests × 2 resources)
// Content quality standards:
// 1. Data correctness: recommended items must actually exist
// 2. Reasoning validity: every recommendation has a causal chain
// 3. No AI slop: every sentence must carry information
// ============================================================================

export const ROUTES: Record<string, Route> = {
  // ---- LOWER + ANIMAL ----
  "lower-animal-high": {
    id: "lower-animal-high",
    name: "小小动物科学家路线（资源丰富版）",
    description: "培养对动物科学的深度兴趣，利用丰富资源建立早期科学素养。",
    stages: [
      {
        ...lowerStages()[0],
        sections: [
          action("建议行动", [
            { text: "参加学校或社区的自然观察活动，记录动物行为日记", verified: true, source: "Smithsonian National Zoo education programs" },
            { text: "订阅National Geographic Kids杂志或类似科普读物", verified: true, source: "natgeokids.com" },
            { text: "每周安排一次动物园或自然博物馆的深度探访" },
          ]),
          relax("放松与兴趣保护", [
            { text: "不要把兴趣变成任务，保护孩子的好奇心是第一优先级" },
            { text: "允许孩子在动物主题上'浪费时间'，深度兴趣需要自由时间" },
          ]),
          why("为什么这样规划", [
            { text: "6-9岁是兴趣萌芽期，目标是让好奇心扎根，不是追求成果" },
          ]),
        ],
      },
      {
        ...lowerStages()[1],
        sections: [
          action("建议行动", [
            { text: "参加系统的动物科学夏令营（如San Diego Zoo Wildlife Camp）", verified: true, source: "sandiegozoo.org/camps" },
            { text: "开始简单的科学项目：观察记录本地鸟类、昆虫分类" },
            { text: "尝试加入学校或社区的环保/动物保护小组" },
          ]),
          why("为什么这样规划", [
            { text: "10-12岁可以开始有目的性的探索，但仍以兴趣驱动为主" },
          ]),
        ],
      },
      {
        ...lowerStages()[2],
        sections: [
          action("建议行动", [
            { text: "选择有科学实验室资源的学校，开始做独立研究项目" },
            { text: "考虑暑期科学营或大学预科项目（如Johns Hopkins CTY）", verified: true, source: "cty.jhu.edu" },
            { text: "寻找动物保护组织的志愿者机会，积累实践经验" },
          ]),
          why("为什么这样规划", [
            { text: "初中是从'喜欢动物'到'理解动物科学'的关键转换期" },
          ]),
        ],
      },
    ],
  },

  "lower-animal-std": {
    id: "lower-animal-std",
    name: "小小动物科学家路线（普通版）",
    description: "用日常资源培养动物科学兴趣，重点是保护好奇心和建立观察习惯。",
    stages: [
      {
        ...lowerStages()[0],
        sections: [
          action("建议行动", [
            { text: "从身边开始：观察小区里的猫、鸟、昆虫，记录到本子上" },
            { text: "看免费的动物纪录片（B站、YouTube上的BBC Earth系列）", verified: true, source: "bbc.co.uk/programmes/p04tjbtx" },
            { text: "借阅图书馆的动物科普绘本，每周读一本" },
          ]),
          relax("放松与兴趣保护", [
            { text: "不需要花钱报班，保持好奇心比任何课程都重要" },
          ]),
          why("为什么这样规划", [
            { text: "资源有限时，观察力和好奇心是最好的起点，完全免费" },
          ]),
        ],
      },
      {
        ...lowerStages()[1],
        sections: [
          action("建议行动", [
            { text: "参加免费的自然教育活动（公园、博物馆开放日）" },
            { text: "用手机记录动物观察，开始写简单的观察报告" },
            { text: "尝试养一只小宠物（仓鼠、金鱼），学习基本照护" },
          ]),
          why("为什么这样规划", [
            { text: "照顾活的动物是最好的生物学入门，比任何课本都有效" },
          ]),
        ],
      },
      {
        ...lowerStages()[2],
        sections: [
          action("建议行动", [
            { text: "参加学校的生物/自然科学社团" },
            { text: "寻找本地动物保护组织的免费志愿者机会" },
            { text: "利用免费在线课程（如Khan Academy生物系列）补充知识", verified: true, source: "khanacademy.org/science/biology" },
          ]),
          why("为什么这样规划", [
            { text: "初中阶段，社团和志愿者经验开始有实际价值" },
          ]),
        ],
      },
    ],
  },

  // ---- LOWER + STEM ----
  "lower-stem-high": {
    id: "lower-stem-high",
    name: "小小工程师路线（资源丰富版）",
    description: "系统培养STEM能力，从动手探索到项目制学习。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "入手乐高Technic或类似结构搭建套件，从说明书到自由创造" },
          { text: "尝试Scratch Jr编程（适合6-8岁）", verified: true, source: "scratchjr.org" },
          { text: "参加maker space的亲子工作坊" },
        ]),
        relax("放松与兴趣保护", [
          { text: "让孩子自己拆东西，不要怕坏，拆的过程就是学习" },
        ]),
        why("为什么这样规划", [{ text: "动手是STEM的起点，理论可以后面补" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "开始系统学Scratch或Python，可以考虑线上课程" },
          { text: "参加FIRST LEGO League等机器人比赛", verified: true, source: "firstlegoleague.org" },
          { text: "做一个完整的个人项目（做一个简单的App或机器人）" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁是从'玩'到'做项目'的最佳窗口期" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "深入一个方向：编程、机器人、电子，选一个做深" },
          { text: "参加Math Olympiad或Science Olympiad积累竞赛经验", verified: true, source: "scioly.org" },
          { text: "寻找暑期STEM营（MIT STEM Program, Stanford AI4ALL等）" },
        ]),
        why("为什么这样规划", [{ text: "初中开始需要深度，广度在小学已经建立" }]),
      ]},
    ],
  },

  "lower-stem-std": {
    id: "lower-stem-std",
    name: "小小工程师路线（普通版）",
    description: "用免费和低成本资源培养STEM兴趣，重点是动手和解决问题。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "用纸板、吸管、胶带做简单工程项目（桥梁、弹射器）" },
          { text: "免费学Scratch编程（scratch.mit.edu）", verified: true, source: "scratch.mit.edu" },
          { text: "看免费的科学实验视频（Mark Rober YouTube频道）", verified: true, source: "youtube.com/@MarkRober" },
        ]),
        relax("放松与兴趣保护", [
          { text: "STEM不需要花钱，废物利用是最好的工程训练" },
        ]),
        why("为什么这样规划", [{ text: "创造力不需要昂贵工具，限制反而激发想象力" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "继续Scratch项目，开始尝试Python（免费Codecademy课程）", verified: true, source: "codecademy.com" },
          { text: "参加学校的科技社团或maker club" },
          { text: "用Arduino等低成本硬件做电子项目" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁的项目成果比课程证书更有说服力" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "深入一个免费平台（GitHub, Kaggle, Instructables）做项目" },
          { text: "参加免费线上竞赛（Kaggle入门赛、Hackathon）" },
          { text: "找开源项目做贡献，积累实际开发经验" },
        ]),
        why("为什么这样规划", [{ text: "展示能力最好的方式是可公开的作品集" }]),
      ]},
    ],
  },

  // ---- LOWER + HUMANITIES ----
  "lower-humanities-high": {
    id: "lower-humanities-high",
    name: "小小创作者路线（资源丰富版）",
    description: "系统培养人文艺术素养，从兴趣到作品集。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "参加系统的绘画/音乐/写作课程，找到匹配的老师" },
          { text: "每周读2-3本优质绘本或儿童文学" },
          { text: "开始积累作品：画作、小故事、演出视频" },
        ]),
        relax("放松与兴趣保护", [
          { text: "创作不应该有'对错'，保护孩子表达的自由" },
        ]),
        why("为什么这样规划", [{ text: "6-9岁的创作不追求技巧，追求表达的勇气" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "参加写作/艺术/表演比赛，积累展示经验" },
          { text: "开始做长期项目：一本绘本、一个短片、一个表演" },
          { text: "参观美术馆、博物馆，拓展审美视野" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁可以开始做有完成度的作品" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "选择一个方向深入：视觉艺术、创意写作、戏剧" },
          { text: "参加暑期艺术营或预科项目" },
          { text: "开始建立作品集（Portfolio）" },
        ]),
        why("为什么这样规划", [{ text: "初中是从'喜欢'到'专业化'的过渡期" }]),
      ]},
    ],
  },

  "lower-humanities-std": {
    id: "lower-humanities-std",
    name: "小小创作者路线（普通版）",
    description: "用免费和日常资源培养创作习惯，重点是表达和积累。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "每天留出'创作时间'：画画、写日记、做手工，形式不限" },
          { text: "每周去一次图书馆，借阅绘本和儿童文学" },
          { text: "用手机记录孩子的创作过程和作品" },
        ]),
        relax("放松与兴趣保护", [
          { text: "最好的创作来自自由时间，不要把每分钟都排满" },
        ]),
        why("为什么这样规划", [{ text: "创作习惯比创作技巧重要得多" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "参加学校的文学社、美术社、戏剧社" },
          { text: "尝试投稿学校刊物或社区展览" },
          { text: "利用免费工具（Canva、iMovie）做数字创作", verified: true, source: "canva.com" },
        ]),
        why("为什么这样规划", [{ text: "被看到和被认可是持续创作的动力" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "参加免费写作/艺术比赛（如全国中学生作文大赛）" },
          { text: "在社交媒体上分享作品，建立个人创作品牌" },
          { text: "开始整理作品集，为高中做准备" },
        ]),
        why("为什么这样规划", [{ text: "初中的作品积累直接服务于高中活动列表" }]),
      ]},
    ],
  },

  // ---- LOWER + EXPLORING ----
  "lower-exploring-high": {
    id: "lower-exploring-high",
    name: "多元探索者路线（资源丰富版）",
    description: "广泛尝试，找到真正热爱的方向。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "每学期尝试1-2个不同的课外活动（体育、艺术、科学各一）" },
          { text: "不急着定方向，6-9岁的探索面越广越好" },
          { text: "记录孩子在每个活动中的投入度和兴奋程度" },
        ]),
        relax("放松与兴趣保护", [
          { text: "什么都玩一点是这个年龄最健康的状态，不需要焦虑" },
        ]),
        why("为什么这样规划", [{ text: "过早收窄方向是最大的风险" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "观察哪个方向孩子愿意在没人要求时自己投入时间" },
          { text: "在2-3个方向上加深，而不是继续广泛尝试" },
          { text: "参加综合性夏令营，让孩子在多个领域间自己选择" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁，兴趣信号会自然浮现，家长要做的是观察" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "帮孩子确认1-2个主要方向，开始系统投入" },
          { text: "在选定方向上参加比赛或项目，检验兴趣是否真实" },
          { text: "如果还没找到方向，不要强迫，继续尝试新领域" },
        ]),
        why("为什么这样规划", [{ text: "初中找到方向就够了，比小学定方向已经领先" }]),
      ]},
    ],
  },

  "lower-exploring-std": {
    id: "lower-exploring-std",
    name: "多元探索者路线（普通版）",
    description: "用低成本方式广泛探索，找到孩子的天然倾向。",
    stages: [
      { ...lowerStages()[0], sections: [
        action("建议行动", [
          { text: "利用学校提供的免费社团和课后班做尝试" },
          { text: "每个周末安排一个不同类型的活动（公园、图书馆、博物馆免费日）" },
          { text: "观察孩子放学后自发做什么，那是最真实的兴趣信号" },
        ]),
        relax("放松与兴趣保护", [
          { text: "不需要报很多班，自由玩耍就是最好的探索" },
        ]),
        why("为什么这样规划", [{ text: "发现兴趣不需要花钱，需要的是时间和观察" }]),
      ]},
      { ...lowerStages()[1], sections: [
        action("建议行动", [
          { text: "从孩子最自发的行为里找线索，加深那个方向" },
          { text: "参加学校的各种社团，低成本试错" },
          { text: "找社区里的免费学习资源（图书馆讲座、公益课程）" },
        ]),
        why("为什么这样规划", [{ text: "兴趣方向在实践中才能确认，不是讨论出来的" }]),
      ]},
      { ...lowerStages()[2], sections: [
        action("建议行动", [
          { text: "在确认的方向上找免费或低成本的深度资源" },
          { text: "利用互联网自学（YouTube教程、免费在线课程）" },
          { text: "参加学校竞赛或社区活动积累经验" },
        ]),
        why("为什么这样规划", [{ text: "到初中，方向感比资源量更重要" }]),
      ]},
    ],
  },

  // ---- UPPER + ANIMAL ----
  "upper-animal-high": {
    id: "upper-animal-high",
    name: "动物科学进阶路线（资源丰富版）",
    description: "从观察走向研究，利用优质资源建立科学研究基础。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "参加有深度的自然科学营（如Smithsonian的Nature Camp）" },
          { text: "开始做独立研究项目：选一个动物主题，系统收集数据" },
          { text: "学习基础生物学知识，为初中理科打基础" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁可以开始'像科学家一样思考'" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加Science Olympiad的生物/生态相关项目", verified: true, source: "scioly.org" },
          { text: "找动物医院或研究机构的观摩/实习机会" },
          { text: "完善研究项目，准备参加科学展览" },
        ]),
        why("为什么这样规划", [{ text: "初中的科学项目经验是高中申请的重要素材" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "选择有强生物/环境科学AP课程的高中" },
          { text: "暑期申请大学实验室的高中生研究项目" },
          { text: "开始建立与目标大学Pre-vet项目的联系" },
        ]),
        why("为什么这样规划", [{ text: "为高中选课和申请方向做战略准备" }]),
      ]},
    ],
  },

  "upper-animal-std": {
    id: "upper-animal-std",
    name: "动物科学进阶路线（普通版）",
    description: "用现有资源深化动物科学兴趣，建立实践经验。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "开始一个长期观察项目（如记录某种鸟类一整年的行为）" },
          { text: "在B站/YouTube看大学公开课（MIT OpenCourseWare生物系列）", verified: true, source: "ocw.mit.edu" },
          { text: "参加本地动物保护组织的活动" },
        ]),
        why("为什么这样规划", [{ text: "持续观察比短期体验更有价值" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加学校生物社团，尝试做研究性学习课题" },
          { text: "找本地动物救助站的志愿者机会" },
          { text: "开始写科学观察博客或笔记，积累研究素材" },
        ]),
        why("为什么这样规划", [{ text: "志愿者经验证明了对动物的真实热情" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "利用免费在线资源补充AP级别的生物学知识" },
          { text: "整理过去的观察记录和志愿者经验，准备申请材料" },
          { text: "了解目标学校的Pre-vet项目要求" },
        ]),
        why("为什么这样规划", [{ text: "研究经验 + 志愿者记录 = 有力的申请故事" }]),
      ]},
    ],
  },

  // ---- UPPER + STEM ----
  "upper-stem-high": {
    id: "upper-stem-high",
    name: "STEM进阶路线（资源丰富版）",
    description: "从动手到做项目，建立可展示的技术能力。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "选择一个方向深入：编程、机器人、或数学竞赛" },
          { text: "参加FIRST Robotics Competition准备", verified: true, source: "firstinspires.org" },
          { text: "开始做有发布目标的项目（一个真正的App或网站）" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁能做出真正可用的东西了" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加AMC 8数学竞赛、Science Olympiad", verified: true, source: "maa.org/math-competitions/amc-8" },
          { text: "找导师或加入高级编程社区（如GitHub开源项目）" },
          { text: "申请暑期STEM项目（Google CSSI、MIT Launch等）" },
        ]),
        why("为什么这样规划", [{ text: "初中的竞赛和项目成果直接影响高中录取" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "选有强STEM课程和竞赛团队的高中" },
          { text: "开始AP计算机科学或AP物理的预习" },
          { text: "维护个人技术博客或GitHub主页" },
        ]),
        why("为什么这样规划", [{ text: "公开可见的作品比任何证书都有说服力" }]),
      ]},
    ],
  },

  "upper-stem-std": {
    id: "upper-stem-std",
    name: "STEM进阶路线（普通版）",
    description: "利用免费资源建立项目能力，用作品说话。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "完成一个完整的Scratch或Python项目并发布" },
          { text: "在学校组织coding club或maker活动" },
          { text: "用免费资源学习（freeCodeCamp、Khan Academy）", verified: true, source: "freecodecamp.org" },
        ]),
        why("为什么这样规划", [{ text: "发布一个真项目比上十个课有用" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加免费线上编程竞赛和Hackathon" },
          { text: "在GitHub上开源自己的项目" },
          { text: "参加学校科技社团，尝试带团队做项目" },
        ]),
        why("为什么这样规划", [{ text: "开源贡献和团队项目是最好的简历" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "用免费资源（MIT OCW、Coursera audit）预习高中课程" },
          { text: "整理GitHub主页和项目文档" },
          { text: "准备竞赛成绩和项目经验的材料" },
        ]),
        why("为什么这样规划", [{ text: "好作品 + 好文档 = 不需要花钱的申请优势" }]),
      ]},
    ],
  },

  // ---- UPPER + HUMANITIES ----
  "upper-humanities-high": {
    id: "upper-humanities-high",
    name: "人文创作进阶路线（资源丰富版）",
    description: "从兴趣到专业方向，建立有深度的创作档案。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "找专业导师系统学习（写作、绘画、音乐等）" },
          { text: "参加权威的青少年文学/艺术比赛" },
          { text: "开始做长期创作项目（一本书、一组作品、一个演出）" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁可以开始'认真对待'创作了" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加暑期艺术/写作密集课程" },
          { text: "参加比赛并积累获奖记录" },
          { text: "开始建立个人作品集（Portfolio）" },
        ]),
        why("为什么这样规划", [{ text: "初中的作品集质量决定高中申请的竞争力" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "选有强人文/艺术课程的高中" },
          { text: "开始整理申请用的创作档案" },
          { text: "考虑AP Art、AP Literature等课程" },
        ]),
        why("为什么这样规划", [{ text: "高中选课要匹配创作方向" }]),
      ]},
    ],
  },

  "upper-humanities-std": {
    id: "upper-humanities-std",
    name: "人文创作进阶路线（普通版）",
    description: "用日常习惯和免费平台建立创作能力。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "每天坚持创作练习（写作15分钟、画画30分钟等）" },
          { text: "参加学校的文学社、美术社，争取发表机会" },
          { text: "利用免费平台展示作品（Behance、Medium、公众号）" },
        ]),
        why("为什么这样规划", [{ text: "日积月累的练习比任何课程都有效" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "参加免费写作/艺术比赛" },
          { text: "开始整理电子作品集" },
          { text: "寻找免费的线上创作社区和指导" },
        ]),
        why("为什么这样规划", [{ text: "作品 > 证书，创作经历比花钱上课有说服力" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "整理完整的作品集和创作历程" },
          { text: "参加学校的高级选修课程" },
          { text: "了解目标学校对人文方向的要求" },
        ]),
        why("为什么这样规划", [{ text: "一份有成长弧线的作品集最打动招生官" }]),
      ]},
    ],
  },

  // ---- UPPER + EXPLORING ----
  "upper-exploring-high": {
    id: "upper-exploring-high",
    name: "多元进阶路线（资源丰富版）",
    description: "在多元尝试中找到主攻方向。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "在之前尝试的基础上，缩小到2-3个方向做深度探索" },
          { text: "每个方向安排一个学期的深度体验" },
          { text: "观察孩子在哪个方向最有'心流'体验" },
        ]),
        why("为什么这样规划", [{ text: "10-12岁是从广泛探索到聚焦的转折点" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "确定1-2个主要方向，开始系统投入" },
          { text: "在确定方向上做出可展示的成果" },
          { text: "参加相关比赛或项目积累经验" },
        ]),
        why("为什么这样规划", [{ text: "初中毕业前有一个明确方向就够了" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "围绕确定方向选择高中和课程" },
          { text: "保留一个次要兴趣作为'调剂'（大学喜欢T型人才）" },
          { text: "开始准备申请材料" },
        ]),
        why("为什么这样规划", [{ text: "一个深度 + 一个广度 = 最佳申请组合" }]),
      ]},
    ],
  },

  "upper-exploring-std": {
    id: "upper-exploring-std",
    name: "多元进阶路线（普通版）",
    description: "用学校资源和自由时间找到主攻方向。",
    stages: [
      { ...upperStages()[0], sections: [
        action("建议行动", [
          { text: "利用学校社团和免费活动继续尝试" },
          { text: "注意观察：孩子放学后自发做什么？" },
          { text: "不要焦虑'别人都有特长了'，每个孩子节奏不同" },
        ]),
        why("为什么这样规划", [{ text: "发现方向不需要花钱，需要耐心和观察" }]),
      ]},
      { ...upperStages()[1], sections: [
        action("建议行动", [
          { text: "在最感兴趣的方向上找免费学习资源" },
          { text: "参加学校竞赛和社区活动积累经验" },
          { text: "用免费工具做项目（编程、写作、视频等）" },
        ]),
        why("为什么这样规划", [{ text: "做出东西比说'我有兴趣'更有力" }]),
      ]},
      { ...upperStages()[2], sections: [
        action("建议行动", [
          { text: "围绕找到的方向准备高中的选课和活动规划" },
          { text: "整理已有的项目和活动经验" },
          { text: "不必焦虑，方向在高中还会继续调整" },
        ]),
        why("为什么这样规划", [{ text: "有方向比有成果更重要，成果高中再积累" }]),
      ]},
    ],
  },

  // ---- MIDDLE-SCHOOL + ANIMAL ----
  "middle-school-animal-high": {
    id: "middle-school-animal-high",
    name: "动物科学深度路线（资源丰富版）",
    description: "为Pre-vet或生物科学方向做战略准备。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "确认方向：兽医、动物行为学、野生动物保护？" },
          { text: "找动物医院或实验室的见习机会" },
          { text: "参加Science Olympiad生物/生态项目", verified: true, source: "scioly.org" },
        ]),
        why("为什么这样规划", [{ text: "初中确认细分方向，高中才能精准投入" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "选修AP Biology、AP Environmental Science" },
          { text: "申请暑期大学研究项目（如Cornell Pre-Vet Exploration）" },
          { text: "积累动物相关志愿者和研究经验" },
        ]),
        why("为什么这样规划", [{ text: "Pre-vet方向需要早期学术准备和实践经验" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理完整的活动列表和研究经历" },
          { text: "准备个人陈述：为什么选择这个方向" },
          { text: "研究目标学校的Pre-vet或动物科学项目录取要求" },
        ]),
        why("为什么这样规划", [{ text: "申请季需要展示一个连贯的成长故事" }]),
      ]},
    ],
  },

  "middle-school-animal-std": {
    id: "middle-school-animal-std",
    name: "动物科学深度路线（普通版）",
    description: "用现有资源积累动物科学经验，建立申请优势。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "加入学校生物社团或自己组织一个" },
          { text: "开始系统的动物观察和记录项目" },
          { text: "找本地动物保护组织做志愿者" },
        ]),
        why("为什么这样规划", [{ text: "志愿者经验是最有说服力的兴趣证明" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "利用免费在线资源（Coursera、edX）学习大学级别生物" },
          { text: "做一个有深度的独立研究项目" },
          { text: "持续积累志愿者小时数和推荐信" },
        ]),
        why("为什么这样规划", [{ text: "深度研究 + 持续志愿 = 强申请材料" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理研究项目报告和志愿者记录" },
          { text: "准备个人陈述，展示从兴趣到行动的成长弧线" },
          { text: "了解奖学金机会（很多学校对Pre-vet方向有专项奖学金）" },
        ]),
        why("为什么这样规划", [{ text: "展示热情 + 行动 + 成长，比成绩单更有说服力" }]),
      ]},
    ],
  },

  // ---- MIDDLE-SCHOOL + STEM ----
  "middle-school-stem-high": {
    id: "middle-school-stem-high",
    name: "STEM深度路线（资源丰富版）",
    description: "建立可展示的技术深度和竞赛成绩。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "选一个方向做深：编程、机器人、数学竞赛" },
          { text: "参加AMC 8/10、USACO等竞赛", verified: true, source: "usaco.org" },
          { text: "做一个有影响力的个人项目" },
        ]),
        why("为什么这样规划", [{ text: "初中的竞赛成绩和项目经验直接影响高中录取" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "选修AP Computer Science A、AP Calculus" },
          { text: "参加USACO、AMC 10/12等高级竞赛" },
          { text: "申请暑期研究项目或实习" },
        ]),
        why("为什么这样规划", [{ text: "顶尖大学STEM申请者需要竞赛+项目双轮驱动" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理技术作品集（GitHub、论文、竞赛成绩）" },
          { text: "准备个人陈述和推荐信" },
          { text: "研究目标学校STEM项目的特色和录取偏好" },
        ]),
        why("为什么这样规划", [{ text: "STEM申请最看重可量化的能力证明" }]),
      ]},
    ],
  },

  "middle-school-stem-std": {
    id: "middle-school-stem-std",
    name: "STEM深度路线（普通版）",
    description: "用免费资源和开源项目建立技术能力。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "深入学一门编程语言（Python推荐，免费资源最丰富）" },
          { text: "在GitHub上做开源项目" },
          { text: "参加免费在线编程竞赛" },
        ]),
        why("为什么这样规划", [{ text: "开源贡献比任何证书都有说服力" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "参加USACO（免费、在线、全球认可）", verified: true, source: "usaco.org" },
          { text: "做一个解决真实问题的项目（不是练习题）" },
          { text: "找开源社区的mentor或贡献机会" },
        ]),
        why("为什么这样规划", [{ text: "一个好的开源项目比十个课程证书有用" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理GitHub主页和项目文档" },
          { text: "写好项目说明（为什么做、怎么做、学到什么）" },
          { text: "研究有技术方向奖学金的学校" },
        ]),
        why("为什么这样规划", [{ text: "好的开源简历 + 好的申请故事 = 不花钱的竞争力" }]),
      ]},
    ],
  },

  // ---- MIDDLE-SCHOOL + HUMANITIES ----
  "middle-school-humanities-high": {
    id: "middle-school-humanities-high",
    name: "人文深度路线（资源丰富版）",
    description: "建立专业水准的创作档案和学术基础。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "确认细分方向：创意写作、视觉艺术、戏剧、音乐" },
          { text: "找专业导师做系统训练" },
          { text: "参加权威比赛积累获奖记录" },
        ]),
        why("为什么这样规划", [{ text: "初中是建立'专业水平'还是'业余爱好'的分水岭" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "选修相关AP课程（AP Art, AP Literature等）" },
          { text: "参加暑期艺术/写作密集项目" },
          { text: "建立高质量作品集" },
        ]),
        why("为什么这样规划", [{ text: "人文方向的申请完全看作品集质量" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "完善作品集，确保展示技术成长和创作理念" },
          { text: "准备个人陈述，讲述创作背后的故事" },
          { text: "研究目标学校的人文/艺术项目特色" },
        ]),
        why("为什么这样规划", [{ text: "顶尖学校看的是思考深度，不只是技巧" }]),
      ]},
    ],
  },

  "middle-school-humanities-std": {
    id: "middle-school-humanities-std",
    name: "人文深度路线（普通版）",
    description: "用日常创作习惯和免费平台建立有深度的作品档案。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "每天坚持创作（写作、绘画、音乐练习）" },
          { text: "参加学校文学社/美术社，争取发表和展览机会" },
          { text: "利用免费平台建立在线作品集" },
        ]),
        why("为什么这样规划", [{ text: "日积月累的作品比短期密集训练更有说服力" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "参加免费的写作/艺术比赛" },
          { text: "在社交媒体建立创作品牌" },
          { text: "找线上社区获得反馈和成长" },
        ]),
        why("为什么这样规划", [{ text: "持续的创作+被看到 = 最好的成长循环" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理最好的作品，写创作说明" },
          { text: "准备个人陈述，展示创作历程的成长" },
          { text: "研究有人文方向奖学金的学校" },
        ]),
        why("为什么这样规划", [{ text: "一份有成长弧线的档案比任何推荐信都有力" }]),
      ]},
    ],
  },

  // ---- MIDDLE-SCHOOL + EXPLORING ----
  "middle-school-exploring-high": {
    id: "middle-school-exploring-high",
    name: "探索定向路线（资源丰富版）",
    description: "初中阶段必须确定1-2个主攻方向。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "做一次系统的兴趣盘点：回顾过去两年最投入的活动" },
          { text: "在2个候选方向上各做一个深度项目，比较投入度" },
          { text: "如果实在没找到，选一个'还不错'的先开始，做着做着会明确" },
        ]),
        why("为什么这样规划", [{ text: "初中不确定方向还OK，但必须开始缩小范围" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "在确定的方向上深度投入（竞赛、项目、实习）" },
          { text: "保留一个次要兴趣做调剂" },
          { text: "开始为申请准备材料" },
        ]),
        why("为什么这样规划", [{ text: "大学要看到'spike'（深度突出点），不是全面发展" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理活动列表和成果" },
          { text: "准备一个连贯的申请故事" },
          { text: "如果方向最近才确定，不要慌，真诚讲述探索历程也是好故事" },
        ]),
        why("为什么这样规划", [{ text: "招生官看重自我认知和真诚，不只是成就" }]),
      ]},
    ],
  },

  "middle-school-exploring-std": {
    id: "middle-school-exploring-std",
    name: "探索定向路线（普通版）",
    description: "利用学校资源和自由时间找到并深入一个方向。",
    stages: [
      { ...middleStages()[0], sections: [
        action("建议行动", [
          { text: "参加学校提供的所有感兴趣的社团和活动" },
          { text: "注意哪个活动让孩子最'忘记时间'" },
          { text: "和孩子聊：如果只能选一个做一辈子，选什么？" },
        ]),
        why("为什么这样规划", [{ text: "发现方向比积累成果更紧急" }]),
      ]},
      { ...middleStages()[1], sections: [
        action("建议行动", [
          { text: "在找到的方向上做一个有深度的项目" },
          { text: "利用免费资源（YouTube、Coursera、图书馆）深入学习" },
          { text: "参加相关比赛或社区活动" },
        ]),
        why("为什么这样规划", [{ text: "一个深度方向 + 免费资源 = 有力的申请素材" }]),
      ]},
      { ...middleStages()[2], sections: [
        action("建议行动", [
          { text: "整理探索历程和最终方向的发现过程" },
          { text: "把这个故事写成个人陈述的素材" },
          { text: "研究符合方向的学校和奖学金机会" },
        ]),
        why("为什么这样规划", [{ text: "探索本身就是一个好故事，前提是要有真诚的反思" }]),
      ]},
    ],
  },
};

// Get a route by ID, returns undefined if not found
// Guard against prototype keys (__proto__, constructor, etc.)
export function getRoute(routeId: string): Route | undefined {
  return Object.hasOwn(ROUTES, routeId) ? ROUTES[routeId] : undefined;
}

// Get all valid route IDs
export function getAllRouteIds(): string[] {
  return Object.keys(ROUTES);
}
