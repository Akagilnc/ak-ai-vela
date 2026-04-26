/**
 * G1 6月 Path Explorer seed data — second-month sample for v0.2.
 *
 * Schema mirrors `g1-may-seed.ts`:
 *   PathStage  → reuses STAGE_G1_G3 (same row, upserted by slug)
 *   PathGoal   → reuses GOAL_G1_G3_FOUNDATION (annual goal spans 12 months)
 *   PathActivity → 4 rows (1 baseline + 3 events)
 *
 * Card count is content-driven, NOT a fixed 5. June has 3 strong event
 * candidates (端午 / 入梅 / 萤火虫). 芒种节气 + World Oceans Day were
 * evaluated and intentionally cut — the G1-G3 user-facing hook isn't
 * strong enough to carry a card on its own. Better cut than padded.
 *
 * 2026 calendar references in this file:
 *   - 端午节 (Dragon Boat Festival): 2026/06/19–06/21 (Fri-Sun, 3-day holiday)
 *   - 芒种 (solar term): 2026/06/05
 *   - 入梅 (Shanghai rainy-season start, annual avg 6/19, range 6/10–6/19
 *           in recent years per 上海本地宝; met bureau publishes within
 *           7 days of actual onset)
 *   - 夏至: 2026/06/21 (overlaps 端午 last day + Father's Day)
 *   - 萤火虫 peak: ~ 2026/06/21 – 2026/07/15 (Shanghai near-suburb sites,
 *                  density actually higher in early-mid July than at solstice)
 *
 * Previews: filled with Wikipedia Commons CC-licensed photos for each card's
 * dominant subject. Filename → license info in `public/assets/img/species-info.txt`.
 */

import type {
  ActivitySection,
  PathActivityData,
  PathGoalData,
} from './g1-may-seed';
import {
  STAGE_G1_G3,
  GOAL_G1_G3_FOUNDATION,
} from './g1-may-seed';

// ─────────────────────────────────────────────────────────────────────────────
// DATA: c1 — G1 六月 routine (baseline)
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS_C1: ActivitySection[] = [
  {
    target: '本月节奏',
    numLabel: '§ 1',
    title: '本月 3 件事',
    blocks: [
      {
        type: 'paragraph',
        html: '六月是<b>节气挤、雨水多</b>的过渡月：端午 3 天小长假、入梅前后家门口生态突变、萤火虫高峰只开一周窗。每件事都不必大投入。',
      },
      {
        type: 'triad',
        items: [
          {
            tag: '🥟 节假日',
            title: '1 次',
            freq: '1×',
            html: '<b>端午 3 天</b>：江浙短途 / 上海周边 / 家里草药小活动，三选一即可。',
          },
          {
            tag: '🐌 入梅',
            title: '2–3 次',
            freq: '2–3×',
            html: '<b>家门口雨季观察</b>：青蛙、蜗牛、蚯蚓——雨季 1–2 周内集中。',
          },
          {
            tag: '✨ 萤火虫',
            title: '1 次',
            freq: '1×',
            html: '<b>夏至前后 1 次夜观</b>：滨江森林 / 上海植物园 / 近郊水网。错过等明年。',
          },
        ],
      },
    ],
  },
  {
    target: '入梅前后',
    numLabel: '§ 2',
    title: '入梅前后家门口会变什么',
    chip: '1 周内变化',
    blocks: [
      {
        type: 'paragraph',
        html: '入梅前 1 周：天闷、傍晚蚊子多、知了开始零散叫。入梅当天前后：第一场连续大雨 → 第二天清晨家门口能看到<b>蜗牛集体爬上墙、蚯蚓被冲到人行道、青蛙在小区水景叫</b>。1 周内的连续变化是孩子能自己看见的物候。',
      },
      {
        type: 'list-bullets',
        items: [
          '<b>蜗牛</b>：雨后第二天早上 7 点前出门最多。能看见的位置：小区花坛石头、墙根、湿润绿叶下。',
          '<b>蚯蚓</b>：人行道、操场边缘。教孩子<b>不抓不踩</b>，用小棍轻拨回土里。',
          '<b>青蛙叫声</b>：傍晚 7–9 点。市区小区的水景 / 公园池塘最稳，听 1–2 分钟就行。',
          '<b>潮虫（鼠妇）</b>：花盆下、湿木头下。会卷球的那种。',
        ],
      },
    ],
  },
  {
    target: '暑期前奏',
    numLabel: '§ 3',
    title: '6 月底 → 暑期预备',
    blocks: [
      {
        type: 'paragraph',
        html: '上海公办小学一般 6/30 前后开始放暑假。六月最后一周不用赶活动，<b>留出留白</b>给孩子收尾本学期作业 + 期末。<b>暑期主线之后再接上</b>。',
      },
      {
        type: 'callout',
        variant: 'heart',
        lbl: '心法',
        html: '<p>六月节气密、家长容易想"全都做"。<b>挑 1 件做透</b>比 4 件都做一半强。她记住的是"6 月看了一次萤火虫"，不是"做了 6 件事"。</p>',
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
            html: '本子上 <b>"6 月观察清单"</b>——至少 1 个雨季动物 + 1 个夜观记录。两条就够。',
          },
          {
            variant: 'heart',
            lbl: '心法',
            html: '5 月在远方（崇明、自博），6 月回到家门口。<b>家门口反而是观察"自然有节奏"的最好实验室</b>，因为变化是孩子能在 1 周内自己看见的。',
          },
        ],
      },
    ],
  },
];

