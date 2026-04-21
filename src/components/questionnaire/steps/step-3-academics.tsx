"use client";

import { useState, useCallback } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass, inputErrorClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";
import { stepSchemas } from "@/lib/types";

export function Step3Academics() {
  const { data, setField } = useQuestionnaire();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isInternational = data.schoolSystem === "international";
  const isPublicPrivate = data.schoolSystem === "public" || data.schoolSystem === "private";
  const isHomeschoolOther = data.schoolSystem === "homeschool" || data.schoolSystem === "other";

  const validate = useCallback(() => {
    // Step-level validation. The superRefine on the full schema handles conditional rules,
    // but for step-by-step we do a lighter check here.
    const fields = {
      gpaType: data.gpaType,
      gpaPercentage: data.gpaPercentage,
      classRank: data.classRank,
      scienceGPA: data.scienceGPA,
      curriculumType: data.curriculumType,
      ibDiploma: data.ibDiploma,
      apCourses: data.apCourses,
    };
    const result = stepSchemas[3].safeParse(fields);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        newErrors[key] = issue.message;
      }
    }

    // Custom conditional checks
    if (!data.gpaType) {
      newErrors.gpaType = "请选择 GPA 类型";
    }
    if (isInternational && !data.curriculumType) {
      newErrors.curriculumType = "国际学校请选择课程体系";
    }
    if (isPublicPrivate && data.gpaPercentage == null && !data.classRank) {
      newErrors.gpaPercentage = "请填写百分制成绩或年级排名";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data, isInternational, isPublicPrivate]);

  return (
    <StepLayout
      step={3}
      title="学业情况"
      subtitle="这帮我们准确比对目标学校的成绩要求"
      onValidate={validate}
    >
      <FormField
        label="GPA 类型"
        hint="不同学校体系用不同的成绩评估方式，这帮助我们正确转换"
        glossary="GPA (Grade Point Average)"
        required
        error={errors.gpaType}
      >
        <select
          value={data.gpaType || ""}
          onChange={(e) => setField("gpaType", e.target.value || undefined)}
          className={`${selectClass} ${errors.gpaType ? inputErrorClass : ""}`}
          aria-required="true"
        >
          <option value="">请选择</option>
          <option value="percentage">百分制</option>
          <option value="rank">年级排名</option>
          {(isInternational || isHomeschoolOther) && (
            <option value="international">国际课程体系</option>
          )}
          <option value="unknown">暂不清楚</option>
        </select>
      </FormField>

      {/* Public/Private: percentage and rank fields */}
      {(isPublicPrivate || isHomeschoolOther) && (
        <>
          <FormField
            label="GPA 百分制成绩"
            hint="通常满分 100 分，填写加权或不加权均可"
            error={errors.gpaPercentage}
          >
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={data.gpaPercentage ?? ""}
                onChange={(e) =>
                  setField("gpaPercentage", e.target.value ? Number(e.target.value) : undefined)
                }
                placeholder="例如: 88"
                className={`${inputClass} pr-8 ${errors.gpaPercentage ? inputErrorClass : ""}`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-vela-muted text-sm">
                %
              </span>
            </div>
          </FormField>

          <FormField
            label="年级排名"
            hint="例如全年级 200 人中排第 5"
            glossary="Class Rank"
            error={errors.classRank}
          >
            <input
              type="text"
              value={data.classRank || ""}
              onChange={(e) => setField("classRank", e.target.value)}
              placeholder="例如: 5/200"
              className={`${inputClass} ${errors.classRank ? inputErrorClass : ""}`}
            />
          </FormField>
        </>
      )}

      {/* International: curriculum type and IB/AP fields */}
      {(isInternational || isHomeschoolOther) && (
        <>
          <FormField
            label="课程体系"
            hint="国际学校通常使用 IB、AP 或 A-Level 课程体系"
            glossary="Curriculum Type"
            required={isInternational}
            error={errors.curriculumType}
          >
            <select
              value={data.curriculumType || ""}
              onChange={(e) => setField("curriculumType", e.target.value || undefined)}
              className={`${selectClass} ${errors.curriculumType ? inputErrorClass : ""}`}
              aria-required={isInternational}
            >
              <option value="">请选择</option>
              <option value="IB">IB (International Baccalaureate)</option>
              <option value="AP">AP (Advanced Placement)</option>
              <option value="A-Level">A-Level</option>
              <option value="other">其他</option>
            </select>
          </FormField>

          {data.curriculumType === "IB" && (
            <FormField
              label="是否完成 IB Diploma"
              hint="IB Diploma 是完整的 IB 课程体系认证"
              glossary="IB Diploma Programme"
            >
              <select
                value={data.ibDiploma != null ? String(data.ibDiploma) : ""}
                onChange={(e) =>
                  setField("ibDiploma", e.target.value === "" ? undefined : e.target.value === "true")
                }
                className={selectClass}
              >
                <option value="">暂时不确定</option>
                <option value="true">是</option>
                <option value="false">否 / 正在进行</option>
              </select>
            </FormField>
          )}
        </>
      )}

      <FormField
        label="理科平均分"
        hint="理科（生物、化学、物理等）对 pre-vet 方向格外重要"
        glossary="Science GPA"
      >
        <div className="relative">
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={data.scienceGPA ?? ""}
            onChange={(e) =>
              setField("scienceGPA", e.target.value ? Number(e.target.value) : undefined)
            }
            placeholder="不确定可以不填"
            className={inputClass}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-vela-muted text-sm">
            %
          </span>
        </div>
      </FormField>
    </StepLayout>
  );
}
