"use client";

import { useState, useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass, inputErrorClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";
import { stepSchemas } from "@/lib/types";

export function Step8Goals() {
  const { data, setField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const concernLength = (data.biggestConcern || "").length;
  const isNearLimit = concernLength >= 180;

  const validate = useCallback(() => {
    const result = stepSchemas[8].safeParse({
      targetMajor: data.targetMajor,
      targetMajorOther: data.targetMajorOther,
      preferredRegion: data.preferredRegion,
      biggestConcern: data.biggestConcern,
    });
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as string;
      newErrors[key] = issue.message;
    }
    setErrors(newErrors);
    return false;
  }, [data]);

  return (
    <StepLayout
      step={8}
      title="目标偏好"
      subtitle="你最想让我们帮你解决什么？"
      onValidate={validate}
    >
      <FormField
        label="目标专业方向"
        hint="Pre-vet 申请和 animal science 的路径不同，这帮助我们精准匹配"
        glossary="Target Major"
      >
        <select
          value={data.targetMajor || ""}
          onChange={(e) => setField("targetMajor", e.target.value || undefined)}
          className={selectClass}
        >
          <option value="">暂时不确定</option>
          <option value="pre-vet">Pre-Veterinary</option>
          <option value="animal-science">Animal Science</option>
          <option value="biology">Biology</option>
          <option value="other">其他方向</option>
        </select>
      </FormField>

      {data.targetMajor === "other" && (
        <FormField label="请说明具体方向">
          <input
            type="text"
            value={data.targetMajorOther || ""}
            onChange={(e) => setField("targetMajorOther", e.target.value)}
            placeholder="例如: 生物工程"
            className={inputClass}
          />
        </FormField>
      )}

      <FormField
        label="偏好地区"
        hint="美国不同地区的学校风格差异很大"
      >
        <select
          value={data.preferredRegion || ""}
          onChange={(e) => setField("preferredRegion", e.target.value || undefined)}
          className={selectClass}
        >
          <option value="">无偏好</option>
          <option value="Northeast">东北部 (纽约、波士顿、费城)</option>
          <option value="Midwest">中西部 (芝加哥、密歇根)</option>
          <option value="South">南部 (北卡、佐治亚、德州)</option>
          <option value="West">西部 (加州、华盛顿)</option>
        </select>
      </FormField>

      <FormField
        label="作为家长，你最想让我们帮你解决什么？"
        hint="不限于学业，可以是费用、选校、时间规划等任何担忧"
        error={errors.biggestConcern}
      >
        <div className="relative">
          <textarea
            value={data.biggestConcern || ""}
            onChange={(e) => setField("biggestConcern", e.target.value)}
            placeholder="例如: 不确定孩子的 GPA 是否有竞争力，也不清楚应该选哪些学校..."
            rows={4}
            maxLength={200}
            className={`${inputClass} resize-none ${errors.biggestConcern ? inputErrorClass : ""}`}
          />
          <p
            className={`text-xs mt-1 text-right ${
              isNearLimit ? "text-vela-error" : "text-vela-muted"
            }`}
          >
            {concernLength}/200
          </p>
        </div>
      </FormField>
    </StepLayout>
  );
}
