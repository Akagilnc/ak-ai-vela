"use client";

/**
 * 5-point Likert scale input — 5 vertical text buttons (V8 mockup).
 *
 * Each button is ≥ 56px height for thumb comfort, with explicit Chinese
 * label text (avoids ambiguity vs digit-only buttons). reverse-scoring is
 * NOT applied here — provider stores raw 1-5 user answer; reverse handled
 * by computeDimScores() at submit time.
 */

const OPTIONS = [
  { value: 1, label: "完全不像她" },
  { value: 2, label: "不太像她" },
  { value: 3, label: "有时候是有时候不是" },
  { value: 4, label: "挺像她的" },
  { value: 5, label: "非常像她" },
] as const;

interface LikertOptionsProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function LikertOptions({ value, onChange, disabled }: LikertOptionsProps) {
  return (
    <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label="选择最贴近的描述">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={[
              "flex items-center gap-4 px-6 py-4 rounded-lg border-[1.5px] text-left",
              "min-h-[56px] w-full font-medium text-[16px] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vela-primary focus-visible:ring-offset-2",
              isSelected
                ? "bg-vela-primary text-white border-vela-primary"
                : "bg-vela-surface text-vela-text-1 border-vela-border hover:border-vela-primary hover:bg-vela-primary/5",
              disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
          >
            <span
              className={[
                "w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0",
                isSelected ? "border-white bg-white/20" : "border-vela-border",
              ].join(" ")}
            >
              {isSelected && (
                <span className="w-[10px] h-[10px] rounded-full bg-white" />
              )}
            </span>
            <span className="flex-1">{opt.label}</span>
            <span
              className={[
                "font-mono text-xs ml-auto font-medium",
                isSelected ? "text-white/65" : "text-vela-muted",
              ].join(" ")}
            >
              {opt.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
