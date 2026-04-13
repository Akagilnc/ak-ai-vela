"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getRoute } from "@/lib/traits/routes";
import { generatePortrait } from "@/lib/traits/portraits";
import { matchRoute } from "@/lib/traits/match";
import type { TraitAnswers } from "@/lib/traits/types";
import type { Stage } from "@/lib/traits/types";

function PortraitHero({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-block bg-vela-secondary text-vela-heading px-4 py-1.5 rounded-full text-[13px] font-semibold mb-4">
        你的孩子画像
      </div>
      <h1 className="font-display text-[28px] font-semibold text-vela-primary mb-3">
        {title}
      </h1>
      <p className="text-[15px] text-vela-text-secondary leading-relaxed max-w-[320px] mx-auto">
        {description}
      </p>
    </div>
  );
}

function StageCard({ stage, defaultOpen }: { stage: Stage; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  return (
    <div className="bg-white rounded-xl border border-vela-border mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex justify-between items-center hover:bg-vela-surface transition-colors"
        aria-expanded={open}
      >
        <div className="text-left">
          <span className="font-semibold text-[15px] text-vela-heading">{stage.label}</span>
          <span className="text-[13px] text-vela-text-secondary ml-2">{stage.period}</span>
        </div>
        <span className={`text-xs text-vela-muted transition-transform duration-[250ms] ${open ? "rotate-90" : ""}`}>
          ▶
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 animate-slide-down">
          {stage.sections.map((section, i) => (
            <div key={i} className="mb-4 last:mb-0">
              <h4 className={`text-[13px] font-semibold mb-2 flex items-center gap-1.5 ${
                section.type === "relax" ? "text-vela-info" :
                section.type === "why" ? "text-vela-secondary-dark" :
                "text-vela-primary"
              }`}>
                {section.type === "action" && "📌"}
                {section.type === "relax" && "💡"}
                {section.type === "why" && "🎯"}
                {section.title}
              </h4>
              <div className="space-y-1">
                {section.items.map((item, j) => (
                  <div key={j} className="flex gap-2 text-sm text-vela-text-secondary leading-relaxed pl-1">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-vela-border flex-shrink-0" />
                    <span>
                      {item.text}
                      {item.verified && item.source && (
                        <span className="text-xs text-vela-muted ml-1" title={item.source}>✓</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalConfirmation() {
  const [selected, setSelected] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vela-trait-goal") ?? null;
    } catch {
      return null;
    }
  });

  const handleSelect = (goal: string) => {
    setSelected(goal);
    try {
      localStorage.setItem("vela-trait-goal", goal);
    } catch { /* noop */ }
  };

  const options = [
    { value: "top30", label: "美国前 30" },
    { value: "top50", label: "美国前 50" },
    { value: "undecided", label: "还没想好" },
  ];

  return (
    <div className="bg-vela-surface rounded-xl p-5 mt-8">
      <h3 className="text-[15px] font-medium text-vela-heading mb-3">你的目标是？</h3>
      <p className="text-sm text-vela-text-secondary mb-4">这帮我们在未来提供更精准的建议</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleSelect(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selected === opt.value
                ? "bg-vela-primary text-white"
                : "bg-white border border-vela-border text-vela-text-secondary hover:border-vela-primary"
            }`}
          >
            {opt.label}
            {selected === opt.value && " ✓"}
          </button>
        ))}
      </div>
    </div>
  );
}

function NoLocalStorageBanner() {
  return (
    <div className="bg-vela-surface rounded-xl p-4 mb-6 text-center">
      <p className="text-sm text-vela-text-secondary">
        这是基于路线的规划建议。想获得个性化画像？
      </p>
      <Link
        href="/trait-quiz"
        className="inline-block mt-2 text-sm font-medium text-vela-primary hover:underline"
      >
        开始测评 →
      </Link>
    </div>
  );
}

export default function TraitResultPage() {
  const params = useParams<{ routeId: string }>();
  const routeId = params.routeId;
  const route = getRoute(routeId);

  // Try to load answers from localStorage for portrait
  const [answers, setAnswers] = useState<TraitAnswers | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    try {
      const raw = localStorage.getItem("vela-trait-result");
      if (raw) {
        const parsed = JSON.parse(raw) as TraitAnswers;
        // Only use localStorage portrait if it matches this route
        try {
          if (matchRoute(parsed) === routeId) {
            setAnswers(parsed);
          }
        } catch { /* invalid answers, skip portrait */ }
      }
    } catch { /* noop */ }
  }, [routeId]);

  const portrait = useMemo(() => {
    if (!answers) return null;
    try {
      return generatePortrait(answers);
    } catch {
      return null;
    }
  }, [answers]);

  if (!route) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-[480px] mx-auto px-5 py-6 min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="text-xl font-display text-vela-heading mb-4">未找到路线</h1>
          <p className="text-sm text-vela-text-secondary mb-6">
            请求的路线不存在，请重新测评。
          </p>
          <Link
            href="/trait-quiz"
            className="px-6 py-3 bg-vela-primary text-white rounded-lg font-medium hover:bg-vela-primary-dark transition-colors"
          >
            重新测评
          </Link>
        </div>
      </main>
    );
  }

  // Don't render until localStorage check is done (avoid hydration flash)
  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[480px] mx-auto px-5 py-6 md:max-w-[600px] lg:max-w-[720px]">
        {/* Portrait hero (if we have answers) or fallback banner */}
        {portrait ? (
          <PortraitHero title={portrait.title} description={portrait.description} />
        ) : (
          <NoLocalStorageBanner />
        )}

        {/* Route name */}
        <h2 className="font-display text-lg text-vela-heading font-medium mb-4 pl-1">
          {route.name}
        </h2>

        {/* Stage cards */}
        {route.stages.map((stage, i) => (
          <StageCard key={i} stage={stage} defaultOpen={i === 0} />
        ))}

        {/* Goal confirmation */}
        <GoalConfirmation />

        {/* Footer */}
        <div className="text-center py-8">
          <Link
            href="/trait-quiz"
            className="inline-block px-8 py-3 border-2 border-vela-border text-vela-text-secondary rounded-lg text-sm hover:border-vela-primary hover:text-vela-primary transition-all"
          >
            重新测评
          </Link>
          <p className="text-xs text-vela-text-secondary mt-4">
            由 Vela 提供
          </p>
        </div>
      </div>
    </main>
  );
}
