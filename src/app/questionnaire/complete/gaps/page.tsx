import { prisma } from "@/lib/prisma";
import { questionnaireSchema } from "@/lib/types";
import { analyzeStudentVsAllSchools, classifySchools } from "@/lib/gap";
import type { GapResult, GapSeverity, QuestionnaireAnswers } from "@/lib/types";
import type { ClassifiedSchool } from "@/lib/gap";
import type { School } from "@prisma/client";
import Link from "next/link";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "差距分析 — Vela",
};

// Severity config: color classes, labels, and pill text generators
const SEVERITY_CONFIG: Record<
  GapSeverity,
  {
    dotClass: string;
    pillClass: string;
    label: string;
    pillText: (r: GapResult) => string;
  }
> = {
  excellent: {
    dotClass: "bg-[#E9C46A]",
    pillClass: "bg-[#E9C46A18] text-[#8B6914] border border-[#E9C46A40]",
    label: "优秀",
    pillText: (r) => {
      if (r.dimension === "prevet-experience") return `${r.label} 远超`;
      if (r.target && r.current != null) {
        if (r.dimension === "gpa" && r.normalized != null)
          return `${r.label} +${(r.normalized - r.target.min).toFixed(2)}`;
        return `${r.label} 超${r.target.max}分位`;
      }
      return `${r.label} 优秀`;
    },
  },
  green: {
    dotClass: "bg-vela-primary",
    pillClass: "bg-[#2D6A4F0D] text-vela-primary",
    label: "达标",
    pillText: (r) => {
      if (r.dimension === "gpa" && r.normalized != null && r.target)
        return `${r.label} +${(r.normalized - r.target.min).toFixed(2)}`;
      return `${r.label} 达标`;
    },
  },
  yellow: {
    dotClass: "bg-[#B8860B]",
    pillClass: "bg-[#B8860B14] text-[#B8860B]",
    label: "接近",
    pillText: (r) => `${r.label} 接近`,
  },
  red: {
    dotClass: "bg-vela-error",
    pillClass: "bg-[#E6394612] text-vela-error",
    label: "差距大",
    pillText: (r) => {
      if (r.target && r.current != null) {
        const gap = r.target.min - r.current;
        if (gap > 0) return `${r.label} 差${gap}分`;
      }
      return `${r.label} 差距大`;
    },
  },
  "no-data": {
    dotClass: "bg-vela-muted",
    pillClass: "bg-[#B8B0A00A] text-vela-muted",
    label: "暂无",
    pillText: (r) => {
      if (r.action?.includes("不要求")) return `${r.label} 免试`;
      if (r.action?.includes("未公布")) return `${r.label} 未公布`;
      return `${r.label} 暂无`;
    },
  },
};

const TIER_CONFIG = {
  match: {
    label: "可匹配",
    chipClass: "bg-[#2D6A4F0D] text-vela-primary border-[#2D6A4F30]",
    barColor: "bg-vela-primary",
  },
  reach: {
    label: "需努力",
    chipClass: "bg-[#E6394612] text-vela-error border-[#E6394630]",
    barColor: "bg-vela-error",
  },
  possible: {
    label: "待评估",
    chipClass: "bg-[#B8B0A00A] text-vela-text-secondary border-vela-border",
    barColor: "bg-vela-border",
  },
} as const;

