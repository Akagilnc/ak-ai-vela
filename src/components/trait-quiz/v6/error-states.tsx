/**
 * Error / empty / loading states for v0.6 trait quiz result page (V9 mockup).
 */

import Link from "next/link";

interface ErrorStateProps {
  variant: "invalid" | "corrupt" | "schema_unsupported";
  score: string;
}

const COPY: Record<
  ErrorStateProps["variant"],
  { icon: string; title: string; lead: string; tint: "gold" | "orange" }
> = {
  invalid: {
    icon: "?",
    title: "链接不完整",
    lead: "结果数据无法解析。可能是链接被截断了——把链接整段复制再试一次通常能解决。",
    tint: "gold",
  },
  corrupt: {
    icon: "!",
    title: "链接对不上",
    lead: "结果数据没通过校验。可能是链接被截断或修改过了。",
    tint: "orange",
  },
  schema_unsupported: {
    icon: "↻",
    title: "测评已升级",
    lead: "v0.6 用了新的 9 维气质模型（基于 Thomas & Chess 1956 NYU 研究），和之前 10 题版本结果不通用。建议重新测一次。",
    tint: "gold",
  },
};

const TINT_BG: Record<"gold" | "orange", string> = {
  gold: "bg-trait-notable-from/12 text-trait-notable-text",
  orange: "bg-trait-strong-from/10 text-trait-strong-text",
};

export function ResultEmptyState() {
  return (
    <main className="min-h-[100dvh] bg-background grid place-items-center p-4">
      <div className="max-w-[420px] w-full bg-vela-surface border border-vela-border rounded-xl p-8 text-center">
        <div
          className={`w-[72px] h-[72px] mx-auto mb-3 rounded-full grid place-items-center text-4xl font-display font-medium bg-trait-notable-from/12 text-trait-notable-text`}
        >
          ?
        </div>
        <h2 className="font-display text-[22px] text-vela-heading font-medium">
          缺少结果数据
        </h2>
        <p className="mt-3 text-[15px] text-vela-text-1 leading-relaxed">
          你需要先完成测评才能看画像。如果你是从分享链接进来的，链接可能不完整。
        </p>
        <div className="mt-6 flex flex-col gap-[10px]">
          <Link
            href="/trait-quiz"
            className="min-h-[48px] flex items-center justify-center bg-vela-primary text-white rounded-md font-semibold text-[15px] hover:bg-vela-primary-dark"
          >
            开始测评
          </Link>
        </div>
      </div>
    </main>
  );
}

export function ResultErrorState({ variant, score }: ErrorStateProps) {
  const copy = COPY[variant];
  return (
    <main className="min-h-[100dvh] bg-background grid place-items-center p-4">
      <div className="max-w-[420px] w-full bg-vela-surface border border-vela-border rounded-xl p-8 text-center">
        <div
          className={`w-[72px] h-[72px] mx-auto mb-3 rounded-full grid place-items-center text-4xl font-display font-medium ${TINT_BG[copy.tint]}`}
        >
          {copy.icon}
        </div>
        <h2 className="font-display text-[22px] text-vela-heading font-medium">
          {copy.title}
        </h2>
        <p className="mt-3 text-[15px] text-vela-text-1 leading-relaxed">{copy.lead}</p>
        {variant === "corrupt" && score.length < 50 && (
          <code className="mt-3 block text-[12px] font-mono text-vela-text-2 bg-background border border-vela-border rounded px-3 py-2 break-all">
            ?score={score}
          </code>
        )}
        <div className="mt-6 flex flex-col gap-[10px]">
          <Link
            href="/trait-quiz"
            className="min-h-[48px] flex items-center justify-center bg-vela-primary text-white rounded-md font-semibold text-[15px] hover:bg-vela-primary-dark"
          >
            {variant === "schema_unsupported" ? "用新版重测" : "重新测一次"}
          </Link>
        </div>
      </div>
    </main>
  );
}
