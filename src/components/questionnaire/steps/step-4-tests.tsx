"use client";

import { useState, useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, inputErrorClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";
import { stepSchemas } from "@/lib/types";

export function Step4Tests() {
  const { data, setField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const result = stepSchemas[4].safeParse({
      satScore: data.satScore,
      actScore: data.actScore,
      toeflScore: data.toeflScore,
      ieltsScore: data.ieltsScore,
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
      step={4}
      title="标化考试"
      subtitle="还没考也没关系，可以之后再补充"
      onValidate={validate}
    >
      <FormField
        label="SAT 成绩"
        hint="SAT 满分 1600，大部分 Top 30 大学要求 1400+"
        glossary="SAT (Scholastic Assessment Test)"
        error={errors.satScore}
      >
        <input
          type="number"
          min={400}
          max={1600}
          value={data.satScore ?? ""}
          onChange={(e) =>
            setField("satScore", e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="400-1600，暂时没有可留空"
          className={`${inputClass} font-mono ${errors.satScore ? inputErrorClass : ""}`}
        />
      </FormField>

      <FormField
        label="ACT 成绩"
        hint="ACT 满分 36，和 SAT 二选一即可"
        glossary="ACT (American College Testing)"
        error={errors.actScore}
      >
        <input
          type="number"
          min={1}
          max={36}
          value={data.actScore ?? ""}
          onChange={(e) =>
            setField("actScore", e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="1-36，暂时没有可留空"
          className={`${inputClass} font-mono ${errors.actScore ? inputErrorClass : ""}`}
        />
      </FormField>

      <FormField
        label="TOEFL 成绩"
        hint="国际生通常需要 TOEFL 100+ 或 IELTS 7.0+"
        glossary="TOEFL (Test of English as a Foreign Language)"
        error={errors.toeflScore}
      >
        <input
          type="number"
          min={0}
          max={120}
          value={data.toeflScore ?? ""}
          onChange={(e) =>
            setField("toeflScore", e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="0-120，暂时没有可留空"
          className={`${inputClass} font-mono ${errors.toeflScore ? inputErrorClass : ""}`}
        />
      </FormField>

      <FormField
        label="IELTS 成绩"
        hint="和 TOEFL 二选一即可"
        glossary="IELTS (International English Language Testing System)"
        error={errors.ieltsScore}
      >
        <input
          type="number"
          min={0}
          max={9}
          step={0.5}
          value={data.ieltsScore ?? ""}
          onChange={(e) =>
            setField("ieltsScore", e.target.value ? Number(e.target.value) : undefined)
          }
          placeholder="0-9，暂时没有可留空"
          className={`${inputClass} font-mono ${errors.ieltsScore ? inputErrorClass : ""}`}
        />
      </FormField>
    </StepLayout>
  );
}
