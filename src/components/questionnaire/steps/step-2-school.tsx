"use client";

import { useState, useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass, inputErrorClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";
import { stepSchemas } from "@/lib/types";

export function Step2School() {
  const { data, setField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const result = stepSchemas[2].safeParse({
      schoolSystem: data.schoolSystem,
      schoolName: data.schoolName,
      schoolCity: data.schoolCity,
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
      step={2}
      title="学校体系"
      subtitle="不同学校体系影响可用的评估维度"
      onValidate={validate}
    >
      <FormField
        label="学校类型"
        hint="这决定了后续问卷会问哪些成绩指标，不同体系看不同数据"
        glossary="School System"
        required
        error={errors.schoolSystem}
      >
        <select
          value={data.schoolSystem || ""}
          onChange={(e) => setField("schoolSystem", e.target.value || undefined)}
          className={`${selectClass} ${errors.schoolSystem ? inputErrorClass : ""}`}
          aria-required="true"
        >
          <option value="">请选择</option>
          <option value="public">公立学校</option>
          <option value="private">私立学校</option>
          <option value="international">国际学校</option>
          <option value="homeschool">在家教育</option>
          <option value="other">其他</option>
        </select>
      </FormField>

      <FormField
        label="学校名称"
        hint="方便我们了解学校背景，不是必填"
      >
        <input
          type="text"
          value={data.schoolName || ""}
          onChange={(e) => setField("schoolName", e.target.value)}
          placeholder="例如: 北京十一学校"
          className={inputClass}
        />
      </FormField>

      <FormField
        label="所在城市"
      >
        <input
          type="text"
          value={data.schoolCity || ""}
          onChange={(e) => setField("schoolCity", e.target.value)}
          placeholder="例如: 北京"
          className={inputClass}
        />
      </FormField>
    </StepLayout>
  );
}