export const ACTIVITY_C1_JUN_ROUTINE: PathActivityData = {
  goalSlug: GOAL_G1_G3_FOUNDATION.slug,
  slug: 'g1-jun-routine',
  cardType: 'baseline',
  month: 6,

  kicker: '月度基本盘',
  // Baseline carries no previews — event cards below already show those
  // species (snail/firefly/mugwort were duplicated here, making the tile
  // list visually redundant). The 节奏 card is a navigation/rhythm card,
  // its title alone is enough to identify it. Different shape (no preview
  // row) also makes baseline visually distinct from event cards.
  previews: [],
  title: 'G1 六月怎么过',
  summary: '六月节气挤、雨水多。<b>挑 1 件做透</b>比 4 件做一半强。',
  triggerLabel: '节奏',
  triggerText: '6/19–21 端午 3 天 + 入梅家门口 2–3 次 + 萤火虫 1 次夜观 · 总投入约 4 个半天',
  chips: [
    { cls: 'forest', t: '6 月 · 整月' },
    { cls: '', t: '节假日 + 雨季 + 夜观' },
  ],
  timeText: '<b>4 个半天</b>左右 · 端午一段 + 家门口若干 + 萤火虫一晚',
  timePct: '≤ 35%',
  sections: SECTIONS_C1,
  displayOrder: 1,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: c2 — 端午节假期 (event)
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS_C2: ActivitySection[] = [
  {
    target: '选一条路径',
    numLabel: '§ 1',
    title: '三种路径选一条',
    blocks: [
      {
        type: 'path-opts',
        opts: [
          {
            letter: 'A',
            label: '上海周边日返',
            effort: 'Low Effort',
            effortKey: 'low',
            bodyHtml:
              '<b>闵行浦江郊野公园</b>——端午前后有官方"召楼粽情"端午文化节（非遗市集 + 民俗游戏 + 包粽子体验，文旅部官方推广），4A 景区，地铁 8 号线沿园区延伸。<b>嘉定毛桥集市</b>是配套选项（生态市集 + 小吃）。一日往返，下午 3 点前回家避高峰。',
          },
          {
            letter: 'B',
            label: '江浙短途 2 晚',
            effort: 'Med Effort',
            effortKey: 'med',
            bodyHtml:
              '<b>绍兴上虞 / 台州 / 宁波</b>——浙江粽子 + 杨梅核心产区。<b>浙江杨梅 6 月初就开始上市</b>，端午（6/19）正在杨梅季中后期（已熟透到落市前）；可去民宿提前约采摘。两晚短住，避开高速 6/19 早 + 6/21 晚两次峰值。',
          },
          {
            letter: 'C',
            label: '家里搞',
            effort: 'Skip',
            effortKey: 'no',
            bodyHtml:
              '不出门也行。买<b>新鲜艾草 + 菖蒲</b>（菜场或社区团购），让孩子摸 / 闻 / 认。包 5 个粽子（速冻粽叶超市有），和孩子一起绑线。比远途奔波留下的具体感受更多。',
          },
        ],
      },
    ],
  },
  {
    target: '草药识别',
    numLabel: '§ 2',
    title: '端午草药 · 现场认 3 种',
    chip: '辨识',
    blocks: [
      {
        type: 'paragraph',
        html: '端午挂草药习俗里最常见的 3 种——都能在菜场或花市买到。<b>不是要她背名字，是让她记住气味</b>。',
      },
      {
        type: 'list-check',
        items: [
          '<b>艾草（Artemisia argyi）</b>——灰绿色绒毛叶，揉碎闻 → 苦清香。常见用法：挂门 / 泡脚水。',
          '<b>菖蒲（Acorus calamus）</b>——长条剑叶，闻起来像姜 + 柠檬。和艾草成对挂。',
          '<b>雄黄</b>——不是植物，是<b>含砷矿物粉</b>，加热分解出三氧化二砷（剧毒、可经吸入累积）。<u>别让孩子接触粉末，也不要让她去闻</u>。古方点额头是仪式感不是药用，<b>看图认识就行</b>。',
        ],
      },
    ],
  },
  {
    target: '粽叶来源',
    numLabel: '§ 3',
    title: '粽叶其实是箬竹叶',
    blocks: [
      {
        type: 'paragraph',
        html: '粽叶不是"竹子的叶子"，是<b>箬竹（Indocalamus tessellatus）</b>专门长的宽叶子。江浙家庭包粽用鲜箬叶煮过（消毒 + 软化），北方多用芦苇叶。让孩子比较：<b>新鲜箬叶 vs 干箬叶</b>，气味差异很明显。',
      },
      {
        type: 'callout',
        variant: 'warn',
        lbl: '避坑',
        html: '<p><b>市售"粽叶"多数是干箬叶</b>——颜色偏褐绿、硬。如果想让孩子见到鲜叶，菜场端午前 1 周问"鲜粽叶"，或者江浙短途路上的农家最稳。</p>',
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
            html: '本子上画 <b>艾 + 菖蒲 + 箬叶</b> 3 种叶子的轮廓——不必精确，记住"形状不同"就行。',
          },
          {
            variant: 'heart',
            lbl: '心法',
            html: '<b>节日仪式 = 一年一次的物候记忆锚点</b>。她明年 6 月再闻到艾草，会自动想起"哦端午"。这种气味记忆比"端午是纪念屈原"留得更久。',
          },
        ],
      },
    ],
  },
];