export default async function GapsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const studentId = typeof params.studentId === "string" ? params.studentId : null;

  if (!studentId) {
    return <EmptyState reason="no-student" />;
  }

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    return <EmptyState reason="no-student" />;
  }

  const latestResult = await prisma.questionnaireResult.findFirst({
    where: { studentId: student.id },
    orderBy: { submittedAt: "desc" },
  });
  if (!latestResult) {
    return <EmptyState reason="no-result" />;
  }

  // Zod safeParse on stored answers
  const parsed = questionnaireSchema.safeParse(latestResult.answers);
  if (!parsed.success) {
    return <EmptyState reason="parse-error" />;
  }
  const answers: QuestionnaireAnswers = parsed.data;

  const schools = await prisma.school.findMany();
  const allResults = analyzeStudentVsAllSchools(answers, schools);
  const classified = classifySchools(allResults, schools);

  // Compute overall severity counts for progress bar
  let totalExcellent = 0, totalGreen = 0, totalYellow = 0, totalRed = 0, totalNoData = 0;
  for (const results of allResults.values()) {
    for (const r of results) {
      if (r.severity === "excellent") totalExcellent++;
      else if (r.severity === "green") totalGreen++;
      else if (r.severity === "yellow") totalYellow++;
      else if (r.severity === "red") totalRed++;
      else totalNoData++;
    }
  }
  const total = totalExcellent + totalGreen + totalYellow + totalRed + totalNoData;

  // Check if partial data (many no-data)
  const noDataRatio = total > 0 ? totalNoData / total : 0;

  return (
    <main className="flex-1 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[480px] mx-auto sm:max-w-[720px] lg:max-w-[960px]">
        <Link
          href={`/questionnaire/complete?name=${encodeURIComponent(student.name)}&studentId=${encodeURIComponent(student.id)}`}
          className="inline-flex items-center min-h-[44px] text-sm text-vela-text-secondary hover:text-vela-primary transition-colors"
        >
          &larr; 返回
        </Link>

        <div className="mt-1 mb-5">
          <h1 className="text-2xl font-bold text-vela-heading font-display">
            {student.name} 的学校匹配分析
          </h1>
          <p className="text-sm text-vela-muted mt-1">
            对比 {schools.length} 所美国大学 · {allResults.size > 0 ? [...allResults.values()][0].length : 0} 个维度
          </p>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <>
            <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mb-3">
              {totalExcellent > 0 && (
                <div className="bg-[#E9C46A]" style={{ width: `${(totalExcellent / total) * 100}%` }} />
              )}
              {totalGreen > 0 && (
                <div className="bg-vela-primary" style={{ width: `${(totalGreen / total) * 100}%` }} />
              )}
              {totalYellow > 0 && (
                <div className="bg-[#B8860B]" style={{ width: `${(totalYellow / total) * 100}%` }} />
              )}
              {totalRed > 0 && (
                <div className="bg-vela-error" style={{ width: `${(totalRed / total) * 100}%` }} />
              )}
              {totalNoData > 0 && (
                <div className="bg-vela-muted" style={{ width: `${(totalNoData / total) * 100}%` }} />
              )}
            </div>
            <div className="flex gap-3 flex-wrap mb-6 text-xs text-vela-text-secondary">
              {totalExcellent > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#E9C46A]" />优秀 {totalExcellent}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-vela-primary" />达标 {totalGreen}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#B8860B]" />接近 {totalYellow}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-vela-error" />差距大 {totalRed}
              </span>
              {totalNoData > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-vela-muted" />暂无 {totalNoData}
                </span>
              )}
            </div>
          </>
        )}

        {/* Partial data prompt */}
        {noDataRatio > 0.5 && (
          <div className="mb-6 p-3 bg-vela-surface border border-vela-border rounded-lg text-sm text-vela-text-secondary">
            补充更多信息可以让分析更准确。
            <Link href="/questionnaire" className="text-vela-primary ml-1 hover:underline">
              重新填写问卷 →
            </Link>
          </div>
        )}

        {/* Tier sections */}
        {(["match", "reach", "possible"] as const).map((tierKey) => {
          const items = classified[tierKey];
          if (items.length === 0) return null;
          const config = TIER_CONFIG[tierKey];
          const top3 = items.slice(0, 3);
          const rest = items.slice(3);

          return (
            <section key={tierKey} className="mb-7">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border mb-3 ${config.chipClass}`}>
                {config.label}
                <span className="font-normal opacity-70">· {items.length} 所</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {top3.map((item) => (
                  <SchoolCard key={item.schoolId} item={item} tierKey={tierKey} />
                ))}
              </div>

              {rest.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-vela-primary font-medium py-2 list-none [&::-webkit-details-marker]:hidden">
                    查看全部 {items.length} 所{config.label}学校 ▸
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    {rest.map((item) => (
                      <SchoolCard key={item.schoolId} item={item} tierKey={tierKey} />
                    ))}
                  </div>
                </details>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

function SchoolCard({
  item,
  tierKey,
}: {
  item: ClassifiedSchool;
  tierKey: "match" | "reach" | "possible";
}) {
  const barColor = TIER_CONFIG[tierKey].barColor;

  // Summary badge: count per severity
  const counts = new Map<GapSeverity, number>();
  for (const r of item.results) {
    counts.set(r.severity, (counts.get(r.severity) ?? 0) + 1);
  }

  return (
    <div className="relative bg-vela-surface border border-vela-border rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Left color band */}
      <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${barColor}`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-2.5 pl-2">
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-vela-heading font-display truncate">
            {item.school.nameZh || item.school.name}
          </div>
          <div className="text-[11px] text-vela-muted truncate">
            {item.school.nameZh ? item.school.name : item.school.location}
          </div>
        </div>
        {/* Summary badge */}
        <div className="flex gap-1 items-center shrink-0 ml-2 px-2 py-0.5 rounded-md bg-white">
          {(["excellent", "green", "yellow", "red", "no-data"] as const).map((sev) => {
            const count = counts.get(sev);
            if (!count) return null;
            return (
              <span key={sev} className="flex items-center gap-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY_CONFIG[sev].dotClass}`} />
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{ color: sev === "excellent" ? "#8B6914" : sev === "green" ? "#2D6A4F" : sev === "yellow" ? "#B8860B" : sev === "red" ? "#E63946" : "#B8B0A0" }}
                >
                  {count}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Dimension pills */}
      <div className="flex flex-wrap gap-1.5 mb-2.5 pl-2">
        {item.results.map((r) => {
          const cfg = SEVERITY_CONFIG[r.severity];
          return (
            <span key={r.dimension} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${cfg.pillClass}`}>
              {r.severity === "excellent" && <span className="text-[10px] text-[#E9C46A]">★</span>}
              {cfg.pillText(r)}
            </span>
          );
        })}
      </div>

      {/* Expandable detail */}
      <details className="pl-2 text-xs">
        <summary className="cursor-pointer text-vela-text-secondary py-1 list-none [&::-webkit-details-marker]:hidden">
          展开详情 ▸
        </summary>
        <div className="mt-1">
          {item.results.map((r) => {
            const cfg = SEVERITY_CONFIG[r.severity];
            return (
              <div key={r.dimension} className="flex gap-2 py-2 border-b border-vela-border last:border-b-0">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${cfg.dotClass}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-vela-text-secondary tracking-wide">
                    {r.label}
                  </div>
                  {r.current != null && r.target && (
                    <div className="font-mono text-xs text-vela-text">
                      {r.current}{r.normalized != null && r.normalized !== r.current ? ` (${r.normalized.toFixed(2)})` : ""} / 目标 {r.target.min === r.target.max ? r.target.min : `${r.target.min}-${r.target.max}`}
                    </div>
                  )}
                  {r.action && (
                    <div className="text-xs text-vela-text-secondary leading-relaxed mt-0.5">
                      {r.action}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      {/* School detail link */}
      <Link
        href={`/schools/${item.schoolId}`}
        className="block text-right text-xs text-vela-primary mt-2 pl-2 min-h-[44px] flex items-center justify-end"
      >
        查看学校详情 →
      </Link>
    </div>
  );
}

function EmptyState({ reason }: { reason: "no-student" | "no-result" | "parse-error" }) {
  if (reason === "parse-error") {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-sm text-center bg-vela-surface border border-vela-border rounded-xl p-8">
          <h2 className="text-lg font-semibold text-vela-heading font-display mb-2">
            问卷数据需要更新
          </h2>
          <p className="text-sm text-vela-text-secondary mb-4">
            我们更新了问卷结构，需要重新填写一次才能生成最新的分析。
          </p>
          <Link
            href="/questionnaire"
            className="inline-block min-h-[44px] px-5 py-2.5 bg-vela-primary text-white rounded-lg font-semibold text-sm hover:bg-vela-primary-dark transition-colors"
          >
            重新填写 →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-sm text-center bg-vela-surface border border-vela-border rounded-xl p-8">
        <h2 className="text-lg font-semibold text-vela-heading font-display mb-2">
          还没有分析数据
        </h2>
        <p className="text-sm text-vela-text-secondary mb-4">
          完成问卷后，我们会帮你分析与美国大学的匹配程度。
        </p>
        <Link
          href="/questionnaire"
          className="inline-block min-h-[44px] px-5 py-2.5 bg-vela-primary text-white rounded-lg font-semibold text-sm hover:bg-vela-primary-dark transition-colors"
        >
          开始填写问卷 →
        </Link>
      </div>
    </main>
  );
}
