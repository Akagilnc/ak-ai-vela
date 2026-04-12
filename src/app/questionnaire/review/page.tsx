"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuestionnaire } from "@/components/questionnaire/questionnaire-provider";
import { ProgressStepper } from "@/components/questionnaire/progress-stepper";
import { countMissingImportant } from "@/lib/review-rules";
import { submitQuestionnaire, type SubmitResult } from "../actions";


type SectionData = {
  label: string;
  step: number;
  entries: { label: string; value: string | null }[];
};

function formatGrade(grade: number): string {
  if (grade === 0) return "幼儿园";
  return `${grade}年级`;
}

function formatValue(val: unknown, labelMap?: Record<string, string>): string | null {
  if (val == null || val === "" || val === undefined) return null;
  if (typeof val === "boolean") return val ? "是" : "否";
  if (typeof val === "number") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return null;
    // Array of objects (activities, experience)
    if (typeof val[0] === "object") {
      const names = val
        .map((v) => {
          const r = v as Record<string, unknown>;
          const name = r.name as string | undefined;
          const type = r.type as string | undefined;
          if (name) return name;
          if (type) return labelMap?.[type] || type;
          return "";
        })
        .filter(Boolean);
      return names.length > 0 ? names.join(" · ") : null;
    }
    return val.join(", ");
  }
  return String(val);
}

const BUDGET_LABELS: Record<string, string> = {
  "under-30k": "3 万美元以下",
  "30k-50k": "3-5 万美元",
  "50k-70k": "5-7 万美元",
  "70k-100k": "7-10 万美元",
  "over-100k": "10 万美元以上",
  "flexible": "灵活",
};

const MAJOR_LABELS: Record<string, string> = {
  "pre-vet": "兽医预科 (Pre-Vet)",
  "animal-science": "动物科学 (Animal Science)",
  "biology": "生物学 (Biology)",
  "other": "其他",
};

const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  "academic": "学术竞赛", "arts": "艺术/音乐", "sports": "体育运动",
  "volunteer": "志愿服务", "leadership": "学生领导力", "club": "社团组织",
  "research": "科研项目", "work": "实习/工作", "other": "其他",
};

const EXPERIENCE_TYPE_LABELS: Record<string, string> = {
  "volunteer": "志愿服务", "intern": "实习", "pet-care": "宠物照顾",
  "research": "科研项目", "vet-shadow": "兽医跟诊", "farm": "农场/牧场",
  "other": "其他",
};

