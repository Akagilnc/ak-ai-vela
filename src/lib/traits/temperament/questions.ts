/**
 * Trait quiz v0.6 question seed — 30 items.
 *
 * Spec: research notes Section 6 (题库设计 implication)
 *
 * Per-dim allocation:
 *   - 5 core dims (rhythmicity, approach, adaptability, intensity, mood) × 4 questions = 20
 *   - 4 nuance dims (activityLevel, threshold, distractibility, persistence) × 2-3 questions = 10
 *   - Total: 30
 *
 * Copy guidelines (R1 quality bar):
 *   - Behavioral, observable: "她遇到陌生人会主动打招呼吗" not "她外向吗"
 *   - Specific to scenarios: 新公园 / 拼图 / 吃饭 / 上学 / 等等
 *   - Avoid abstract personality terms (外向 / 内向 / 害羞 / 难缠 / 性格)
 *   - Avoid v0.5 slop list ("看起来" / "充满好奇心" / "如鱼得水" 等)
 *   - Use 她/他 (specific child) not 孩子 (general)
 *
 * Reverse scoring:
 *   - reverseScored=false: 5 = hard pole (e.g. high activity / withdrawal / intense)
 *   - reverseScored=true: 5 = easy pole (item flipped before averaging into dim)
 *
 * Mix forward + reverse within each dim to mitigate response set bias.
 */

import { DIMENSION_LIST, type DimensionId } from "./dimensions";
import type { DimScores } from "./score";

export interface Question {
  id: string;
  dimensionId: DimensionId;
  prompt: string;
  /**
   * If true, raw answer is flipped (6 - answer) before averaging into dim
   * score. Lets us write some prompts where 5 = "good" and others where
   * 5 = "alarming" without skewing aggregate.
   */
  reverseScored: boolean;
}

