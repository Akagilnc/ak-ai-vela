/**
 * v0.6 trait copy — 4 type heros + 9 dimension insights.
 *
 * Spec: design doc 2026-04-29 4-class hero copy + research notes Section 6.
 *
 * Hero copy uses behavioral-honest framing. Inline difficulty signals (not
 * label euphemism) per slice 0 R1#3 P0. Each hero has parenting keywords +
 * inline-with-difficulty description.
 *
 * Dim insight copy: per-dim 3 levels (low / mid / high score buckets) with
 * 1-2 behavioral observations + 1 actionable parenting tip.
 */

import type { DimensionId } from "./dimensions";
import type { TraitType } from "./score";

export interface TraitHero {
  type: TraitType;
  /** percentage in NYLS 1956 sample (Phase 1 research) */
  percentageNote: string;
  /** lead paragraph — shown as hero `<p class="lead">` */
  lead: string;
  /** parenting keyword bullets — shown as 'X / Y / Z' under hero */
  keywords: readonly string[];
  /** color tint for hero card */
  tint: "easy" | "notable" | "strong" | "balanced";
}

export const TRAIT_HEROES: Record<TraitType, TraitHero> = {
  灵活型: {
    type: "灵活型",
    percentageNote: "在 NYLS 1956 北美样本中约 40%",
    lead: "她在 9 维气质上整体偏「轻松配合」——作息规律、对新事物有兴趣、情绪基线积极。这意味着她在大多数情境里不需要特殊养育策略，但也意味着她容易被默认「听话好带」，过度独立反而需要主动陪伴。",
    keywords: ["陪伴", "不忽视", "主动连接"],
    tint: "easy",
  },
  慎重型: {
    type: "慎重型",
    percentageNote: "在 NYLS 1956 北美样本中约 10-15%",
    lead: "她属于「先观察、后行动」的孩子。她对环境敏感、情绪外显得比较强烈，遇到陌生情境会先停下来判断，但一旦投入就能持续很久。这类孩子需要的不是改造，而是预告和耐心。",
    keywords: ["耐心", "预告", "不催促"],
    tint: "strong",
  },
  慢热型: {
    type: "慢热型",
    percentageNote: "在 NYLS 1956 北美样本中约 15%",
    lead: "她面对新事物的第一反应是退缩，但她不是抵触，是需要更多「看清楚」的时间。她的反应通常温和而不强烈，不会哭闹爆发，只是慢慢热起来。给她铺路，不要替她跳过过渡期。",
    keywords: ["铺路", "慢慢来", "不替代"],
    tint: "notable",
  },
  平衡型: {
    type: "平衡型",
    percentageNote: "约 35%——是占比最大的气质类型",
    lead: "她属于 9 维特质都比较均衡的孩子——没有特别突出的强项，也没有特别需要操心的方向。但这不等于「没特点」：均衡本身是一种少见的稳定性，意味着她在面对不同情境时通常能找到自己的节奏。下方 9 维细节会显示她在每一维的具体倾向，差别不大但每一条都是真实的她。",
    keywords: ["观察", "不预设", "跟随节奏"],
    tint: "balanced",
  },
};

/**
 * Per-dim insight at a score bucket (low / mid / high). Each entry has
 * `observation` (behavioral, what the parent likely sees) + `action`
 * (concrete parenting tip — starts with "→").
 *
 * Score bucketing (1-5 likert dim score):
 *   - low: 1, 2
 *   - mid: 3
 *   - high: 4, 5
 *
 * Note: dim score follows NATURAL direction per dim name (rhythmicity 5 =
 * regular, intensity 5 = intense, mood 5 = positive, etc) EXCEPT approach
 * where 5 = withdrawal per spec footnote 9.
 */
export interface DimInsight {
  observation: string;
  action: string;
}

export type DimCopyByLevel = {
  low: DimInsight; // dim score 1-2
  mid: DimInsight; // dim score 3
  high: DimInsight; // dim score 4-5
};

