"use client";

import { useEffect, useRef } from "react";
import { StepLayout } from "../step-layout";
import { FormField, inputClass, selectClass } from "../form-field";
import { useQuestionnaire } from "../questionnaire-provider";

type AnimalExperience = {
  type: string;
  organization?: string;
  hours?: number;
  durationMonths?: number;
  description?: string;
};

const EMPTY_EXPERIENCE: AnimalExperience = { type: "" };
const MAX_EXPERIENCES = 10;

const EXPERIENCE_TYPES = [
  { value: "volunteer", label: "志愿服务" },
  { value: "intern", label: "实习" },
  { value: "pet-care", label: "宠物照顾" },
  { value: "research", label: "科研项目" },
  { value: "vet-shadow", label: "兽医跟诊" },
  { value: "farm", label: "农场/牧场" },
  { value: "other", label: "其他" },
];

export function Step6Experience() {
  const { data, setArrayItem, addArrayItem, removeArrayItem } = useQuestionnaire();
  const initializedRef = useRef(false);

  // Initialize with exactly 1 empty entry (useEffect + ref prevents strict mode double-add)
  useEffect(() => {
    if (initializedRef.current) return;
    if (!data.animalExperience || (data.animalExperience as AnimalExperience[]).length === 0) {
      initializedRef.current = true;
      addArrayItem("animalExperience", { ...EMPTY_EXPERIENCE });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const experiences = (data.animalExperience as AnimalExperience[] | undefined)?.length
    ? (data.animalExperience as AnimalExperience[])
    : [{ ...EMPTY_EXPERIENCE }];

  const updateEntry = (index: number, field: keyof AnimalExperience, value: unknown) => {
    const entry = { ...experiences[index], [field]: value };
    setArrayItem("animalExperience", index, entry);
  };

  const addEntry = () => {
    if (experiences.length < MAX_EXPERIENCES) {
      addArrayItem("animalExperience", { ...EMPTY_EXPERIENCE });
    }
  };

  const removeEntry = (index: number) => {
    if (experiences.length > 1) {
      removeArrayItem("animalExperience", index);
    } else {
      setArrayItem("animalExperience", 0, { ...EMPTY_EXPERIENCE });
    }
  };

  return (
    <StepLayout
      step={6}
      title="特殊经历"
      subtitle="动物相关的经历对兽医预科方向很加分"
    >
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <fieldset
            key={index}
            className="space-y-3 pb-5 border-b border-vela-border last:border-b-0"
          >
            <div className="flex items-center justify-between">
              <legend className="text-sm font-medium text-vela-text">
                经历 {index + 1}
              </legend>
              <button
                type="button"
                onClick={() => removeEntry(index)}
                className="text-sm text-vela-muted hover:text-vela-error transition-colors"
              >
                删除
              </button>
            </div>

            <FormField
              label="经历类型"
              hint="兽医跟诊、动物救助志愿者等经历在申请中价值很高"
            >
              <select
                value={exp.type || ""}
                onChange={(e) => updateEntry(index, "type", e.target.value)}
                className={selectClass}
              >
                <option value="">请选择</option>
                {EXPERIENCE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </FormField>

            <FormField label="相关机构/组织">
              <input
                type="text"
                value={exp.organization || ""}
                onChange={(e) => updateEntry(index, "organization", e.target.value)}
                placeholder="例如: 当地动物收容所"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="累计小时">
                <input
                  type="number"
                  min={0}
                  value={exp.hours ?? ""}
                  onChange={(e) =>
                    updateEntry(index, "hours", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="小时"
                  className={inputClass}
                />
              </FormField>
              <FormField label="持续月数">
                <input
                  type="number"
                  min={0}
                  value={exp.durationMonths ?? ""}
                  onChange={(e) =>
                    updateEntry(index, "durationMonths", e.target.value ? Number(e.target.value) : undefined)
                  }
                  placeholder="月"
                  className={inputClass}
                />
              </FormField>
            </div>
          </fieldset>
        ))}

        {experiences.length < MAX_EXPERIENCES && (
          <button
            type="button"
            onClick={addEntry}
            className="w-full py-2 text-sm text-vela-primary border border-dashed border-vela-border rounded-md hover:border-vela-primary hover:bg-vela-surface/50 transition-colors"
          >
            + 添加更多经历
          </button>
        )}

        <p className="text-sm text-vela-muted">
          没有动物相关经历也没关系，可以先跳过
        </p>
      </div>
    </StepLayout>
  );
}
