/**
 * G1 5月 Path Explorer seed data — single source of truth for both:
 *   1. demo (assets/vela.js consumes this)
 *   2. future Prisma seed (Day 1 implementation)
 *
 * Schema mirrors planned Prisma tables:
 *   PathStage  → 1 row (G1-G3 stage)
 *   PathGoal   → 1 row (G1-G3 自然观察 + 文化感知)
 *   PathActivity → 5 rows (c1 baseline + c2-c5 events)
 *
 * Field names align with Prisma — when migration lands, this file moves to
 * prisma/seed-data/ and gets imported by prisma/seed.ts directly.
 *
 * Scope: v0.1. No measurement/feedback fields (defer to v0.2+ when telemetry exists).
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECTION / BLOCK TYPES (PathActivity.sections JSON shape)
// ─────────────────────────────────────────────────────────────────────────────

export interface ActivitySection {
  target: string;        // subnav label, also used for in-page anchor
  numLabel?: string;     // '§ 1' / '§'
  title: string;         // section heading (may include emoji)
  chip?: string;         // optional chip next to heading: '90 MIN' / '辨识图'
  blocks: Block[];
}

export type Block =
  | ParagraphBlock
  | TriadBlock
  | RouteBlock
  | TriviaBlock
  | CalloutBlock
  | CalloutTrioBlock
  | PathOptsBlock
  | SubBlock
  | ListCheckBlock
  | ListBulletsBlock
  | PhotoRowBlock
  | IdTableBlock
  | StepsBlock
  | PhilosophyBlock
  | SourcesBlock
  | AsideNoteBlock;

export interface ParagraphBlock {
  type: 'paragraph';
  html: string;          // may contain inline <b>, <em>, <a class="cite">
  inlineStyle?: string;  // rare; used when demo has e.g. margin tweaks
}

export interface TriadBlock {
  type: 'triad';
  items: Array<{
    tag: string;         // e.g. '📍 场馆' / '📔 观察' / '📚 阅读'
    title: string;       // e.g. '1 次'
    freq: string;        // e.g. '1×' / '2–3×'
    html: string;        // body html
  }>;
}

export interface RouteBlock {
  type: 'route';
  steps: Array<{
    zone: string;
    desc: string;
    dur: string;         // e.g. '20–25′'
  }>;
  aside?: string;        // optional <p class="aside-note"> after steps
}

export interface TriviaBlock {
  type: 'trivia';        // teleprompter expandable card
  label: string;         // summary line, e.g. '长江区 · 南极区 · 6 条'
  head: string;          // tele-head, e.g. 'Parent · 现场念给孩子'
  sub?: string;          // optional tele-sub
  lines: string[];       // bullet content
  trailingCallout?: CalloutBlock; // c1 §4 has a heart callout after trivia
}

export interface CalloutBlock {
  type: 'callout';
  variant: 'output' | 'heart' | 'warn';
  lbl: string;           // zh-lbl content
  html: string;          // body html (may contain <b><p>)
}

export interface CalloutTrioBlock {
  type: 'callout-trio';
  items: Array<Omit<CalloutBlock, 'type'>>;
}

export interface PathOptsBlock {
  type: 'path-opts';
  opts: Array<{
    letter: string;      // 'A' / 'B' / 'C'
    label: string;       // '上海周边日返' / etc
    effort: string;      // 'Low Effort' / 'Med Effort' / 'Skip'
    effortKey: 'low' | 'med' | 'no';
    locCards?: Array<{
      photo: string;     // filename in assets/img/
      name: string;
      desc: string;
      link?: { gotoActivitySlug: string; label: string };
    }>;
    bodyHtml?: string;   // alternative to locCards (e.g. C: 远距离不推 — pure paragraph)
  }>;
}

export interface SubBlock {
  type: 'sub-block';
  // Type-level enforcement of the 1-level-deep nesting invariant — SubBlock
  // can only contain non-SubBlock children. Prevents accidental recursive
  // nesting in future seed data from blowing React's render stack.
  blocks: Exclude<Block, SubBlock>[];
}

export interface ListCheckBlock {
  type: 'list-check';
  items: string[];       // <li> html, may contain <b>
  intro?: string;        // optional intro paragraph above the list
}

export interface ListBulletsBlock {
  type: 'list-bullets';
  items: string[];
}

export interface PhotoRowBlock {
  type: 'photo-row';
  photos: Array<{ src: string; alt: string; cap: string }>;
}

export interface IdTableBlock {
  type: 'id-table';
  rows: Array<{
    photo: string;
    zh: string;
    trait: string;
    level: '易' | '中' | '难';
  }>;
  intro?: string;
  aside?: string;
}

export interface StepsBlock {
  type: 'steps';
  items: string[];       // <li> html, may contain <b><em><a class="cite">
}

export interface PhilosophyBlock {
  type: 'philosophy';
  lbl: string;
  html: string;
}

export interface SourcesBlock {
  type: 'sources';
  title: string;         // e.g. 'Sources · Day 3 authoring 补全'
  items: string[];
}

export interface AsideNoteBlock {
  type: 'aside-note';
  html: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATH STAGE / GOAL / ACTIVITY DATA TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PathStageData {
  slug: string;
  title: string;
  description: string;
  gradeFrom: number;
  gradeTo: number;
  orderIndex: number;
}

export interface PathGoalData {
  stageSlug: string;     // FK to PathStage.slug
  slug: string;          // own slug for cross-reference
  title: string;
  rationale: string;     // markdown
  horizon: 'month' | 'semester' | 'annual' | '2-year' | '3-year' | '5-year' | 'K-12';
  displayOrder: number;
}

export interface PathActivityData {
  goalSlug: string;      // 挂在哪个 PathGoal 下
  slug: string;          // 这张卡的唯一 slug，跨卡跳转引用用
  cardType: 'baseline' | 'event';   // baseline = 月度基本盘卡 / event = 事件卡
  month: number;         // 1-12 月份

  // ─── 卡片头部 / 列表展示 ───
  kicker: string;        // 卡片分类小标签，例: '月度基本盘' / '事件卡 · 节气'
  previews: string[];    // 列表预览图，assets/img/ 下的文件名数组
  title: string;         // 卡片大标题
  summary: string;       // 短摘要 HTML（可含 <b>）
  triggerLabel: string;  // 触发条件区块标题，例: '周期' / 'Trigger'
  triggerText: string;   // 触发条件描述 HTML
  chips: Array<{ cls: string; t: string }>;  // 头部标签 chip，cls: '' | 'forest' | 'brick'
  timeText: string;      // 时间投入描述 HTML，例: '一个月 3-5 次周末半天'
  timePct: string;       // 时间占用 chip，例: '≤ 40%' / '一次' / '常驻'

  // ─── 卡片内容（详情页展开） ───
  sections: ActivitySection[];

  displayOrder: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA: G1-G3 stage
// ─────────────────────────────────────────────────────────────────────────────

export const STAGE_G1_G3: PathStageData = {
  slug: 'g1-to-g3-foundation',
  title: 'G1-G3 自然 + 文化能力打底',
  description: 'Vela path explorer 的 early stage — 培养未来升学决策卡所需的观察 / 表达 / 文化深度。',
  gradeFrom: 1,
  gradeTo: 3,
  orderIndex: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: G1-G3 PathGoal (1 row, parents all 5 May activities)
// ─────────────────────────────────────────────────────────────────────────────

export const GOAL_G1_G3_FOUNDATION: PathGoalData = {
  stageSlug: 'g1-to-g3-foundation',
  slug: 'g1-g3-observation-culture-foundation',
  title: 'G1-G3 自然观察 + 文化感知能力打底',
  rationale: `
G1-G3 不直接面对升学，但这是培养"观察 / 记录 / 表达"能力 + "中文文化深度"的关键窗口。
这两类能力直接对接 G5+ 升学卡：

- **观察 / 记录 / 表达** → personal statement / 学校面试 / application essay 的素材库
  （不是临时编的，是 3 年积累下来的具体事；招生官能闻出 fabricated vs authentic）
- **中文文化深度** → 美高 / 国际学校 application 里的 differentiator
  （双语家庭的 cultural identity 是 American-Chinese 申请人最稀缺的资产之一）

方法：每月固定 routine + 应季 event。Routine 保持习惯 / 工具在用，event 制造记忆点和高质量素材。
5 月作为 G1 第一年的样本月，包含 1 张 routine baseline + 4 张 event 卡（劳动节 / 立夏 / 崇明东滩 / 初夏家门口生态）。
  `.trim(),
  horizon: '3-year',
  displayOrder: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PathActivity c1 — G1 五月 routine (baseline) — PILOT
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_C1_MAY_ROUTINE: PathActivityData = {
  goalSlug: 'g1-g3-observation-culture-foundation',
  slug: 'g1-may-routine',
  cardType: 'baseline',
  month: 5,

  kicker: '月度基本盘',
  previews: ['dino_snhm.jpg', 'sturgeon.jpg', 'panda.jpg'],
  title: 'G1 五月怎么过',
  summary: '五月春末夏初，天气刚好。周末 2–3 次小事，<b>本子别空着</b>就行。',
  triggerLabel: '节奏',
  triggerText: '每周末 2–3 件小事 · 不必每次都做 · 接得上比一次猛冲重要',
  chips: [
    { cls: 'forest', t: '5 月 · 整月' },
    { cls: '', t: '场馆 + 观察 + 阅读' },
  ],
  timeText: '一个月 <b>3–5 次</b>周末半天 · 一半以上时间留给别的事',
  timePct: '≤ 40%',
  displayOrder: 1,

  sections: [
    {
      target: '本月节奏',
      numLabel: '§ 1',
      title: '本月 3 件事',
      blocks: [
        {
          type: 'triad',
          items: [
            {
              tag: '📍 场馆',
              title: '1 次',
              freq: '1×',
              html: '天热了挑室内的——<b>上海自博</b>或<b>海洋馆</b>都行。5/1–3 人最多，往后排到 5/4 或 5/5。',
            },
            {
              tag: '📔 观察',
              title: '小区 / 公园',
              freq: '2–3×',
              html: '春末夏初本来就什么都多——落花、新叶、刚出来的虫子。带本子下楼走 10–20 分钟，<b>她想画啥就画啥</b>，次数随缘。',
            },
            {
              tag: '📚 阅读',
              title: '杂志 + 视频',
              freq: '1–2×',
              html: '<b>《博物》5 月号</b>到家翻一翻，挑 1 篇跟她一起读。周末晚上 20–30 分钟，B 站 "无穷小亮" 或 "星球研究所" 看 1 期——不用每周。',
            },
          ],
        },
      ],
    },
    {
      target: '自博路线',
      numLabel: '§ 2',
      title: '上海自博 · G1 推荐路线',
      chip: '90 MIN',
      blocks: [
        {
          type: 'route',
          steps: [
            { zone: '生命长河 · 恐龙 + 古生物大厅', desc: '进门别犹豫，先冲恐龙厅。G1 一进去就站住不走的那种区。', dur: '20–25′' },
            { zone: '生态万象 · 上海 / 华东本土生态', desc: '她在东滩 / 动物园见过的活的，这里能看到固定展出的版本。', dur: '15–20′' },
            { zone: '探索中心 · 互动玩', desc: '能摸能玩的区。前面看累了，最后扔到这放放电。', dur: '20–25′' },
            { zone: '礼品店', desc: '让她自己挑一个 50 块以内的小东西。下次还想来。', dur: '5′' },
          ],
          aside: '※ 展区位置以当天导览图为准，会不定期调整。',
        },
      ],
    },
    {
      target: '海洋馆路线',
      numLabel: '§ 3',
      title: '上海海洋水族馆 · G1 推荐路线',
      chip: '90 MIN',
      blocks: [
        {
          type: 'route',
          steps: [
            { zone: '海底隧道 · 第一眼震撼', desc: '头顶上鱼游过去——大部分 G1 第一次见。', dur: '10–15′' },
            { zone: '长江区 · 中国淡水', desc: '中华鲟、扬子鳄。可以告诉她 "这些动物就住在离我们不远的长江里"。', dur: '15–20′' },
            { zone: '非洲区 + 南极区', desc: '看大鱼，看企鹅。', dur: '20–25′' },
            { zone: '互动触摸池（若开放）', desc: '—', dur: '10–15′' },
          ],
        },
      ],
    },
    {
      target: '小故事',
      numLabel: '§ 4',
      title: '现场念给孩子的小故事',
      blocks: [
        {
          type: 'trivia',
          label: '长江区 · 南极区 · 6 条',
          head: '现场念给孩子',
          sub: '不用提前背。她指到哪里，你翻到哪里。念一两条就够。',
          lines: [
            '中华鲟是 "活化石"——1.5 亿年前就在地球上，比恐龙活得还久。',
            '中华鲟每年会从东海游回长江产卵，一路能游 2000 多公里。',
            '扬子鳄是地球上只有中国才有的鳄鱼，全世界就它一种 "只住中国"。',
            '长江江豚被叫 "微笑天使"，但全球只剩约 1000 头。',
            '企鹅不是 "北极动物"——南极才有野生企鹅，北极没有。',
            '企鹅的翅膀不是用来飞的，是演化成了 "游泳桨"。',
          ],
          trailingCallout: {
            type: 'callout',
            variant: 'heart',
            lbl: '怎么用',
            html: '不用提前背。她指哪你翻哪，念一两条就够。<b>Vela 就是个提词器，不是要你做作业。</b>',
          },
        },
      ],
    },
    {
      target: '产出 · 心法',
      numLabel: '§ 5',
      title: '产出 · 心法',
      blocks: [
        {
          type: 'callout-trio',
          items: [
            {
              variant: 'output',
              lbl: '本月产出',
              html: '本子多 1–3 页 · 场馆去 1 次 · 杂志 1–2 篇 · 视频 1–2 期。',
            },
            {
              variant: 'heart',
              lbl: '心法',
              html: '5 月不用憋大招。<b>能把 4 月的事接着做，就已经赢了。</b>',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PathActivity c2 — 劳动节 5 天 (event)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_C2_LABOR_DAY: PathActivityData = {
  goalSlug: 'g1-g3-observation-culture-foundation',
  slug: 'g1-may-labor-day-holiday',
  cardType: 'event',
  month: 5,

  kicker: '事件卡 · 节假日',
  previews: ['century_park.jpg'],
  title: '劳动节 5 天',
  summary: '<b>3 条路径按距离挑</b>：上海周边日返 · 长三角小旅 · 远距离（不推）。5 天用 <b>1–2 天</b>带她出门，其余留家里。',
  triggerLabel: 'Trigger',
  triggerText: '每年 5/1–5 法定假期 · 2026 年为 <b>5 月 1 日（周五）至 5 月 5 日（周二）</b>。',
  chips: [
    { cls: 'brick', t: '5/1 – 5/5' },
    { cls: '', t: '2026 · 周五–周二' },
  ],
  timeText: '建议 <b>1–2 天</b>带她出门 · 其余留给家庭别的事',
  timePct: '≤ 40%',
  displayOrder: 2,

  sections: [
    {
      target: '3 种路径',
      numLabel: '§',
      title: '选一条路径',
      chip: '按距离 / 精力',
      blocks: [
        {
          type: 'path-opts',
          opts: [
            {
              letter: 'A',
              label: '上海周边日返',
              effort: 'Low Effort',
              effortKey: 'low',
              locCards: [
                {
                  photo: 'avocet.jpg',
                  name: '崇明东滩 · 5/10 前',
                  desc: '看最后一批迁徙候鸟',
                  link: { gotoActivitySlug: 'chongming-spring-migration-tail', label: '打开独立事件卡 →' },
                },
                {
                  photo: 'sheshan.jpg',
                  name: '佘山国家森林公园',
                  desc: '5 月林下植物 + 昆虫开始多，G1 一年级合适',
                },
                {
                  photo: 'century_park.jpg',
                  name: '世纪公园',
                  desc: '浦东市区绿肺 · 家门口走走带本子，不用出远门',
                },
                {
                  photo: 'gongqing.jpg',
                  name: '共青森林公园',
                  desc: '杨浦绿肺 · 骑行 + 写生都行',
                },
              ],
            },
            {
              letter: 'B',
              label: '长三角 2–3 天小旅行',
              effort: 'Med Effort',
              effortKey: 'med',
              locCards: [
                { photo: 'ningbo_zoo.jpg', name: '宁波雅戈尔动物园', desc: '高铁 1 小时半，近年口碑好' },
                { photo: 'hongshan.jpg', name: '南京红山森林动物园', desc: '本土动物多，一年级正合适' },
                { photo: 'taihu.jpg', name: '苏州太湖湿地公园', desc: '适合带小孩第一次观鸟' },
              ],
            },
            {
              letter: 'C',
              label: '远距离不推',
              effort: 'Skip',
              effortKey: 'no',
              bodyHtml: 'G1 一年级 5 天假别远飞。成都 / 云南都太折腾，路上耗的时间比玩的还多。<b>留到 7–8 月暑假。</b>',
            },
          ],
        },
      ],
    },
    {
      target: '避坑',
      numLabel: '§',
      title: '避坑提示',
      blocks: [
        {
          type: 'callout',
          variant: 'warn',
          lbl: '避坑',
          html: '5/1–3 上海各场馆人最多。<b>提前订票 + 尽量挪到 5/4 或 5/5。</b>',
        },
      ],
    },
    {
      target: '产出 · 心法',
      numLabel: '§',
      title: '产出 · 心法',
      blocks: [
        {
          type: 'callout-trio',
          items: [
            {
              variant: 'output',
              lbl: '产出',
              html: '一次小旅行 · 照片若干 + 本子上 1–2 页新地方的记录。',
            },
            {
              variant: 'heart',
              lbl: '心法',
              html: '劳动节不是赶日程，是换个节奏。<b>让她看一眼平常看不到的地方，就够了。</b>',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PathActivity c3 — 立夏 (event · solar term)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_C3_LIXIA: PathActivityData = {
  goalSlug: 'g1-g3-observation-culture-foundation',
  slug: 'g1-may-lixia-solar-term',
  cardType: 'event',
  month: 5,

  kicker: '事件卡 · 节气',
  previews: ['lixia.jpg', 'sprout.jpg'],
  title: '立夏',
  summary: '立夏是 <b>文化 + 自然双重锚点</b>——既有传统习俗，也是春末转夏的明显节点。24 节气，是她跟自然对表的方式。',
  triggerLabel: 'Trigger',
  triggerText: '每年 5 月上旬立夏节气 · 2026 年为 <b>5 月 5 日（周二）</b>，正好在劳动节假期内。',
  chips: [
    { cls: 'brick', t: '5 / 5' },
    { cls: '', t: '周二 · 在劳动节假内' },
    { cls: 'forest', t: '1–2 小时' },
  ],
  timeText: '<b>1–2 小时</b>就够 · 每年 5/5 重复一次',
  timePct: '一次',
  displayOrder: 3,

  sections: [
    {
      target: '外观察',
      numLabel: '§ 1',
      title: '🌿 外观察',
      chip: '5–10 MIN',
      blocks: [
        {
          type: 'sub-block',
          blocks: [
            {
              type: 'list-check',
              intro: '在小区 / 公园 / 阳台看今天和 4 月初有什么不同。重点三样：',
              items: [
                '<b>树叶颜色</b> · 嫩绿 → 深绿',
                '<b>第一批夏虫</b> · 蚂蚁、蝴蝶比 4 月多',
                '<b>花谢花开</b> · 春花落，夏花刚出苞',
              ],
            },
          ],
        },
      ],
    },
    {
      target: '家里活动',
      numLabel: '§ 2',
      title: '🏠 家里传统小活动',
      chip: '挑 1 个',
      blocks: [
        {
          type: 'list-bullets',
          items: [
            '<b>立夏蛋</b> · 煮几个鸡蛋，用棉线网装上挂她胸前，和邻居 / 同学比蛋。传统 "立夏斗蛋"。',
            '<b>立夏秤人</b> · 用家里体重秤称她，说 "立夏称了，夏天长得顺"。一年同一天秤一次，看她 1 年长多少。',
            '<b>种一颗</b> · 绿豆 / 黄豆 / 向日葵种在小花盆，每天记一笔发芽 / 长高。节气当种子的时间表。',
            '<b>采新绿做书签</b> · 捡地上 2–3 片新叶（不折树上的），夹书里一周晾干做成节气书签。',
          ],
        },
        {
          type: 'photo-row',
          photos: [
            { src: 'lixia_egg.jpg', alt: '立夏蛋', cap: '立夏蛋' },
            { src: 'sprout.jpg', alt: '发芽的种子', cap: '发芽的种子' },
            { src: 'leaf_bookmark.jpg', alt: '新绿书签 · 压叶', cap: '新绿书签' },
          ],
        },
      ],
    },
    {
      target: '观察本',
      numLabel: '§ 3',
      title: '📔 观察本记录',
      blocks: [
        {
          type: 'sub-block',
          blocks: [
            {
              type: 'paragraph',
              html: '用 1 页写 <b>"5 月 5 日 立夏 我看到..."</b>。她自己的方式，随便画随便写。',
            },
          ],
        },
      ],
    },
    {
      target: '小故事',
      numLabel: '§ 4',
      title: '可以讲的小故事',
      blocks: [
        {
          type: 'trivia',
          label: '立夏的出处 · 3 条',
          head: '现场念给孩子',
          lines: [
            '立夏在《礼记》里叫 "孟夏之月"，古代皇帝要去南郊祭祀迎夏。',
            '陆游写过一首《立夏前二日作》："赤帜插城扉，东君整驾归"。',
            '老上海人立夏这天吃 "七家茶"——从七户邻居家讨一撮茶叶混着泡。',
          ],
        },
      ],
    },
    {
      target: '产出 · 心法',
      numLabel: '§ 5',
      title: '产出 · 心法',
      blocks: [
        {
          type: 'callout-trio',
          items: [
            {
              variant: 'output',
              lbl: '产出',
              html: '本子上 1 页节气记录 + 家里留一样东西（蛋壳 / 种苗 / 书签 / 体重数）。<b>每年 5/5 翻这一页，她能看到自己 1 年长了多少。</b>',
            },
            {
              variant: 'heart',
              lbl: '心法',
              html: '节气不是表演传统文化，是<b>季节感的锚点</b>。让她知道一年不只有 "放假 / 上学"，还有自然的节奏。',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PathActivity c4 — 崇明东滩 · 迁徙尾声 (event · migration)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_C4_CHONGMING: PathActivityData = {
  goalSlug: 'g1-g3-observation-culture-foundation',
  slug: 'chongming-spring-migration-tail',
  cardType: 'event',
  month: 5,

  kicker: '事件卡 · 候鸟',
  previews: ['avocet.jpg', 'stilt.jpg', 'dunlin.png', 'gull.jpg'],
  title: '崇明东滩 · 迁徙尾声',
  summary: '春季鸟类迁徙主季是 3–4 月，5 月初还能赶上最后一批。<b>错过就要等 10 月秋季迁徙</b>——她第一次能感受到 "自然有档期"。',
  triggerLabel: 'Trigger',
  triggerText: '每年 5 月上中旬 · 春季候鸟最后一批离开上海 · <b>5 月中旬后基本就看不到了</b>。',
  chips: [
    { cls: 'brick', t: '5/1 – 5/15' },
    { cls: '', t: '前置 · 1 次场馆经验' },
    { cls: 'forest', t: '半天 · 6–8 小时' },
  ],
  timeText: '一次 <b>半天</b> · 含往返 6–8 小时',
  timePct: '一次',
  displayOrder: 4,

  sections: [
    {
      target: '辨识图',
      numLabel: '§ 1',
      title: '出发前 5–10 分钟看这 5 种',
      chip: '辨识图',
      blocks: [
        {
          type: 'id-table',
          intro: '出发前翻一下，给孩子 "预习"：',
          rows: [
            { photo: 'avocet.jpg', zh: '反嘴鹬', trait: '黑白相间，嘴长且向上翘，像 "反" 过来的针', level: '易' },
            { photo: 'stilt.jpg', zh: '黑翅长脚鹬', trait: '背黑、腹白、粉红色腿超长，远看像踩高跷', level: '易' },
            { photo: 'plover.jpg', zh: '金眶鸻', trait: '小型鸻鹬，眼周金黄色环。G1 看不清细节，但 "小圆身" 好认', level: '中' },
            { photo: 'dunlin.png', zh: '黑腹滨鹬', trait: '繁殖羽时腹部明显黑色斑，群体活动', level: '中' },
            { photo: 'gull.jpg', zh: '红嘴鸥', trait: '红色嘴、灰白身。常见种，5 月还能看到最后一批', level: '易' },
          ],
          aside: '※ 不求 5 种全看到，能认出 1–2 种就够了。',
        },
      ],
    },
    {
      target: '操作步骤',
      numLabel: '§ 2',
      title: '怎么做 · 按顺序',
      blocks: [
        {
          type: 'steps',
          items: [
            '<b>周一查</b> · <a class="cite" href="https://www.shwbs.org" target="_blank" rel="noopener noreferrer">上海野鸟会 shwbs.org</a>（Shanghai Wild Bird Society 官方名）公众号，看 5/1–15 有没有家庭公开带队活动。',
            '<b>有带队跟团</b> · 带望远镜（没有也行，用手机最大变焦）+ 防晒 + 防蚊喷雾 + 水 + 零食。带队会讲解。',
            '<b>无带队自行去</b> · 崇明东滩南六公路入口，<a class="cite" href="https://www.dongtan.cn" target="_blank" rel="noopener noreferrer">dongtan.cn</a> 查当日开放时间。',
            '<b>现场</b> · 能认出 1–2 种 + 看到一次 "一群飞起" 或 "一次进食"，就已经值了。<em>G1 注意力有限，30–60 分钟安静看就够。</em>',
            '<b>拍摄</b> · 现场拍 5–10 张照片 + 2–3 段 15 秒视频。回家 5 分钟挑出 1–2 张有鸟 + 1 段最好的，放命名文件夹（如 "2026-05-10 东滩"）。长期攒下来就是她的素材库。',
            '<b>回家本子</b> · 记 1–2 种观察到的鸟 + 日期 + 天气 + 简单印象句。',
          ],
        },
      ],
    },
    {
      target: '避坑',
      numLabel: '§ 3',
      title: '避坑',
      blocks: [
        {
          type: 'callout',
          variant: 'warn',
          lbl: '避坑',
          html: '5 月中旬后基本看不到春季候鸟，<b>别白跑</b>。自驾往返 2 小时 + 现场 30 分钟看不到鸟，小孩挫败感重。宁可 <b>5/10 前</b>去。',
        },
      ],
    },
    {
      target: '备选',
      numLabel: '§ 4',
      title: '备选方案 · 看不到鸟',
      blocks: [
        {
          type: 'sub-block',
          blocks: [
            {
              type: 'paragraph',
              html: 'G1 去东滩有一定挫败风险（远 + 天气依赖 + 鸟靠运气）。<b>预先和孩子说好</b> "如果今天运气不好看不到鸟，我们去别的地方"，挫败感就降一半。',
            },
            {
              type: 'list-bullets',
              items: [
                '<b>就近备选 · 崇明岛内</b> · 东平国家森林公园 + 岛上农家菜收尾',
                '<b>回程备选</b> · 辰山植物园（松江，5 月花季正盛）',
                '<b>完全不去崇明</b> · 世纪公园 / 佘山国家森林公园',
              ],
            },
            {
              type: 'philosophy',
              lbl: '备选的意义',
              html: '提前留好 2–3 个备选，家长才敢带她出门。一次成功 + 几次 "看不到也 OK" 的记忆，她以后才不抗拒出去走走。<b>这个底比 "每次都看到鸟" 重要。</b>',
            },
          ],
        },
      ],
    },
    {
      target: '产出 · 心法',
      numLabel: '§ 5',
      title: '产出 · 心法',
      blocks: [
        {
          type: 'callout-trio',
          items: [
            {
              variant: 'output',
              lbl: '产出',
              html: '迁徙季最后一次观察记录。素材库里多了一条带季节性的（文字 + 照片 + 日期）。',
            },
            {
              variant: 'heart',
              lbl: '心法',
              html: '自然有档期。错过这次等半年。<b>这条经验她会记很久。</b>',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PathActivity c5 — 初夏家门口生态 (event · near-door)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTIVITY_C5_NEAR_DOOR: PathActivityData = {
  goalSlug: 'g1-g3-observation-culture-foundation',
  slug: 'g1-may-near-door-ecology',
  cardType: 'event',
  month: 5,

  kicker: '事件卡 · 家门口',
  previews: ['cabbage_white.jpg', 'pill_bug.jpg', 'black_ant.jpg', 'tree_sparrow.jpg'],
  title: '初夏家门口生态',
  summary: '前面几张卡都有 "要去某地" 的门槛。这张卡反过来——<b>她家 50 米内就有 100 种生物</b>。门槛低，频次高。',
  triggerLabel: 'Trigger',
  triggerText: '每年 5 月下旬起（上海大致 5/20 后），气温稳定 20°C 以上 · 只要家附近有绿化就行。',
  chips: [
    { cls: 'brick', t: '5/20 之后' },
    { cls: '', t: '气温 20°C+' },
    { cls: 'forest', t: '一周 2–3 次 · 15–30 分钟' },
  ],
  timeText: '每次 <b>15–30 分钟</b> · 一周 2–3 次 · 无上限',
  timePct: '常驻',
  displayOrder: 5,

  sections: [
    {
      target: '5 种生物',
      numLabel: '§ 1',
      title: '5 种家门口可见的初夏生物',
      blocks: [
        {
          type: 'id-table',
          rows: [
            { photo: 'cabbage_white.jpg', zh: '菜粉蝶 · 白蝴蝶', trait: '小区花坛，任何开花植物 · 她第一个认识的蝴蝶', level: '易' },
            { photo: 'common_mormon.jpg', zh: '玉带凤蝶 · 大黑黄蝴蝶', trait: '公园里飞得高 · 比菜粉蝶大 3 倍，一眼感觉不一样', level: '易' },
            { photo: 'black_ant.jpg', zh: '家蚁 / 黑蚁', trait: '任何人行道砖缝 · 带她看蚁道（蚂蚁搬东西的路线）', level: '易' },
            { photo: 'pill_bug.jpg', zh: '西瓜虫 · 潮虫', trait: '花盆底 / 落叶下 / 石头下 · "会缩成球的小灰虫"，G1 最爱', level: '易' },
            { photo: 'tree_sparrow.jpg', zh: '树麻雀 · 家麻雀', trait: '家楼下、街角、任何树上 · "这也是鸟"——不是只有东滩才有鸟', level: '易' },
          ],
        },
      ],
    },
    {
      target: '怎么做',
      numLabel: '§ 2',
      title: '怎么做 · 随意组合',
      blocks: [
        {
          type: 'steps',
          items: [
            '<b>蚁道观察 · 15 分钟</b><br>选一段有蚂蚁活动的人行道砖缝，和她一起蹲下看 5 分钟。看蚂蚁从哪到哪、搬什么、怎么遇到同伴。回来本子画一条蚁道。',
            '<b>蝴蝶追踪 · 20 分钟</b><br>小区花坛边等 5 分钟，通常会有 1–2 种蝴蝶来。不追蝶，只看它停下来的几秒。',
            '<b>潮虫探险 · 10 分钟</b><br>搬开花盆 / 石头 / 落叶堆，看底下的西瓜虫 / 蚯蚓。用手轻轻碰一下看它蜷成球。<em>G1 对这种立刻有反应的事最有感。</em>',
            '<b>楼下鸟声 · 5 分钟</b><br>阳台静坐，听麻雀 "喳喳" / 斑鸠 "咕咕" / 白头鹎清晨的歌声。<em>她能分出 2 种就够。</em>',
          ],
        },
      ],
    },
    {
      target: '避坑',
      numLabel: '§ 3',
      title: '避坑 · 3 条原则',
      blocks: [
        {
          type: 'callout',
          variant: 'warn',
          lbl: '避坑',
          html: '<p><b>别用昆虫盒装回家。</b>G1 好奇心强，很容易就升级成 "抓"。教育重点是观察在野外，不是 "带回家养死"。</p><p><b>别用杀虫剂 / 驱蚊液喷她的观察对象。</b>她看蝴蝶不用喷。</p><p><b>别强求 "记住学名"。</b>中文名 / 外号 / "那种会飞的蓝蝴蝶" 都行。</p>',
        },
      ],
    },
    {
      target: '产出 · 心法',
      numLabel: '§ 4',
      title: '产出 · 心法',
      blocks: [
        {
          type: 'callout-trio',
          items: [
            {
              variant: 'output',
              lbl: '产出',
              html: '本子上的 <b>"家门口生物清单"</b>——一个月攒下来能有 10–20 种。这个数字她自己看着，会越来越得意。',
            },
            {
              variant: 'heart',
              lbl: '心法',
              html: '自然不只在远方的保护区。<b>家门口 50 米内就有完整的城市生态。</b>时间长了她说 "自然" 这个词会变化——从 "我在公园里看到过" 变成 "我家楼下的麻雀今年比去年少"。',
            },
          ],
        },
      ],
    },
    {
      // §5 在 demo 里没有 d-sec-head，title 留空，渲染层 detect 到 empty 就跳过 head
      target: '来源',
      title: '',
      blocks: [
        {
          type: 'sources',
          title: '来源 · 后续补全',
          items: [
            '《身边的昆虫》· 科普出版社',
            '《中国鸟类野外手册》· 湖南教育出版社（G2–G3 用）',
            'iNaturalist APP 里 "上海" 区域的 top observed species list',
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATE export — what demo (vela.js) and future seed.ts both consume
// ─────────────────────────────────────────────────────────────────────────────

export const G1_MAY_SEED = {
  stage: STAGE_G1_G3,
  goals: [GOAL_G1_G3_FOUNDATION],
  activities: [
    ACTIVITY_C1_MAY_ROUTINE,
    ACTIVITY_C2_LABOR_DAY,
    ACTIVITY_C3_LIXIA,
    ACTIVITY_C4_CHONGMING,
    ACTIVITY_C5_NEAR_DOOR,
  ],
};
