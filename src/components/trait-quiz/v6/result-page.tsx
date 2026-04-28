/**
 * v0.6 trait quiz result page UI — V7 mockup translated to React.
 *
 * Server-rendered (per test plan §6.2 SSR/Client boundary). Pure function
 * of decoded score URL: cat-hero + 9-dim bar list + 3 smart pick insights
 * + 6 collapsed dims + share/restart buttons + framework citation footer.
 */

import Link from "next/link";
import {
  DIMENSION_LIST,
  DIMENSION_META,
  getAttentionLevel,
  type DimensionMeta,
} from "@/lib/traits/temperament/dimensions";
import {
  TRAIT_HEROES,
  DIM_COPY,
  getDimInsight,
  pickInsightDims,
} from "@/lib/traits/temperament/profiles";
import type { TraitType } from "@/lib/traits/temperament/score";

interface ResultPageProps {
  childName?: string;
  type: TraitType;
  confidence: "high" | "low";
  dimScores: Record<string, number>;
  filledOnDate?: string; // ISO date string
}

const TINT_CLASSES: Record<
  "easy" | "notable" | "strong" | "balanced",
  { bg: string; border: string; text: string; eyebrow: string }
> = {
  easy: {
    bg: "bg-vela-primary/10",
    border: "border-vela-primary",
    text: "text-vela-primary",
    eyebrow: "text-vela-primary",
  },
  notable: {
    bg: "bg-trait-notable-from/15",
    border: "border-trait-notable-from",
    text: "text-trait-notable-text",
    eyebrow: "text-trait-notable-text",
  },
  strong: {
    bg: "bg-trait-strong-from/15",
    border: "border-trait-strong-from",
    text: "text-trait-strong-text",
    eyebrow: "text-trait-strong-text",
  },
  balanced: {
    bg: "bg-vela-secondary/15",
    border: "border-vela-secondary-dark",
    text: "text-vela-secondary-dark",
    eyebrow: "text-vela-secondary-dark",
  },
};

// Likert 1-5 → display 1-7 (UI scale per V7 mockup)
function displayScore(score: number): number {
  // Linear map 1..5 → 1..7: y = 1 + (score-1) * 6/4
  return Math.round(1 + (score - 1) * 1.5);
}

function levelTagText(dim: DimensionMeta, score: number): string {
  // Returns a brief Chinese descriptor like "中等偏高" / "较低 · 敏感"
  const isHighPole = dim.attentionPole === "high";
  if (score <= 1.5) return isHighPole ? "较低" : "较高 · 易";
  if (score <= 2.5) return "偏低";
  if (score <= 3.5) return "中等";
  if (score <= 4.5) return "中等偏高";
  return isHighPole ? "较高" : "较低";
}