export default function ReviewPage() {
  const { data, flushSave, clearAll } = useQuestionnaire();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Build sections for display
  const sections: SectionData[] = [
    {
      label: "孩子基本信息",
      step: 1,
      entries: [
        { label: "姓名", value: data.childName || null },
        { label: "出生年份", value: data.birthYear ? `${data.birthYear}年` : null },
        { label: "当前年级", value: data.currentGrade != null ? formatGrade(data.currentGrade) : null },
      ],
    },
    {
      label: "学校体系",
      step: 2,
      entries: [
        {
          label: "学校类型",
          value: data.schoolSystem
            ? { public: "公立", private: "私立", international: "国际", homeschool: "在家教育", other: "其他" }[data.schoolSystem] || data.schoolSystem
            : null,
        },
        { label: "学校名称", value: data.schoolName || null },
        { label: "所在城市", value: data.schoolCity || null },
      ],
    },
    {
      label: "学业情况",
      step: 3,
      entries: [
        { label: "GPA", value: data.gpaPercentage != null ? `${data.gpaPercentage}%` : null },
        { label: "排名", value: data.classRank || null },
        { label: "理科", value: data.scienceGPA != null ? `${data.scienceGPA}%` : null },
        { label: "课程体系", value: data.curriculumType || null },
        { label: "IB 文凭", value: data.ibDiploma != null ? (data.ibDiploma ? "是" : "否") : null },
      ].filter((e) => e.value !== null),
    },
    {
      label: "标化考试",
      step: 4,
      entries: [
        { label: "SAT", value: data.satScore != null ? String(data.satScore) : null },
        { label: "ACT", value: data.actScore != null ? String(data.actScore) : null },
        { label: "TOEFL", value: data.toeflScore != null ? String(data.toeflScore) : null },
        { label: "IELTS", value: data.ieltsScore != null ? String(data.ieltsScore) : null },
      ],
    },
    {
      label: `课外活动 (${(data.activities as unknown[])?.filter((a: unknown) => (a as Record<string, unknown>).name)?.length ?? 0})`,
      step: 5,
      entries: [{ label: "活动", value: formatValue(data.activities, ACTIVITY_TYPE_LABELS) }],
    },
    {
      label: `特殊经历 (${(data.animalExperience as unknown[])?.filter((a: unknown) => (a as Record<string, unknown>).type)?.length ?? 0})`,
      step: 6,
      entries: [{ label: "经历", value: formatValue(data.animalExperience, EXPERIENCE_TYPE_LABELS) }],
    },
    {
      label: "家庭财务",
      step: 7,
      entries: [
        { label: "预算范围", value: data.budgetRange ? BUDGET_LABELS[data.budgetRange] || data.budgetRange : null },
        { label: "需要助学金", value: data.needFinancialAid != null ? (data.needFinancialAid ? "是" : "否") : null },
      ],
    },
    {
      label: "目标偏好",
      step: 8,
      entries: [
        { label: "目标专业", value: data.targetMajor ? MAJOR_LABELS[data.targetMajor] || data.targetMajor : null },
        { label: "偏好地区", value: data.preferredRegion || null },
        { label: "最大担忧", value: data.biggestConcern || null },
      ],
    },
  ];

  // Count missing fields that affect report quality. The rule branches on
  // schoolSystem (international → curriculumType, public/private →
  // GPA-or-rank, homeschool/other → no academic slot) so international
  // students don't get false-positive warnings about a GPA their system
  // doesn't produce. Full logic + tests live in src/lib/review-rules.ts.
  const missingImportant = countMissingImportant(data);

  const handleSubmit = () => {
    if (isSubmitting) return; // Double-click guard
    setIsSubmitting(true);
    setSubmitError(null);

    // Flush any pending saves
    flushSave();

    const payload = JSON.stringify(data);

    startTransition(async () => {
      try {
        const result: SubmitResult = await submitQuestionnaire(payload);
        if (result.success) {
          const childName = data.childName || "";
          const studentId = result.studentId || "";
          clearAll();
          router.push(`/questionnaire/complete?name=${encodeURIComponent(childName)}&studentId=${encodeURIComponent(studentId)}`);
        } else {
          setSubmitError(result.error || "提交失败");
          setIsSubmitting(false);
        }
      } catch {
        setSubmitError("网络连接失败，请检查网络后重试");
        setIsSubmitting(false);
      }
    });
  };

  const completedSteps = Array.from({ length: 8 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <ProgressStepper currentStep={9} completedSteps={completedSteps} />

      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-vela-heading font-display">
            {data.childName || "学生"}的档案总览
          </h2>
          <p className="text-sm text-vela-text-secondary mt-1">
            {data.currentGrade != null ? formatGrade(data.currentGrade) : ""}{data.schoolName ? ` · ${data.schoolName}` : ""}
            {data.targetMajor ? ` · 目标: ${MAJOR_LABELS[data.targetMajor] || data.targetMajor}` : ""}
          </p>
        </div>

        {/* Profile card */}
        <div className="bg-vela-surface border border-vela-border rounded-lg overflow-hidden">
          {sections.map((section) => (
            <div
              key={section.step}
              className="px-5 py-4 border-b border-vela-border last:border-b-0"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-vela-text">
                  {section.label}
                </h3>
                <Link
                  href={`/questionnaire/step/${section.step}`}
                  className="text-sm text-vela-primary hover:text-vela-primary-dark transition-colors"
                >
                  编辑 →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                {section.entries.map((entry) => (
                  <div key={entry.label} className="text-sm">
                    <span className="text-vela-muted">{entry.label}: </span>
                    {entry.value ? (
                      <span className="font-mono text-vela-text">{entry.value}</span>
                    ) : (
                      <span className="text-vela-muted">暂无</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Missing data warning */}
        {missingImportant > 0 && (
          <p className="text-sm text-vela-secondary-dark mt-4 text-center">
            ⚠ 缺少 {missingImportant} 项信息可能影响报告准确性
          </p>
        )}

        {/* Submit error */}
        {submitError && (
          <p className="text-sm text-vela-error mt-4 text-center" role="alert">
            {submitError}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-8 pb-8">
          <Link
            href="/questionnaire/step/8"
            className="min-h-[44px] px-6 py-2 text-sm text-vela-text-secondary border border-vela-border rounded-md hover:bg-vela-surface transition-colors inline-flex items-center"
          >
            ← 返回修改
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending || isSubmitting}
            className="min-h-[44px] px-6 py-2 text-sm font-medium text-white bg-vela-primary rounded-md hover:bg-vela-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending || isSubmitting ? "正在提交..." : "提交问卷 →"}
          </button>
        </div>
      </div>
    </div>
  );
}
