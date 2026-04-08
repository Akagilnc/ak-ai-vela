"use client";

import { useState, useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass, inputErrorClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";
import { stepSchemas } from "@/lib/types";

export function Step1Basics() {
  const { data, setField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(() => {
    const result = stepSchemas[1].safeParse({
      childName: data.childName,
      birthYear: data.birthYear,
      currentGrade: data.currentGrade,
      gender: data.gender,
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

  // Generate birth year options (1998-2023)
  const birthYears = Array.from({ length: 26 }, (_, i) => 1998 + i);
  // Grades: 0 = kindergarten, 1-12
  const grades = Array.from({ length: 13 }, (_, i) => i); // 0-12

  return (
    <StepLayout
      step={1}
      title="孩子基本信息"
      subtitle="让我们先了解一下基本情况"
      onValidate={validate}
    >
      <FormField
        label="孩子姓名"
        hint="用于报告标识，不会分享给任何人"
        required
        error={errors.childName}
      >
        <input
          type="text"
          value={data.childName || ""}
          onChange={(e) => setField("childName", e.target.value)}
          placeholder="请输入孩子姓名"
          className={`${inputClass} ${errors.childName ? inputErrorClass : ""}`}
          aria-required="true"
        />
      </FormField>

      <FormField
        label="出生年份"
        hint="用于计算当前年级和申请时间线"
        required
        error={errors.birthYear}
      >
        <select
          value={data.birthYear || ""}
          onChange={(e) => setField("birthYear", e.target.value ? Number(e.target.value) : undefined)}
          className={`${selectClass} ${errors.birthYear ? inputErrorClass : ""}`}
          aria-required="true"
        >
          <option value="">请选择</option>
          {birthYears.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="当前年级"
        hint="美国大学通常在 11-12 年级申请"
        glossary="Grade Level"
        required
        error={errors.currentGrade}
      >
        <select
          value={data.currentGrade ?? ""}
          onChange={(e) => setField("currentGrade", e.target.value ? Number(e.target.value) : undefined)}
          className={`${selectClass} ${errors.currentGrade ? inputErrorClass : ""}`}
          aria-required="true"
        >
          <option value="">请选择</option>
          {grades.map((g) => (
            <option key={g} value={g}>{g === 0 ? "幼儿园" : `${g}年级`}</option>
          ))}
        </select>
      </FormField>

      <FormField
        label="性别"
        error={errors.gender}
      >
        <select
          value={data.gender || ""}
          onChange={(e) => setField("gender", e.target.value || undefined)}
          className={selectClass}
        >
          <option value="">不填</option>
          <option value="male">男</option>
          <option value="female">女</option>
          <option value="other">其他</option>
          <option value="prefer-not-to-say">不愿透露</option>
        </select>
      </FormField>
    </StepLayout>
  );
}