function BarRow({ dim, score }: { dim: DimensionMeta; score: number }) {
  const level = getAttentionLevel(dim, score);
  const display = displayScore(score);
  const fillPct = ((score - 1) / 4) * 100;

  const fillClass =
    level === "easy"
      ? "from-vela-primary to-vela-primary-light"
      : level === "notable"
        ? "from-trait-notable-from to-trait-notable-to"
        : "from-trait-strong-from to-trait-strong-to";

  const scoreColor =
    level === "easy"
      ? "text-vela-primary"
      : level === "notable"
        ? "text-trait-notable-text"
        : "text-trait-strong-text";

  return (
    <div className="py-[14px] border-b border-vela-border last:border-b-0">
      <div className="flex justify-between items-baseline mb-[10px]">
        <span className="font-display text-[16px] text-vela-heading font-medium">
          {dim.displayLabel}
          <span className={`ml-2 text-[12px] font-body font-medium ${scoreColor} opacity-75`}>
            {levelTagText(dim, score)}
          </span>
        </span>
        <span className={`font-mono text-[14px] font-semibold ${scoreColor}`}>
          {display}
          <span className="text-vela-text-2 text-[12px] font-normal"> / 7</span>
        </span>
      </div>
      <div className="h-[10px] rounded-full bg-vela-primary/8 overflow-hidden relative">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${fillClass}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}

function SmartPickCard({ dim, score }: { dim: DimensionMeta; score: number }) {
  const insight = getDimInsight(dim.id, score);
  const display = displayScore(score);
  const level = getAttentionLevel(dim, score);

  const borderClass =
    level === "easy"
      ? ""
      : level === "notable"
        ? "border-l-[3px] border-l-trait-notable-text"
        : "border-l-[3px] border-l-trait-strong-text";
  const pillClass =
    level === "easy"
      ? "bg-vela-primary"
      : level === "notable"
        ? "bg-trait-notable-text"
        : "bg-trait-strong-text";

  return (
    <article
      className={`p-6 mb-4 bg-vela-surface border border-vela-border rounded-xl shadow-sm ${borderClass}`}
    >
      <div className="flex justify-between items-baseline mb-2 gap-4">
        <h3 className="font-display text-[17px] text-vela-heading">{dim.displayLabel}</h3>
        <span
          className={`shrink-0 ${pillClass} text-white rounded-full px-3 py-[3px] text-xs font-mono font-semibold`}
        >
          {display} / 7
        </span>
      </div>
      <p className="text-[15px] text-vela-text-1 leading-[1.6]">{insight.observation}</p>
      <p className="mt-4 pt-4 border-t border-vela-border text-vela-text-2 text-sm leading-[1.55]">
        {insight.action}
      </p>
    </article>
  );
}

export function ResultPage({
  childName = "她",
  type,
  confidence,
  dimScores,
  filledOnDate,
}: ResultPageProps) {
  const hero = TRAIT_HEROES[type];
  const tintClasses = TINT_CLASSES[hero.tint];
  const smartPickIds = pickInsightDims(
    dimScores as Record<keyof typeof DIMENSION_META, number>,
    3,
  );
  const restDimIds = DIMENSION_LIST.map((d) => d.id).filter(
    (id) => !smartPickIds.includes(id),
  );

  return (
    <main className="min-h-[100dvh] bg-background">
      <div className="max-w-[480px] mx-auto px-4 pb-12 min-h-[100dvh]">
        <header className="flex justify-between items-center py-2 mb-3">
          <span className="text-[20px] font-display font-semibold text-vela-primary tracking-tight">
            Vela
          </span>
          <span className="w-8 h-8 rounded-full bg-vela-secondary grid place-items-center text-[13px] font-display text-vela-heading">
            {childName.charAt(0)}
          </span>
        </header>

        <div className="flex flex-wrap items-baseline gap-2 mb-3 text-[13px] text-vela-text-2">
          <span className="font-display text-[17px] text-vela-heading">
            {childName}的气质画像
          </span>
          <span>·</span>
          <span>
            {filledOnDate
              ? `妈妈基于日常观察填于 ${filledOnDate}`
              : "妈妈基于日常观察"}
          </span>
        </div>

        {/* HERO */}
        <section
          className={`${tintClasses.bg} ${tintClasses.border} border-[1.5px] rounded-xl p-8 px-6 mb-6 text-center shadow`}
        >
          <p className={`text-[11px] uppercase tracking-[0.12em] font-bold mb-2 ${tintClasses.eyebrow}`}>
            综合气质类型
          </p>
          <h1 className={`font-display text-5xl font-semibold mb-4 leading-none ${tintClasses.text}`}>
            {type}
            {confidence === "low" && (
              <span className="ml-2 text-base align-middle text-vela-text-2 font-normal">
                · 接近
              </span>
            )}
          </h1>
          <p className="text-vela-heading text-[16px] leading-[1.65] font-medium mb-4">
            {hero.lead}
          </p>
          <p
            className={`text-[13px] text-vela-text-1 pt-4 border-t ${tintClasses.border} border-opacity-40`}
          >
            {hero.percentageNote}
            ·养育关键词{" "}
            <strong className={tintClasses.text}>{hero.keywords.join(" / ")}</strong>
          </p>
        </section>

        {/* 9-dim bars */}
        <h2 className="font-display text-[22px] font-semibold text-vela-primary mt-8 mb-2 pt-4 tracking-tight">
          9 维细节
        </h2>
        <p className="text-vela-text-1 text-sm mb-4">
          每条反映孩子在不同情境里的稳定倾向。分数本身没有好坏。
        </p>
        <section className="bg-vela-surface border border-vela-border rounded-xl shadow-sm p-4 px-6 mb-6">
          {DIMENSION_LIST.map((dim) => (
            <BarRow key={dim.id} dim={dim} score={dimScores[dim.id] ?? 3} />
          ))}
        </section>

        {/* Smart picks */}
        <h2 className="font-display text-[22px] font-semibold text-vela-primary mt-8 mb-2 pt-4 tracking-tight">
          三个值得留意的
        </h2>
        <p className="text-vela-text-1 text-sm mb-4">
          从 9 维里挑出最偏离中位的，给具体养育建议。
        </p>
        <section>
          {smartPickIds.map((id) => (
            <SmartPickCard
              key={id}
              dim={DIMENSION_META[id]}
              score={dimScores[id] ?? 3}
            />
          ))}

          <details className="mt-4 border border-vela-border rounded-md bg-vela-surface">
            <summary className="cursor-pointer list-none py-[14px] px-6 font-display text-[15px] text-vela-primary flex justify-between items-center">
              展开剩余 {restDimIds.length} 个维度的解读
              <span className="text-xs">▾</span>
            </summary>
            <div className="px-6 pb-4">
              {restDimIds.map((id) => {
                const dim = DIMENSION_META[id];
                const score = dimScores[id] ?? 3;
                const insight = getDimInsight(id, score);
                return (
                  <div key={id} className="py-[14px] border-t border-vela-border first:border-t-0">
                    <h3 className="font-display text-[14px] text-vela-heading mb-1">
                      {dim.displayLabel}
                      <span className="ml-2 font-mono text-vela-text-2 text-[12px] font-normal">
                        {displayScore(score)} / 7
                      </span>
                    </h3>
                    <p className="text-[13px] text-vela-text-1 leading-[1.55]">
                      {insight.observation}
                    </p>
                  </div>
                );
              })}
            </div>
          </details>
        </section>

        <div className="flex flex-col gap-2 mt-12 pt-6 border-t border-vela-border">
          <ShareButton type={type} />
          <Link
            href="/trait-quiz"
            className="bg-transparent border border-vela-primary text-vela-primary rounded-md min-h-[52px] flex items-center justify-center font-semibold text-[16px] hover:bg-vela-primary/5"
          >
            重新测一次
          </Link>
        </div>

        <p
          className="mt-6 text-center text-[11px] text-vela-muted leading-[1.5]"
          data-academic-disclosure
        >
          研究框架来自 Thomas &amp; Chess 1956 NYU 纵向研究的 9 维气质模型（学术原名：容易/困难/迟缓/中间型）。Vela
          用更贴近养育视角的命名：灵活 / 慎重 / 慢热 / 平衡。
          <br />
          本评估为非诊断性参考工具。分类阈值为经验值，将随真实使用数据持续校准。
        </p>
      </div>
    </main>
  );
}

// Client-only share button (uses navigator.clipboard)
function ShareButton({ type }: { type: TraitType }) {
  return (
    <button
      type="button"
      data-share-trigger
      data-share-type={type}
      className="bg-vela-primary text-white rounded-md min-h-[52px] flex items-center justify-center font-semibold text-[16px] hover:bg-vela-primary-dark"
    >
      分享给伴侣
    </button>
  );
}