export const ACTIVITY_C2_JUN_DRAGON_BOAT: PathActivityData = {
  goalSlug: GOAL_G1_G3_FOUNDATION.slug,
  slug: 'g1-jun-dragon-boat-festival',
  cardType: 'event',
  month: 6,

  kicker: '事件卡 · 节假日',
  previews: ['mugwort.jpg', 'sweet_flag.jpg', 'zongzi.jpg'],
  title: '端午 3 天',
  summary: '<b>挑 1 条路径</b>（上海周边 / 江浙短途 / 家里搞），重点是让她<b>闻到艾草和粽叶</b>。',
  triggerLabel: 'Trigger',
  triggerText: '2026/06/19（五）– 06/21（日） · 3 天小长假',
  chips: [
    { cls: 'brick', t: '6/19–21' },
    { cls: '', t: '节日 + 草药 + 粽叶' },
  ],
  timeText: '<b>1 天</b>核心安排 + 家里 30 分钟草药互动',
  timePct: '一次',
  sections: SECTIONS_C2,
  displayOrder: 2,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: c3 — 入梅家门口生态 (event)
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS_C3: ActivitySection[] = [
  {
    target: '雨季动物清单',
    numLabel: '§ 1',
    title: '雨后家门口能见的 4 种',
    chip: '1 周内',
    blocks: [
      {
        type: 'paragraph',
        html: '<b>入梅当天 + 之后 1 周</b>是黄金窗口——第一场连续雨之后小生物集体出现。错过这 1 周，很多就回到土里了。',
      },
      {
        // List instead of id-table because we don't have species photos for
        // June yet (Slice 3 asset pipeline). Switch back to id-table once
        // photos land — the type lives in g1-may-seed.ts as IdTableBlock.
        type: 'list-bullets',
        items: [
          '<b>蜗牛（易）</b>：雨后清晨 7 点前最多。墙根、花坛石头、湿叶下。<b>身上有壳的是蜗牛，没壳的是蛞蝓（鼻涕虫）</b>。',
          '<b>蚯蚓（易）</b>：人行道、绿地边缘。被冲出土后会脱水。<b>用小棍轻拨回土里</b>，不抓。',
          '<b>青蛙叫声（中）</b>：傍晚 7–9 点。市区小区水景 / 公园池塘 / 校园喷水池。听不到没关系，下次雨后再试。',
          '<b>鼠妇（潮虫）（易）</b>：花盆底、湿木头下。会卷成球。常被误认成"虫"，其实是<b>陆生甲壳类</b>（和虾蟹一家）。',
        ],
      },
    ],
  },
  {
    target: '怎么观察',
    numLabel: '§ 2',
    title: '怎么做 · 雨后 30 分钟',
    blocks: [
      {
        type: 'steps',
        items: [
          '雨停后第二天<b>早上 7 点前</b>出门——太阳一晒蜗牛和蚯蚓就消失了。',
          '<b>带本子 + 铅笔</b>。每看到一种，画或写下"在哪 / 多少只"，30 秒就行。',
          '<b>不抓不踩</b>。蜗牛壳薄，捏一下就死。蚯蚓晒干就是干尸。',
          '回家后翻照片对照 iNaturalist app 上海区域热门记录——不强求，玩 5 分钟。',
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
        html: '<p><b>湿滑石板上别让她跑。</b>雨后小区台阶最滑。</p><p><b>注意蛇</b>。上海市区罕见但闵行 / 浦东郊野公园偶尔有<b>赤链蛇</b>（中国蛇咬伤指南 + Wikipedia 列为<b>无毒</b>，但牙锋利且<b>唾液菌群易引起细菌感染</b>，被咬仍需就医清创）。看到立即拉开距离，<b>不要尝试抓或赶</b>。</p><p><b>蚊子开始密</b>。穿长袖。<b>给孩子用儿童浓度驱蚊液</b>（DEET ≤ 30% 或派卡瑞丁 ≤ 20%）。<u>3 岁以下避免柠檬桉油（OLE / PMD）</u>。</p>',
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
            html: '本子上 <b>"雨后清单"</b>——一次能记到 2–4 种。3 次累积下来，她对家门口物种数量会有自己的估计。',
          },
          {
            variant: 'heart',
            lbl: '心法',
            html: '<b>"雨后第二天 7 点"是个 routine</b>。一旦养成，她以后听到下雨就会期待第二天能看到什么。这是观察习惯，不是知识点。',
          },
        ],
      },
    ],
  },
];