export const DIM_COPY: Record<DimensionId, DimCopyByLevel> = {
  activityLevel: {
    low: {
      observation: "她整体安静，能在一件事上坐很久而不动来动去。",
      action: "→ 鼓励她偶尔走出舒适区做些动手活动，避免长时间低活动量带来的能量积压。",
    },
    mid: {
      observation: "她动得多但能坐住。运动量需求中上，写作业能持续半小时。",
      action: "→ 周末安排户外 1-2 次。室内有跳跳椅或舞蹈空间。",
    },
    high: {
      observation: "她精力充沛，几乎一刻不停，需要很多空间去释放。",
      action: "→ 每天必须有充足的体能消耗时段。久坐前先放电，写作业拆成 20 分钟段。",
    },
  },
  rhythmicity: {
    low: {
      observation: "吃饭睡觉的生物钟不太固定——周末和工作日差异大。这是天然倾向。",
      action: "→ 别强求精确时间表。换成「吃饭信号」（比如固定一首歌）、「睡觉信号」（暖灯+绘本），她会更顺。",
    },
    mid: {
      observation: "她睡觉吃饭的时间大致规律，偶尔会被新鲜事打乱——通常一两天就能恢复。",
      action: "→ 重要日（考试、出行）前 2 天保持作息，让她能稳定状态。",
    },
    high: {
      observation: "她吃饭、睡觉、上厕所的时间几乎像时钟一样准。突发改变会让她明显不适。",
      action: "→ 充分利用她的规律性，提前让她知道节奏。临时改计划要给至少 30 分钟预告。",
    },
  },
  approach: {
    // Note: dim score 5 = withdrawal (spec footnote 9 inverse). low = approach (easy)
    low: {
      observation: "见到陌生人或新地方，她很快就上去说话或动起来，不需要预热。",
      action: "→ 她适应新环境快是优势，但要留意她有没有过度信任陌生人。",
    },
    mid: {
      observation: "她对新事物有兴趣但不冒进，会观察一会儿再行动。",
      action: "→ 给她合适的过渡时间，不催不拉。",
    },
    high: {
      observation: "带她去没去过的公园，她会先在边上看 5-10 分钟，再慢慢靠近设施。她不害怕，是在做内部判断。",
      action: "→ 提前两天用照片或短视频让她「看见」新地方。第一次去的活动给她一个旁观席位，不催「快去玩」。",
    },
  },
  adaptability: {
    low: {
      observation: "搬家、换学校、换房间，她需要 1-2 周缓过来。打断她的活动也要花很久才能转移。",
      action: "→ 重大变化前 2-3 天预告。临时改计划用「再 5 分钟我们就走」式的过渡语。",
    },
    mid: {
      observation: "她能适应中等程度的变化，给她两三天就好。",
      action: "→ 较大变化（搬家、换学校）依然给充分时间和预告。",
    },
    high: {
      observation: "她对变化包容度大——换学校、临时改计划，第二天就能进入状态。",
      action: "→ 别因为她适应快就忽略她的感受。问问她「这次变化你心里什么感觉」。",
    },
  },
  intensity: {
    low: {
      observation: "她开心或难过的时候，表情和声音变化都不大，要仔细看才看得出来。",
      action: "→ 主动观察她的情绪信号，不要等大反应才回应。",
    },
    mid: {
      observation: "她的情绪表达适度——开心会笑，难过会皱眉，但不爆发。",
      action: "→ 这是相对省心的模式，多聊聊她内心的细节感受。",
    },
    high: {
      observation: "她开心时笑得特别响，生气时反应也强烈。情绪表达「全频段」。",
      action: "→ 接受她情绪外显，不要「压低声音」要求。强烈情绪过后帮她复盘原因。",
    },
  },
  threshold: {
    low: {
      observation: "对感官刺激敏感（光线、噪音、衣服标签）。低阈值是探测雷达，不是矫情。",
      action: "→ 商场、餐厅这类高刺激环境前先短时间过渡。穿衣关注材质和缝线。",
    },
    mid: {
      observation: "她对环境刺激有正常反应，热闹的地方能进入状态。",
      action: "→ 长时间高刺激环境后给她安静时间补回。",
    },
    high: {
      observation: "她对环境刺激相对不敏感，嘈杂、强光下也能专注。",
      action: "→ 反而要留意她可能错过身体的不适信号——主动问「热不热」「累不累」。",
    },
  },
  mood: {
    low: {
      observation: "她默认情绪偏内敛甚至带点闷，常常皱眉头或抱怨。",
      action: "→ 不要把这当「不开心」催问。她的情绪基线就在这里。多给她正向小事的注意。",
    },
    mid: {
      observation: "她情绪平稳，开心和不爽的比例差不多。",
      action: "→ 留意持续低落超过 2 天的信号。",
    },
    high: {
      observation: "她大部分时候情绪是上扬的，会主动笑或哼歌。睡醒后心情通常不错。",
      action: "→ 留心她偶尔的低落——不要因为她「平时挺乐」就忽略。",
    },
  },
  distractibility: {
    low: {
      observation: "她做一件事很专心，外界声音、动静很难拉走她。看动画片连叫几声都听不见。",
      action: "→ 切换活动前给充分预告。她的专注是优势但也容易错过临时安排。",
    },
    mid: {
      observation: "她写作业时偶尔会被动静拉走注意力，但能拉回来。",
      action: "→ 写作业最好在相对安静的角落。",
    },
    high: {
      observation: "邻居打麻将的声音她会一直回头看。专注任务时被外界拉走是常态。",
      action: "→ 学习环境要降噪。给她「专注 20 分钟，休息 5 分钟」的清晰节奏。",
    },
  },
  persistence: {
    low: {
      observation: "学新东西碰几次壁就放弃，遇到难题倾向换一件事做。",
      action: "→ 把大目标拆小。小成就积累让她体验到「继续就有结果」。",
    },
    mid: {
      observation: "她遇到难题会试几次，但持续力中等。",
      action: "→ 适度推一把：在她想放弃时陪她坚持 5 分钟。",
    },
    high: {
      observation: "拼图 / 搭积木卡住的时候，她会一直试到拼出来。打断她的中途任务比打断别的孩子更费劲。",
      action: "→ 「再 5 分钟我们就走」 比 「该走了」 有效很多。重要任务前先帮她排空「未完成的小事」。",
    },
  },
};

/**
 * Map a 1-5 dim score to one of the 3 copy levels.
 */
export function getDimLevel(score: number): keyof DimCopyByLevel {
  if (score <= 2) return "low";
  if (score >= 4) return "high";
  return "mid";
}

/**
 * Get the insight text for a given dim + score.
 */
export function getDimInsight(
  dimId: DimensionId,
  score: number,
): DimInsight {
  return DIM_COPY[dimId][getDimLevel(score)];
}

/**
 * Pick the top-K most informative dims to highlight as smart picks.
 * Uses absolute deviation from midpoint (3) — dims furthest from center
 * carry the most signal about parenting strategy.
 */
export function pickInsightDims(
  dimScores: Record<DimensionId, number>,
  k = 3,
): DimensionId[] {
  const ranked = (Object.entries(dimScores) as [DimensionId, number][])
    .map(([id, score]) => ({ id, deviation: Math.abs(score - 3) }))
    .sort((a, b) => b.deviation - a.deviation);
  return ranked.slice(0, k).map((e) => e.id);
}
