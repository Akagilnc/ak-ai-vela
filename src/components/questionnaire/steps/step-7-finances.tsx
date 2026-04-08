"use client";

import { StepLayout } from "../step-layout";
import { FormField, selectClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";

const BUDGET_OPTIONS = [
  { value: "under-30k", label: "3 万美元以下" },
  { value: "30k-50k", label: "3-5 万美元" },
  { value: "50k-70k", label: "5-7 万美元" },
  { value: "70k-100k", label: "7-10 万美元" },
  { value: "over-100k", label: "10 万美元以上" },
  { value: "flexible", label: "灵活，以录取为优先" },
];

export function Step7Finances() {
  const { data, setField } = useQuestionnaire();

  return (
    <StepLayout
      step={7}
      title="家庭财务"
      subtitle="此信息仅用于评估奖学金机会，不会影响录取推荐"
      extraTopPadding
    >
      <FormField
        label="年度留学预算范围"
        hint="美国大学年费用通常在 5-8 万美元，部分学校提供奖学金"
        glossary="Annual Budget"
      >
        <select
          value={data.budgetRange || ""}
          onChange={(e) => setField("budgetRange", e.target.value || undefined)}
          className={selectClass}
        >
          <option value="">暂时不确定</option>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="是否需要申请奖学金/助学金"
        hint="Need-blind 大学不会因为申请助学金影响录取决定"
        glossary="Financial Aid / Need-Blind"
      >
        <select
          value={data.needFinancialAid != null ? String(data.needFinancialAid) : ""}
          onChange={(e) =>
            setField("needFinancialAid", e.target.value === "" ? undefined : e.target.value === "true")
          }
          className={selectClass}
        >
          <option value="">暂时不确定</option>
          <option value="true">是，希望申请</option>
          <option value="false">否，不需要</option>
        </select>
      </FormField>
    </StepLayout>
  );
}