export const QUESTIONS: readonly Question[] = [
  // ─── Activity Level (2 questions, attentionPole='high') ─────────────────
  {
    id: "act_01",
    dimensionId: "activityLevel",
    prompt: "她在家里几乎一刻不停，总在跑跳爬上爬下。",
    reverseScored: false, // 5 = high activity
  },
  {
    id: "act_02",
    dimensionId: "activityLevel",
    prompt: "她可以坐着安静画画或拼图超过 30 分钟。",
    reverseScored: true, // 5 = low activity
  },

  // ─── Rhythmicity (4 questions, core, attentionPole='low') ───────────────
  // dim score 自然方向：高 = 规律性高（easy pole）。reverseScored 标记
  // 题目语义和 dim 方向相反时——question raw 5 表达"不规律"语义，flip 到
  // dim 方向。
  {
    id: "rhy_01",
    dimensionId: "rhythmicity",
    prompt: "她每天差不多同一时间就会饿。",
    reverseScored: false, // 5 = 规律 = 自然方向
  },
  {
    id: "rhy_02",
    dimensionId: "rhythmicity",
    prompt: "她周末和工作日的睡觉时间差很多。",
    reverseScored: true, // 5 = 不规律 = 反方向，flip 后归 dim
  },
  {
    id: "rhy_03",
    dimensionId: "rhythmicity",
    prompt: "她大便的时间每天比较固定。",
    reverseScored: false,
  },
  {
    id: "rhy_04",
    dimensionId: "rhythmicity",
    prompt: "她有时候很早起，有时候要叫好几次才肯起。",
    reverseScored: true,
  },

  // ─── Approach (趋避性, 4 questions, core, attentionPole='high') ─────────
  // Note: 5 = withdrawal (hard pole). Items written from "approach" angle
  // are reverseScored to align.
  {
    id: "app_01",
    dimensionId: "approach",
    prompt: "带她去没去过的公园，她会先在边上看一会儿才去玩。",
    reverseScored: false, // 5 = stays back = withdrawal
  },
  {
    id: "app_02",
    dimensionId: "approach",
    prompt: "见到陌生小朋友，她很快就上去说话或一起玩。",
    reverseScored: true, // 5 = approach = easy pole
  },
  {
    id: "app_03",
    dimensionId: "approach",
    prompt: "新玩具拿到手，她会先观察、摆弄一会儿才开始正式玩。",
    reverseScored: false,
  },
  {
    id: "app_04",
    dimensionId: "approach",
    prompt: "第一次吃没吃过的菜，她会主动尝试。",
    reverseScored: true,
  },

  // ─── Adaptability (4 questions, core, attentionPole='low') ──────────────
  // dim score 自然方向：高 = 适应性高（easy pole）。
  {
    id: "ada_01",
    dimensionId: "adaptability",
    prompt: "搬家、换学校、换房间这种变化，她两三天就能适应。",
    reverseScored: false, // 5 = 适应快 = 自然方向
  },
  {
    id: "ada_02",
    dimensionId: "adaptability",
    prompt: "周末出去玩临时改计划，她会闹好一会儿。",
    reverseScored: true, // 5 = 慢适应 = 反方向
  },
  {
    id: "ada_03",
    dimensionId: "adaptability",
    prompt: "幼儿园 / 学校换老师后，她一周内就能跟新老师熟起来。",
    reverseScored: false,
  },
  {
    id: "ada_04",
    dimensionId: "adaptability",
    prompt: "做事被打断后，她要花很久才能转到下一件事上。",
    reverseScored: true,
  },

  // ─── Intensity (4 questions, core, attentionPole='high') ────────────────
  {
    id: "int_01",
    dimensionId: "intensity",
    prompt: "她开心时笑得特别响，旁边人都听得见。",
    reverseScored: false, // 5 = intense
  },
  {
    id: "int_02",
    dimensionId: "intensity",
    prompt: "她不爽的时候反应通常比较温和，不会大哭大闹。",
    reverseScored: true,
  },
  {
    id: "int_03",
    dimensionId: "intensity",
    prompt: "她生气时会摔东西或大声喊。",
    reverseScored: false,
  },
  {
    id: "int_04",
    dimensionId: "intensity",
    prompt: "她表达感情比较内敛，不太显山露水。",
    reverseScored: true,
  },

  // ─── Threshold (反应阈值, 3 questions, attentionPole='low') ─────────────
  // dim score 自然方向：高 = 阈值高 = 不敏感（easy pole）。
  {
    id: "thr_01",
    dimensionId: "threshold",
    prompt: "衣服标签、袜子缝线这种小细节会让她觉得不舒服。",
    reverseScored: true, // 5 = 敏感 = 反方向，flip
  },
  {
    id: "thr_02",
    dimensionId: "threshold",
    prompt: "嘈杂环境（比如商场、餐厅）她也能很快进入状态。",
    reverseScored: false, // 5 = 不敏感 = 自然
  },
  {
    id: "thr_03",
    dimensionId: "threshold",
    prompt: "灯光偏亮、温度偏热她会比较快表现出不适。",
    reverseScored: true,
  },

  // ─── Mood (情绪本质, 4 questions, core, attentionPole='low') ────────────
  // dim score 自然方向：高 = 正面情绪（easy pole）。
  {
    id: "moo_01",
    dimensionId: "mood",
    prompt: "她大部分时候情绪是上扬的，会主动笑。",
    reverseScored: false, // 5 = 正面 = 自然
  },
  {
    id: "moo_02",
    dimensionId: "mood",
    prompt: "她常常抱怨或皱眉头。",
    reverseScored: true, // 5 = 负面 = 反方向
  },
  {
    id: "moo_03",
    dimensionId: "mood",
    prompt: "睡醒后她通常心情不错。",
    reverseScored: false,
  },
  {
    id: "moo_04",
    dimensionId: "mood",
    prompt: "玩游戏输了她会沮丧很久。",
    reverseScored: true,
  },

  // ─── Distractibility (3 questions, attentionPole='high') ────────────────
  {
    id: "dis_01",
    dimensionId: "distractibility",
    prompt: "她写作业 / 画画时，外面有人讲话她就会回头看。",
    reverseScored: false, // 5 = easy distract = hard pole
  },
  {
    id: "dis_02",
    dimensionId: "distractibility",
    prompt: "她哭闹的时候，给她看手机或讲故事她很快能转移注意力。",
    reverseScored: false, // 高分=容易被外界拉走（虽然此场景里"被转移"对家长方便）
  },
  {
    id: "dis_03",
    dimensionId: "distractibility",
    prompt: "看动画片时即使叫她吃饭，她也听不见似的。",
    reverseScored: true, // 5 = focused = easy pole
  },

  // ─── Persistence (2 questions, attentionPole='low') ─────────────────────
  // dim score 自然方向：高 = 坚持性高（easy pole）。
  {
    id: "per_01",
    dimensionId: "persistence",
    prompt: "拼图 / 搭积木卡住的时候，她会一直试到拼出来。",
    reverseScored: false, // 5 = 坚持 = 自然
  },
  {
    id: "per_02",
    dimensionId: "persistence",
    prompt: "学新东西没成功几次她就放弃了。",
    reverseScored: true,
  },
] as const;

/**
 * Map of dimensionId → questionIds (for quiz UI grouping + per-dim averaging).
 */
export const QUESTIONS_BY_DIM: Record<DimensionId, readonly Question[]> =
  DIMENSION_LIST.reduce(
    (acc, dim) => {
      acc[dim.id] = QUESTIONS.filter((q) => q.dimensionId === dim.id);
      return acc;
    },
    {} as Record<DimensionId, readonly Question[]>,
  );

/**
 * Compute per-dim averages from a complete map of question answers (1-5 likert).
 * Reverse-scored items are flipped (6 - answer) before averaging so the dim
 * score follows attentionPole convention (high = hard pole).
 *
 * Throws if any question is unanswered (caller must enforce 30/30 fill).
 */
export function computeDimScores(answers: Record<string, number>): DimScores {
  const result = {} as DimScores;
  for (const dim of DIMENSION_LIST) {
    const qs = QUESTIONS_BY_DIM[dim.id];
    let sum = 0;
    for (const q of qs) {
      const raw = answers[q.id];
      if (raw === undefined) {
        throw new Error(`question ${q.id} unanswered (dim ${dim.id})`);
      }
      // Reverse-score: flip 1↔5, 2↔4, 3↔3 to align with attentionPole
      const aligned = q.reverseScored ? 6 - raw : raw;
      sum += aligned;
    }
    result[dim.id] = sum / qs.length;
  }
  return result;
}