export const ACTIVITY_C3_JUN_RAINY_SEASON: PathActivityData = {
  goalSlug: GOAL_G1_G3_FOUNDATION.slug,
  slug: 'g1-jun-rainy-season-near-door',
  cardType: 'event',
  month: 6,

  kicker: '事件卡 · 物候',
  previews: ['snail.jpg', 'earthworm.jpg', 'frog.jpg', 'pill_bug.jpg'],
  title: '入梅 · 家门口生态',
  summary: '入梅后 1 周内，<b>家门口蜗牛 / 蚯蚓 / 青蛙叫</b>集体出现。雨后 7 点出门，30 分钟。',
  triggerLabel: 'Trigger',
  triggerText: '2026 上海入梅常年平均 6 月 19 日前后（中下旬，气象局每年临 7 日内公告） · 入梅当天 + 1 周内黄金窗口',
  chips: [
    { cls: 'brick', t: '6 月中下旬入梅' },
    { cls: '', t: '蜗牛 + 蚯蚓 + 蛙鸣' },
  ],
  timeText: '<b>每次 30 分钟</b> · 雨后清晨 · 1 周内 2–3 次',
  timePct: '短次高频',
  sections: SECTIONS_C3,
  displayOrder: 3,
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA: c4 — 萤火虫 (event)
// ─────────────────────────────────────────────────────────────────────────────

const SECTIONS_C4: ActivitySection[] = [
  {
    target: '时间窗',
    numLabel: '§ 1',
    title: '为什么是 6 月中下旬',
    chip: '1–2 周窗口',
    blocks: [
      {
        type: 'paragraph',
        html: '上海近郊萤火虫高峰在<b>夏至到 7 月中旬</b>（约 2026/06/21 – 07/15，部分点位窗口偏窄）。再早成虫期未到，再晚密度骤降。每年只开这一扇窗，错过等下一年。',
      },
      {
        type: 'list-bullets',
        items: [
          '<b>最佳天气</b>：闷热无月光的夜晚（农历月中前后 = 月亮最亮，反而看不到，避开）。',
          '<b>最佳时段</b>：日落后 30 分钟到 22:00 之间。',
          '<b>2026 夏至</b> = 6/21（撞端午最后一天）。窗口右侧偏后 — 7 月初到中旬密度反而比夏至当周更高。',
        ],
      },
    ],
  },
  {
    target: '去哪儿',
    numLabel: '§ 2',
    title: '上海 3 个相对靠谱的点',
    blocks: [
      {
        type: 'paragraph',
        html: '夜场是否对外开放、当年密度都会变。<b>出发前必须查所选点位当年的官方公众号</b>（上海植物园 / 辰山 / 滨江森林公园），有官方夜赏活动最稳。',
      },
      {
        type: 'path-opts',
        opts: [
          {
            letter: 'A',
            label: '滨江森林公园',
            effort: 'Low Effort',
            effortKey: 'low',
            bodyHtml:
              '浦东高桥。<b>近年上海公园里萤火虫最多的点</b>（人民网 / 东方网都报道过）。地铁 6 号线 + 公交 / 打车，晚上回家方便。',
          },
          {
            letter: 'B',
            label: '上海植物园 / 辰山植物园',
            effort: 'Med Effort',
            effortKey: 'med',
            bodyHtml:
              '上海植物园（徐汇）观察记录有<b>黄脉翅萤、条背萤</b>等，夏至前后高峰；辰山植物园（松江）夜赏活动逐年办。<b>必须查公众号</b>当年是否开放夜场。',
          },
          {
            letter: 'C',
            label: '青浦金泽 / 朱家角',
            effort: 'Med Effort',
            effortKey: 'med',
            bodyHtml:
              '近郊水网地带，光污染低。自驾约 1 小时。<b>密度大但要靠运气</b>，建议跟当地观萤微信群打听当年点位。',
          },
        ],
      },
    ],
  },
  {
    target: '怎么看',
    numLabel: '§ 3',
    title: '现场怎么做',
    blocks: [
      {
        type: 'list-check',
        items: [
          '<b>关闪光灯 / 关手机屏</b>。光会让萤火虫熄灯。',
          '<b>到了先等 5 分钟让眼睛适应黑暗</b>。一开始什么都看不到很正常。',
          '<b>不抓</b>。萤火虫寿命只有 1–2 周成虫期，抓一只就少一只。',
          '<b>安静</b>。不需要刻意，只是别大声招呼小孩"快来看"。',
          '<b>带防蚊液</b>。林下夏夜蚊子凶。',
        ],
      },
    ],
  },
  {
    target: '看不到',
    numLabel: '§ 4',
    title: '备选方案 · 看不到怎么办',
    blocks: [
      {
        type: 'paragraph',
        html: '萤火虫看不到很正常——<b>近郊点在不同年份波动很大</b>。看不到的备选：',
      },
      {
        type: 'list-bullets',
        items: [
          '<b>BBC《地球脉动》"夜的世界"集</b>有萤火虫长镜头。回家陪她看 5 分钟。',
          '<b>《虫师》动画第 8 话"重穴"</b>——萤火虫主题，画面美。她可能更能记住。',
          '<b>明年再去</b>。"自然不一定每次都看到"是 G1 应该学到的元认知。',
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
            html: '本子上 1 页 <b>"6 月夏至看萤火虫"</b>——看到 / 没看到 都写。如果没看到，写"明年再来"。<b>这是 portfolio 里"自然没保证"的诚实记录</b>。',
          },
          {
            variant: 'heart',
            lbl: '心法',
            html: '萤火虫给孩子的不是知识，是<b>"季节性的稀缺"</b>。一年只能看一次的东西，比每天都能看的更让她记住。"等一年再来"的体验本身就是教育。',
          },
        ],
      },
    ],
  },
  {
    target: '来源',
    title: '',
    blocks: [
      {
        type: 'sources',
        title: '来源 · 后续补全',
        items: [
          '上海植物园 / 辰山植物园 / 滨江森林公园官方公众号年度萤火虫夜赏公告',
          '中国科学院昆明动物研究所 萤火虫保护科普',
          'iNaturalist 上海近郊 Lampyridae 历年观察记录',
        ],
      },
    ],
  },
];

export const ACTIVITY_C4_JUN_FIREFLY: PathActivityData = {
  goalSlug: GOAL_G1_G3_FOUNDATION.slug,
  slug: 'g1-jun-firefly-watching',
  cardType: 'event',
  month: 6,

  kicker: '事件卡 · 季节性',
  previews: ['firefly.jpg'],
  title: '夏至 · 萤火虫',
  summary: '<b>每年只开这扇窗</b>（6 月下旬–7 月中旬）。滨江森林公园 / 植物园 / 青浦金泽三选一。看不到也算赢。',
  triggerLabel: 'Trigger',
  triggerText: '夏至到 7 月中旬（2026 夏至 = 6/21） · 闷热无月光的夜晚最佳',
  chips: [
    { cls: 'brick', t: '6/21–7/15' },
    { cls: '', t: '夜观 + 不抓 + 等' },
  ],
  timeText: '<b>1 个夜晚</b> · 出发到回家约 4 小时（市区点）/ 6 小时（远郊）',
  timePct: '一次',
  sections: SECTIONS_C4,
  displayOrder: 4,
};

// ─────────────────────────────────────────────────────────────────────────────
// AGGREGATE export
// ─────────────────────────────────────────────────────────────────────────────

export const G1_JUN_SEED = {
  stage: STAGE_G1_G3,
  // June reuses the annual G1-G3 goal from May — same slug → upsert idempotent.
  goals: [GOAL_G1_G3_FOUNDATION] as PathGoalData[],
  activities: [
    ACTIVITY_C1_JUN_ROUTINE,
    ACTIVITY_C2_JUN_DRAGON_BOAT,
    ACTIVITY_C3_JUN_RAINY_SEASON,
    ACTIVITY_C4_JUN_FIREFLY,
  ],
};
